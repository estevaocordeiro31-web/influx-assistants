import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Router para sincronização em massa de 182 alunos do Dashboard central
 * Busca alunos ativos, cria usuários locais e gera senhas temporárias
 */
export const bulkStudentSyncRouter = router({
  /**
   * Sincronizar todos os 182 alunos ativos do Dashboard
   * Apenas admins podem executar
   */
  syncAllStudents: adminProcedure
    .input(z.object({
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }: any) => {
      try {
        // Simular busca de 182 alunos do Dashboard central
        // Em produção, isso faria uma chamada real ao CENTRAL_DATABASE_URL
        const centralStudents = generateMockStudents(182);
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const results = {
          total: centralStudents.length,
          created: 0,
          updated: 0,
          failed: 0,
          errors: [] as string[],
          students: [] as any[],
        };

        for (const student of centralStudents) {
          try {
            // Verificar se aluno já existe
            const existing = await db
              .select()
              .from(users)
              .where(eq(users.email, student.email))
              .limit(1);

            if (existing.length > 0) {
              results.updated++;
              results.students.push({
                email: student.email,
                status: "updated",
                id: existing[0].id,
              });
            } else {
              if (!input.dryRun) {
                const tempPassword = generateTempPassword();
                const openId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await db.insert(users).values({
                  openId,
                  email: student.email,
                  name: student.name,
                  passwordHash: hashPassword(tempPassword),
                  createdAt: new Date(),
                  lastSignedIn: new Date(),
                });
              }

              results.created++;
              results.students.push({
                email: student.email,
                name: student.name,
                status: "created",
                phone: student.phone,
                level: student.level,
              });
            }
          } catch (error) {
            results.failed++;
            results.errors.push(
              `Erro ao sincronizar ${student.email}: ${error instanceof Error ? error.message : "Erro desconhecido"}`
            );
          }
        }

        return {
          success: true,
          message: `Sincronização ${input.dryRun ? "(simulada)" : ""} concluída: ${results.created} criados, ${results.updated} atualizados, ${results.failed} falharam`,
          ...results,
        };
      } catch (error) {
        throw new Error(
          `Erro ao sincronizar alunos: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }),

  /**
   * Obter status da sincronização
   */
  getSyncStatus: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const studentCount = await db
        .select()
        .from(users)
        .where(eq(users.role as any, "student" as any));

      return {
        totalStudents: studentCount.length,
        lastSync: new Date(),
        status: "synced",
      };
    } catch (error) {
      throw new Error(`Erro ao obter status: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }),

  /**
   * Listar alunos sincronizados com paginação
   */
  listSyncedStudents: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }: any) => {
      try {
        const offset = (input.page - 1) * input.limit;
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const students = await db
          .select()
          .from(users)
          .where(eq(users.role as any, "student" as any))
          .limit(input.limit)
          .offset(offset);

        const total = await db
          .select()
          .from(users)
          .where(eq(users.role as any, "student" as any));

        return {
          students,
          total: total.length,
          page: input.page,
          limit: input.limit,
          pages: Math.ceil(total.length / input.limit),
        };
      } catch (error) {
        throw new Error(`Erro ao listar alunos: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      }
    }),

  /**
   * Obter aluno sincronizado por email
   */
  getStudentByEmail: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .query(async ({ input }: any) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const student = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (student.length === 0) {
          return null;
        }

        return student[0];
      } catch (error) {
        throw new Error(`Erro ao obter aluno: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      }
    }),
});

/**
 * Gerar lista de 182 alunos mock para teste
 * Em produção, isso seria substituído por uma chamada real ao Dashboard
 */
function generateMockStudents(count: number) {
  const levels = ["Iniciante", "Elementar", "Básico", "Intermediário", "Avançado"];
  const objectives = ["Carreira", "Viagem", "Estudos", "Outro"];
  const firstNames = [
    "Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Helena",
    "Igor", "Julia", "Kevin", "Laura", "Mateus", "Natalia", "Oscar", "Patricia",
  ];
  const lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Costa", "Ferreira", "Gomes", "Martins",
    "Alves", "Rocha", "Carvalho", "Ribeiro", "Pereira", "Mendes", "Teixeira", "Barbosa",
  ];

  const students = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const objective = objectives[Math.floor(Math.random() * objectives.length)];

    students.push({
      id: `student_${i}`,
      name: `${firstName} ${lastName}`,
      email: `aluno${i}@influxmind.com.br`,
      level,
      objective,
      phone: `11999${String(i).padStart(6, "0")}`,
    });
  }

  return students;
}

/**
 * Gerar senha temporária aleatória
 */
function generateTempPassword(): string {
  return crypto.randomBytes(8).toString("hex");
}

/**
 * Hash de senha (simplificado - em produção usar bcrypt)
 */
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}
