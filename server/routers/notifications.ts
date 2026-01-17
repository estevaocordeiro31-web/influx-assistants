import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";
import { getDb } from "../db";
import { users, studentBookProgress, chunks } from "../../drizzle/schema";
import { eq, and, lt, desc, sql } from "drizzle-orm";

// Tipos de alertas
export type AlertType = 
  | "milestone_reached"      // Aluno atingiu um marco importante
  | "struggling_chunk"       // Aluno com dificuldade em chunk específico
  | "inactive_student"       // Aluno inativo por X dias
  | "book_completed"         // Aluno completou um livro
  | "streak_milestone";      // Aluno atingiu sequência de dias

interface Alert {
  id: string;
  type: AlertType;
  studentId: number;
  studentName: string;
  message: string;
  details: string;
  severity: "info" | "warning" | "success";
  createdAt: Date;
  read: boolean;
}

// Simular alertas para demonstração
const generateDemoAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: "1",
      type: "book_completed",
      studentId: 1,
      studentName: "João Silva",
      message: "João Silva completou o Book 3!",
      details: "O aluno concluiu todas as 12 units do Book 3 - Intermediário com média de 87% nos exercícios.",
      severity: "success",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false,
    },
    {
      id: "2",
      type: "struggling_chunk",
      studentId: 2,
      studentName: "Maria Santos",
      message: "Maria Santos com dificuldade em Present Perfect",
      details: "A aluna errou o chunk 'have been' 5 vezes consecutivas nos últimos exercícios. Recomenda-se revisão adicional.",
      severity: "warning",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 horas atrás
      read: false,
    },
    {
      id: "3",
      type: "streak_milestone",
      studentId: 3,
      studentName: "Pedro Costa",
      message: "Pedro Costa atingiu 30 dias de sequência!",
      details: "O aluno está estudando consistentemente há 30 dias seguidos. Média de 45 minutos por dia.",
      severity: "success",
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 dia atrás
      read: true,
    },
    {
      id: "4",
      type: "inactive_student",
      studentId: 4,
      studentName: "Ana Oliveira",
      message: "Ana Oliveira inativa há 7 dias",
      details: "A aluna não acessa a plataforma há uma semana. Último acesso: Unit 5 do Book 2.",
      severity: "warning",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      read: false,
    },
    {
      id: "5",
      type: "milestone_reached",
      studentId: 5,
      studentName: "Carlos Mendes",
      message: "Carlos Mendes dominou 500 chunks!",
      details: "O aluno atingiu a marca de 500 chunks dominados com taxa de acerto acima de 80%.",
      severity: "success",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      read: true,
    },
  ];
};

export const notificationsRouter = router({
  // Listar todos os alertas
  list: protectedProcedure
    .input(z.object({
      filter: z.enum(["all", "unread", "warnings", "success"]).optional().default("all"),
      limit: z.number().min(1).max(100).optional().default(20),
    }))
    .query(async ({ input }) => {
      let alerts = generateDemoAlerts();
      
      // Aplicar filtros
      if (input.filter === "unread") {
        alerts = alerts.filter(a => !a.read);
      } else if (input.filter === "warnings") {
        alerts = alerts.filter(a => a.severity === "warning");
      } else if (input.filter === "success") {
        alerts = alerts.filter(a => a.severity === "success");
      }
      
      return {
        alerts: alerts.slice(0, input.limit),
        total: alerts.length,
        unreadCount: alerts.filter(a => !a.read).length,
      };
    }),

  // Marcar alerta como lido
  markAsRead: protectedProcedure
    .input(z.object({
      alertId: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Em produção, atualizaria no banco de dados
      return { success: true };
    }),

  // Marcar todos como lidos
  markAllAsRead: protectedProcedure
    .mutation(async () => {
      // Em produção, atualizaria no banco de dados
      return { success: true };
    }),

  // Enviar notificação para coordenador
  sendAlert: protectedProcedure
    .input(z.object({
      type: z.enum(["milestone_reached", "struggling_chunk", "inactive_student", "book_completed", "streak_milestone"]),
      studentName: z.string(),
      message: z.string(),
      details: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Enviar notificação via sistema de notificações
      const success = await notifyOwner({
        title: `[inFlux] ${input.message}`,
        content: `**Aluno:** ${input.studentName}\n\n**Detalhes:** ${input.details}\n\n**Tipo:** ${input.type}`,
      });

      return { success };
    }),

  // Obter estatísticas de alertas
  getStats: protectedProcedure
    .query(async () => {
      const alerts = generateDemoAlerts();
      
      return {
        total: alerts.length,
        unread: alerts.filter(a => !a.read).length,
        warnings: alerts.filter(a => a.severity === "warning").length,
        success: alerts.filter(a => a.severity === "success").length,
        byType: {
          milestone_reached: alerts.filter(a => a.type === "milestone_reached").length,
          struggling_chunk: alerts.filter(a => a.type === "struggling_chunk").length,
          inactive_student: alerts.filter(a => a.type === "inactive_student").length,
          book_completed: alerts.filter(a => a.type === "book_completed").length,
          streak_milestone: alerts.filter(a => a.type === "streak_milestone").length,
        },
      };
    }),

  // Verificar alunos com dificuldades (para job automático)
  checkStrugglingStudents: protectedProcedure
    .mutation(async () => {
      // Em produção, verificaria no banco de dados alunos com:
      // - Taxa de erro > 50% em chunks específicos
      // - Múltiplas tentativas falhas consecutivas
      // - Tempo excessivo em exercícios simples
      
      const strugglingStudents = [
        {
          studentId: 2,
          studentName: "Maria Santos",
          chunk: "have been",
          errorCount: 5,
          lastAttempt: new Date(),
        },
      ];

      // Enviar alertas para cada aluno com dificuldade
      for (const student of strugglingStudents) {
        await notifyOwner({
          title: `[inFlux] Aluno com dificuldade: ${student.studentName}`,
          content: `O aluno **${student.studentName}** está com dificuldade no chunk **"${student.chunk}"**.\n\nErros consecutivos: ${student.errorCount}\n\nRecomenda-se acompanhamento adicional.`,
        });
      }

      return {
        checked: true,
        alertsSent: strugglingStudents.length,
      };
    }),

  // Verificar alunos inativos (para job automático)
  checkInactiveStudents: protectedProcedure
    .input(z.object({
      daysInactive: z.number().min(1).max(30).optional().default(7),
    }))
    .mutation(async ({ input }) => {
      // Em produção, verificaria no banco de dados alunos que não acessam há X dias
      
      const inactiveStudents = [
        {
          studentId: 4,
          studentName: "Ana Oliveira",
          lastAccess: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          currentBook: "Book 2",
          currentUnit: "Unit 5",
        },
      ];

      // Enviar alertas para cada aluno inativo
      for (const student of inactiveStudents) {
        await notifyOwner({
          title: `[inFlux] Aluno inativo: ${student.studentName}`,
          content: `O aluno **${student.studentName}** não acessa a plataforma há ${input.daysInactive} dias.\n\nÚltimo acesso: ${student.currentUnit} do ${student.currentBook}\n\nRecomenda-se contato para verificar situação.`,
        });
      }

      return {
        checked: true,
        alertsSent: inactiveStudents.length,
      };
    }),
});
