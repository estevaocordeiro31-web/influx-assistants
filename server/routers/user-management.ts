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