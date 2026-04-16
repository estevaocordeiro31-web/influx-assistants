/**
 * User Management Router
 * 
 * Procedures para gerenciar criação e atualização de usuários especiais
 * Apenas admin pode executar essas operações
 */

import { router, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users, studentProfiles } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const userManagementRouter = router({
  /**
   * Criar usuário especial (como Tiago)
   * Apenas admin pode criar usuários
   */
  createSpecialUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        email: z.string().email("Email inválido"),
        objective: z.enum(["career", "travel", "studies", "other"]),
        currentLevel: z.enum([
          "beginner",
          "elementary",
          "intermediate",
          "upper_intermediate",
          "advanced",
          "proficient",
        ]),
        profession: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        // Verificar se email já existe
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          throw new Error(`Usuário com email ${input.email} já existe`);
        }

        // Gerar openId único
        const openId = crypto.randomBytes(32).toString("hex");

        // Criar usuário
        const result = await db
          .insert(users)
          .values({
            openId,
            name: input.name,
            email: input.email,
            role: "user",
            status: "ativo",
            loginMethod: "oauth",
          });

        // Buscar usuário criado
        const [newUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (!newUser) {
          throw new Error("Falha ao criar usuário");
        }

        // Criar perfil do aluno
        await db
          .insert(studentProfiles)
          .values({
            userId: newUser.id,
            objective: input.objective,
            currentLevel: input.currentLevel,
            totalHoursLearned: 0,
            streakDays: 0,
            specificGoals: `Profissão: ${input.profession || "Não especificada"}`,
          });

        // Buscar perfil criado
        const [newProfile] = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, newUser.id))
          .limit(1);

        return {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            openId: newUser.openId,
          },
          profile: {
            id: newProfile?.id,
            objective: input.objective,
            currentLevel: input.currentLevel,
          },
          message: `Usuário ${input.name} criado com sucesso!`,
        };
      } catch (error) {
        throw new Error(
          `Erro ao criar usuário: ${error instanceof Error ? error.message : "Desconhecido"}`
        );
      }
    }),

  /**
   * Listar usuários especiais
   */
  listSpecialUsers: adminProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database não disponível");

      const specialUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.role, "user"));

      return specialUsers;
    } catch (error) {
      throw new Error(
        `Erro ao listar usuários: ${error instanceof Error ? error.message : "Desconhecido"}`
      );
    }
  }),

  /**
   * Obter informações de um usuário específico
   */
  getUserInfo: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (user.length === 0) {
          throw new Error(`Usuário com email ${input.email} não encontrado`);
        }

        const profile = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, user[0].id))
          .limit(1);

        return {
          user: user[0],
          profile: profile[0] || null,
        };
      } catch (error) {
        throw new Error(
          `Erro ao obter informações: ${error instanceof Error ? error.message : "Desconhecido"}`
        );
      }
    }),

  /**
   * Atualizar perfil do aluno
   */
  updateStudentProfile: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        objective: z.enum(["career", "travel", "studies", "other"]).optional(),
        currentLevel: z
          .enum([
            "beginner",
            "elementary",
            "intermediate",
            "upper_intermediate",
            "advanced",
            "proficient",
          ])
          .optional(),
        totalHoursLearned: z.number().optional(),
        streakDays: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const { userId, ...updateData } = input;

        await db
          .update(studentProfiles)
          .set(updateData)
          .where(eq(studentProfiles.userId, userId));

        // Buscar perfil atualizado
        const [updated] = await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, userId))
          .limit(1);

        if (!updated) {
          throw new Error("Falha ao atualizar perfil");
        }

        return {
          success: true,
          profile: updated,
          message: "Perfil atualizado com sucesso!",
        };


      } catch (error) {
        throw new Error(
          `Erro ao atualizar perfil: ${error instanceof Error ? error.message : "Desconhecido"}`
        );
      }
    }),

  /**
   * Deletar usuário (apenas admin)
   */
  deleteUser: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database não disponível");

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (user.length === 0) {
          throw new Error(`Usuário com email ${input.email} não encontrado`);
        }

        // Deletar perfil primeiro (foreign key constraint)
        await db
          .delete(studentProfiles)
          .where(eq(studentProfiles.userId, user[0].id));

        // Deletar usuário
        await db.delete(users).where(eq(users.id, user[0].id));

        return {
          success: true,
          message: `Usuário ${input.email} deletado com sucesso!`,
        };
      } catch (error) {
        throw new Error(
          `Erro ao deletar usuário: ${error instanceof Error ? error.message : "Desconhecido"}`
        );
      }
    }),
});
