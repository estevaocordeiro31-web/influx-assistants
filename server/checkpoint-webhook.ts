import { sendProjectContextToGemini } from './gemini-integration';
import { ENV } from './_core/env';

/**
 * Webhook automático que envia contexto do projeto ao Gemini
 * sempre que um novo checkpoint é criado
 */
export async function triggerCheckpointWebhook(checkpointData: {
  version: string;
  description: string;
  timestamp: Date;
}) {
  try {
    console.log(`[Checkpoint Webhook] Novo checkpoint detectado: ${checkpointData.version}`);
    
    // Coletar métricas e contexto do projeto
    const projectContext = await collectProjectContext();
    
    // Enviar para Gemini
    const result = await sendProjectContextToGemini({
      version: checkpointData.version,
      features: projectContext.features,
      metrics: projectContext.metrics,
      challenges: projectContext.challenges,
    });
    
    if (result.success) {
      console.log(`[Checkpoint Webhook] Análise enviada ao Gemini com sucesso`);
      console.log(`[Checkpoint Webhook] Análise concluída com sucesso`);
    } else {
      console.error(`[Checkpoint Webhook] Erro ao enviar para Gemini: ${result.error}`);
    }
    
    return result;
  } catch (error: any) {
    console.error(`[Checkpoint Webhook] Erro no webhook:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Coleta contexto atual do projeto para análise
 */
async function collectProjectContext() {
  // Importar dinamicamente para evitar dependências circulares
  const mysql = await import('mysql2/promise');
  const connection = await mysql.default.createConnection(process.env.CENTRAL_DATABASE_URL!);
  
  try {
    // Contar alunos ativos
    const [activeStudents] = await connection.execute(
      'SELECT COUNT(*) as count FROM students WHERE status = "ativo"'
    );
    const activeStudentsCount = (activeStudents as any[])[0].count;
    
    // Contar usuários com acesso
    const [users] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE passwordHash IS NOT NULL'
    );
    const usersWithAccessCount = (users as any[])[0].count;
    
    // Estatísticas de sugestões do Gemini
    const [geminiStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'implemented' THEN 1 ELSE 0 END) as implemented
      FROM gemini_suggestions
    `);
    const geminiStatsData = (geminiStats as any[])[0];
    
    return {
      features: [
        'Sistema de login com email e senha',
        'Sincronização automática de alunos',
        'Dashboard personalizado por nível',
        'Chat IA com Fluxie',
        'Exercícios personalizados',
        'Blog de dicas',
        'Reading Club',
        'Badges de notificação',
        'Tutorial interativo',
        'Integração com Gemini AI',
        'Emails de boas-vindas',
        'Configuração em massa via CSV',
        'Job de sincronização diária',
      ],
      metrics: {
        active_students: activeStudentsCount,
        users_with_access: usersWithAccessCount,
        gemini_suggestions_total: geminiStatsData.total,
        gemini_suggestions_implemented: geminiStatsData.implemented,
        last_sync: new Date().toISOString(),
      },
      challenges: [
        'Aumentar engajamento dos alunos com o Personal Tutor',
        'Melhorar personalização baseada em nível e objetivos',
        'Implementar repetição espaçada (spaced repetition)',
        'Criar sistema de gamificação com recompensas',
        'Desenvolver app mobile nativo',
      ],
    };
  } finally {
    await connection.end();
  }
}

/**
 * Registra evento de checkpoint no sistema
 */
export function registerCheckpointEvent(version: string, description: string) {
  // Trigger assíncrono sem bloquear
  triggerCheckpointWebhook({
    version,
    description,
    timestamp: new Date(),
  }).catch(error => {
    console.error('[Checkpoint Webhook] Erro ao processar webhook:', error);
  });
}
