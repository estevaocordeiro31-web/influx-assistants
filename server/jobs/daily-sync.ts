/**
 * Daily Sync Job
 * Sincroniza alunos do banco centralizado diariamente às 18h
 */

import cron from 'node-cron';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../welcome-email';

let syncJob: any = null;

async function syncStudents() {
  console.log('[DailySync] Iniciando sincronização diária...');
  
  const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
  
  try {
    // 1. Buscar students ativos sem usuário
    const [studentsWithoutUser] = await connection.execute(`
      SELECT s.*
      FROM students s
      LEFT JOIN users u ON u.email = s.email
      WHERE s.status = 'Ativo'
      AND s.email IS NOT NULL
      AND s.email != ''
      AND u.id IS NULL
    `);

    if (!Array.isArray(studentsWithoutUser) || studentsWithoutUser.length === 0) {
      console.log('[DailySync] Nenhum aluno novo encontrado');
      return { created: 0, updated: 0, errors: 0 };
    }

    let created = 0;
    let errors = 0;

    // 2. Criar usuários para alunos sem acesso
    for (const student of studentsWithoutUser) {
      try {
        const s = student as any;
        const firstName = s.name?.split(' ')[0] || 'Aluno';
        const defaultPassword = `${firstName}@2026`;
        const passwordHash = await bcrypt.hash(defaultPassword, 10);
        
        // Gerar openId único
        const openId = crypto.createHash('sha256')
          .update(`student_${s.id}_${s.matricula}_${Date.now()}`)
          .digest('hex');
        
        // Criar usuário
        await connection.execute(
          `INSERT INTO users (openId, name, email, password_hash, role, unidade_id, createdAt, updatedAt, lastSignedIn)
           VALUES (?, ?, ?, ?, 'user', 1, NOW(), NOW(), NOW())`,
          [openId, s.name, s.email, passwordHash]
        );

        // Enviar email de boas-vindas
        await sendWelcomeEmail({
          studentName: s.name || 'Aluno',
          email: s.email,
          password: defaultPassword,
          loginUrl: 'https://influxassist-2anfqga4.manus.space/login',
        });

        created++;
        console.log(`[DailySync] ✓ Criado usuário para ${s.name} (${s.email})`);
        
      } catch (error: any) {
        console.error(`[DailySync] ✗ Erro ao criar usuário:`, error.message);
        errors++;
      }
    }

    // 3. Atualizar status de usuários inativos
    await connection.execute(`
      UPDATE users u
      INNER JOIN students s ON s.email = u.email
      SET u.updatedAt = NOW()
      WHERE s.status != 'Ativo'
      AND u.role = 'user'
    `);

    console.log(`[DailySync] Sincronização concluída: ${created} criados, ${errors} erros`);
    
    return { created, updated: 0, errors };
    
  } catch (error) {
    console.error('[DailySync] Erro na sincronização:', error);
    throw error;
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
  // Cron: 0 18 * * * (segundos minutos horas dia mês dia-da-semana)
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

  console.log('[DailySync] Job agendado para rodar diariamente às 18:00');
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
 * Executar sincronização manualmente
 */
export async function runDailySyncNow() {
  console.log('[DailySync] Executando sincronização manual...');
  return await syncStudents();
}
