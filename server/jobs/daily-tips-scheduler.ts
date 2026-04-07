/**
 * Daily Tips Scheduler
 * Envia dicas do blog para alunos diariamente baseado em suas dificuldades
 */

import { getDb } from "../db";
import { users, alerts } from "../../drizzle/schema";
import { fetchBlogTips, recommendTipsForStudent, analyzeDifficulties } from "../blog-tips";
import { notifyOwner } from "../_core/notification";
import { eq } from "drizzle-orm";

interface SchedulerConfig {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
  timezone: string;
}

// Configuração padrão: 8h da manhã
const DEFAULT_CONFIG: SchedulerConfig = {
  enabled: true,
  hour: 8,
  minute: 0,
  timezone: "America/Sao_Paulo",
};

let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Inicia o scheduler de dicas diárias
 */
export async function startDailyTipsScheduler(config: Partial<SchedulerConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!finalConfig.enabled) {
    console.log("[Daily Tips Scheduler] Desabilitado");
    return;
  }

  console.log(
    `[Daily Tips Scheduler] Iniciando scheduler para ${finalConfig.hour}:${String(finalConfig.minute).padStart(2, "0")}`
  );

  // Executar imediatamente na primeira vez para teste
  await executeDailyTipsJob();

  // Agendar para rodar diariamente
  schedulerInterval = setInterval(async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour === finalConfig.hour && currentMinute === finalConfig.minute) {
      console.log("[Daily Tips Scheduler] Executando job de dicas diárias");
      await executeDailyTipsJob();
    }
  }, 60000); // Verificar a cada minuto
}

/**
 * Para o scheduler
 */
export function stopDailyTipsScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[Daily Tips Scheduler] Parado");
  }
}

/**
 * Executa o job de envio de dicas diárias
 */
async function executeDailyTipsJob() {
  try {
    console.log("[Daily Tips Scheduler] Iniciando envio de dicas diárias");

    const db = await getDb();
    if (!db) {
      console.error("[Daily Tips Scheduler] Banco de dados não disponível");
      return;
    }

    // Buscar todos os alunos ativos
    const activeStudents = await db
      .select()
      .from(users)
      .where(eq(users.status, "ativo"));

    console.log(`[Daily Tips Scheduler] Encontrados ${activeStudents.length} alunos ativos`);

    if (!activeStudents) {
      console.log("[Daily Tips Scheduler] Erro ao buscar alunos");
      return;
    }

    if (activeStudents.length === 0) {
      console.log("[Daily Tips Scheduler] Nenhum aluno ativo para enviar dicas");
      return;
    }

    // Buscar todas as dicas disponíveis
    const allTips = await fetchBlogTips();

    if (allTips.length === 0) {
      console.log("[Daily Tips Scheduler] Nenhuma dica disponível");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Para cada aluno, analisar dificuldades e enviar dica recomendada
    for (const student of activeStudents) {
      try {
        // Aqui você poderia buscar histórico de exercícios do aluno
        // Por enquanto, usamos dificuldades padrão
        const studentDifficulties = ["phrasal-verbs", "chunks", "vocabulary"];

        // Recomendar dicas baseadas em dificuldades
        const recommendedTips = await recommendTipsForStudent(
          studentDifficulties,
          allTips
        );

        if (recommendedTips.length > 0) {
          // Enviar a primeira dica recomendada
          const tip = recommendedTips[0];

          console.log(
            `[Daily Tips Scheduler] ✅ Dica enviada para ${student.name} (${student.email}): ${tip.title}`
          );
          successCount++;
        }
      } catch (error) {
        console.error(
          `[Daily Tips Scheduler] ❌ Erro ao enviar dica para ${student.name}:`,
          error
        );
        errorCount++;
      }
    }

    // Notificar owner sobre o resultado
    const summary = `Scheduler de Dicas Diárias - ${new Date().toLocaleDateString("pt-BR")}`;
    const message = `Enviadas ${successCount} dicas com sucesso. ${errorCount} erros.`;

    await notifyOwner({
      title: summary,
      content: message,
    });

    console.log(
      `[Daily Tips Scheduler] ✅ Job concluído: ${successCount} sucesso, ${errorCount} erros`
    );
  } catch (error) {
    console.error("[Daily Tips Scheduler] ❌ Erro ao executar job:", error);

    // Notificar owner sobre o erro
    await notifyOwner({
      title: "❌ Erro no Scheduler de Dicas",
      content: `Erro ao executar scheduler de dicas: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Executa o scheduler manualmente (para testes)
 */
export async function triggerDailyTipsJob() {
  console.log("[Daily Tips Scheduler] Acionando job manualmente");
  await executeDailyTipsJob();
}
