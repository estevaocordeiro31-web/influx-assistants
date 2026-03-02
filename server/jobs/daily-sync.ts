/**
 * Daily Sync Job
 * Sincroniza alunos do banco centralizado (Dashboard Central) diariamente às 18h
 * Tabela fonte: students (banco central)
 * Tabela destino: users (banco central, compartilhado com inFlux)
 */

import cron from 'node-cron';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../welcome-email';

let syncJob: any = null;

export interface SyncResult {
  created: number;
  updated: number;
  errors: number;
  total: number;
  details: string[];
}

/**
 * Mapeia status do Dashboard Central para status do inFlux
 */
function mapStatus(centralStatus: string): string {
  const statusMap: Record<string, string> = {
    'Ativo': 'ativo',
    'Inativo': 'inativo',
    'Desistente': 'desistente',
    'Trancado': 'trancado',
  };
  return statusMap[centralStatus] || 'inativo';
}

/**
 * Mapeia book_level do Dashboard Central para nível do inFlux
 */
function mapBookLevel(bookLevel: string | null): string {
  if (!bookLevel) return 'iniciante';
  const levelMap: Record<string, string> = {
    'FLUXIE_1A': 'iniciante', 'FLUXIE_1B': 'iniciante',
    'FLUXIE_2A': 'elementar', 'FLUXIE_2B': 'elementar',
    'JUNIOR_A': 'iniciante', 'JUNIOR_B': 'iniciante',
    'JUNIOR_1': 'iniciante', 'JUNIOR_2': 'elementar', 'JUNIOR_3': 'elementar',
    'BOOK_1': 'iniciante', 'BOOK_2': 'elementar',
    'BOOK_3': 'intermediario', 'BOOK_4': 'intermediario',
    'BOOK_5': 'avancado',
    'CAMINO_1': 'intermediario', 'CAMINO_2': 'intermediario',
    'CAMINO_3': 'avancado', 'CAMINO_4': 'avancado',
    'SUMMIT': 'avancado',
    'COMUNICACAO_AVANCADA': 'avancado',
    'ON_BUSINESS_1': 'avancado', 'ON_BUSINESS_2': 'avancado',
    'TRAVEL_1': 'intermediario', 'TRAVEL_2': 'avancado',
  };
  return levelMap[bookLevel] || 'iniciante';
}

async function syncStudents(): Promise<SyncResult> {
  console.log('[DailySync] Iniciando sincronização com Dashboard Central...');
  
  const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
  const details: string[] = [];
  let created = 0;
  let updated = 0;
  let errors = 0;

  try {
    // 1. Buscar TODOS os alunos do Dashboard Central
    const [allStudents] = await connection.execute(`
      SELECT s.*, u.id as user_id, u.openId as user_openId
      FROM students s
      LEFT JOIN users u ON u.email = s.email AND u.role = 'user'
      WHERE s.email IS NOT NULL
      AND s.email != ''
    `);

    if (!Array.isArray(allStudents) || allStudents.length === 0) {
      console.log('[DailySync] Nenhum aluno encontrado no Dashboard Central');
      return { created: 0, updated: 0, errors: 0, total: 0, details: [] };
    }

    const total = allStudents.length;
    console.log(`[DailySync] Encontrados ${total} alunos no Dashboard Central`);

    for (const student of allStudents) {
      const s = student as any;
      
      try {
        if (!s.user_id) {
          // Aluno sem usuário no inFlux → CRIAR
          if (s.status !== 'Ativo') {
            // Só cria usuário para alunos ativos
            continue;
          }

          const firstName = s.name?.split(' ')[0] || 'Aluno';
          const defaultPassword = `${firstName}@2026`;
          const passwordHash = await bcrypt.hash(defaultPassword, 10);
          
          const openId = crypto.createHash('sha256')
            .update(`student_${s.id}_${s.matricula}_${Date.now()}`)
            .digest('hex');
          
          await connection.execute(
            `INSERT INTO users (openId, name, email, password_hash, role, unidade_id, student_id, createdAt, updatedAt, lastSignedIn)
             VALUES (?, ?, ?, ?, 'user', 1, ?, NOW(), NOW(), NOW())`,
            [openId, s.name, s.email, passwordHash, s.id]
          );

          // Enviar email de boas-vindas
          try {
            await sendWelcomeEmail({
              studentName: s.name || 'Aluno',
              email: s.email,
              password: defaultPassword,
              loginUrl: 'https://influxassist-2anfqga4.manus.space/login',
            });
          } catch (emailErr: any) {
            console.warn(`[DailySync] Email não enviado para ${s.email}: ${emailErr.message}`);
          }

          created++;
          details.push(`✓ Criado: ${s.name} (${s.email})`);
          console.log(`[DailySync] ✓ Criado usuário para ${s.name}`);

        } else {
          // Aluno já tem usuário → ATUALIZAR dados
          await connection.execute(
            `UPDATE users 
             SET name = ?, student_id = ?, updatedAt = NOW()
             WHERE id = ?`,
            [s.name, s.id, s.user_id]
          );

          updated++;
        }
        
      } catch (error: any) {
        console.error(`[DailySync] ✗ Erro ao processar ${s.name}:`, error.message);
        details.push(`✗ Erro: ${s.name} - ${error.message}`);
        errors++;
      }
    }

    console.log(`[DailySync] ✅ Sincronização concluída: ${created} criados, ${updated} atualizados, ${errors} erros`);
    
    return { created, updated, errors, total, details };
    
  } catch (error) {
    console.error('[DailySync] Erro fatal na sincronização:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

/**
 * Buscar estatísticas de sincronização
 */
export async function getSyncStats() {
  const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
  try {
    const [centralCount] = await connection.execute(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Ativo' THEN 1 ELSE 0 END) as ativos FROM students WHERE email IS NOT NULL AND email != ''`
    );
    const [localCount] = await connection.execute(
      `SELECT COUNT(*) as total FROM users WHERE role = 'user'`
    );
    const [linkedCount] = await connection.execute(
      `SELECT COUNT(*) as total FROM users WHERE role = 'user' AND student_id IS NOT NULL`
    );

    const central = (centralCount as any[])[0];
    const local = (localCount as any[])[0];
    const linked = (linkedCount as any[])[0];

    return {
      centralTotal: central.total,
      centralAtivos: central.ativos,
      localTotal: local.total,
      linkedTotal: linked.total,
      unlinked: local.total - linked.total,
      lastSync: new Date().toISOString(),
    };
  } finally {
    await connection.end();
  }
}

/**
 * Iniciar job de sincronização diária
 */
export function startDailySyncJob() {
  if (syncJob) {
    console.log('[DailySync] Job já está rodando');
    return;
  }

  // Executar todos os dias às 18:00 (horário de Brasília - GMT-3)
  syncJob = cron.schedule('0 18 * * *', async () => {
    try {
      console.log('[DailySync] Executando sincronização agendada...');
      await syncStudents();
    } catch (error) {
      console.error('[DailySync] Erro na execução agendada:', error);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });

  console.log('[DailySync] Job agendado para rodar diariamente às 18:00 (Brasília)');
}

/**
 * Parar job de sincronização
 */
export function stopDailySyncJob() {
  if (syncJob) {
    syncJob.stop();
    syncJob = null;
    console.log('[DailySync] Job parado');
  }
}

/**
 * Executar sincronização manualmente (chamado pelo AdminDashboard)
 */
export async function runDailySyncNow(): Promise<SyncResult> {
  console.log('[DailySync] Executando sincronização manual...');
  return await syncStudents();
}
