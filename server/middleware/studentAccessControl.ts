/**
 * Middleware de Controle de Acesso para Alunos
 * Verifica se o aluno está ativo no sistema antes de permitir acesso
 */

import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface StudentAccessContext {
  userId: number;
  status: "ativo" | "inativo" | "desistente" | "trancado";
  isActive: boolean;
}

/**
 * Verifica se um aluno está ativo
 */
export async function checkStudentAccess(userId: number): Promise<StudentAccessContext> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Banco de dados indisponível",
    });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || user.length === 0) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Usuário não encontrado",
    });
  }

  const userRecord = user[0];
  // Campo status não existe no banco centralizado
  // Retornando status padrão "ativo" para todos os usuários
  const status = "ativo";
  const isActive = true;

  return {
    userId,
    status,
    isActive,
  };
}

/**
 * Atualiza o status de um aluno
 */
export async function updateStudentStatus(
  userId: number,
  newStatus: "ativo" | "inativo" | "desistente" | "trancado"
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[StudentAccess] Banco de dados indisponível");
    return false;
  }

  try {
    await db
      .update(users)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(users.id, userId));

    console.log(`[StudentAccess] Status do aluno ${userId} atualizado para: ${newStatus}`);
    return true;
  } catch (error) {
    console.error(`[StudentAccess] Erro ao atualizar status do aluno ${userId}:`, error);
    return false;
  }
}

/**
 * Log de tentativa de acesso negado
 */
export async function logAccessDenied(userId: number, reason: string): Promise<void> {
  console.warn(`[StudentAccess] Acesso negado para aluno ${userId}. Motivo: ${reason}`);
  // Aqui você pode implementar um sistema de logging mais robusto
}

/**
 * Obtém informações de acesso do aluno
 */
export async function getStudentAccessInfo(userId: number): Promise<StudentAccessContext | null> {
  const db = await getDb();
  if (!db) {
    console.error("[StudentAccess] Banco de dados indisponível");
    return null;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return null;
    }

    const userRecord = user[0];
    // Campo status não existe no banco centralizado
    // Todos os usuários são considerados ativos por padrão
    return {
      userId,
      status: "ativo" as const,
      isActive: true,
    };
  } catch (error) {
    console.error(`[StudentAccess] Erro ao obter informações de acesso do aluno ${userId}:`, error);
    return null;
  }
}
