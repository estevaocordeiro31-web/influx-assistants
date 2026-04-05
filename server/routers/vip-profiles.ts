import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { vipProfiles, chatMemory, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * VIP Profiles Router
 * Gerencia perfis especiais com contexto e tom personalizado no bot.
 * Também gerencia memória persistente de chat por usuário.
 */
export const vipProfilesRouter = router({
  // Buscar perfil VIP do usuário atual (se existir)
  getMyVipProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const profile = await db
      .select()
      .from(vipProfiles)
      .where(eq(vipProfiles.userId, ctx.user.id))
      .limit(1);
    return profile[0] ?? null;
  }),

  // Buscar memória de chat do usuário atual
  getMyMemory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    const memories = await db
      .select()
      .from(chatMemory)
      .where(eq(chatMemory.userId, ctx.user.id));
    // Retorna como objeto chave-valor
    return memories.reduce((acc: Record<string, string>, m: { memoryKey: string; memoryValue: string }) => {
      acc[m.memoryKey] = m.memoryValue;
      return acc;
    }, {} as Record<string, string>);
  }),

  // Salvar/atualizar uma memória de chat
  upsertMemory: protectedProcedure
    .input(z.object({
      key: z.string().min(1).max(100),
      value: z.string().min(1),
      source: z.enum(["conversation", "manual", "vip"]).default("conversation"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
      const existing = await db
        .select()
        .from(chatMemory)
        .where(and(
          eq(chatMemory.userId, ctx.user.id),
          eq(chatMemory.memoryKey, input.key)
        ))
        .limit(1);

      if (existing.length > 0) {
        await db.update(chatMemory)
          .set({ memoryValue: input.value, source: input.source })
          .where(and(
            eq(chatMemory.userId, ctx.user.id),
            eq(chatMemory.memoryKey, input.key)
          ));
      } else {
        await db.insert(chatMemory).values({
          userId: ctx.user.id,
          memoryKey: input.key,
          memoryValue: input.value,
          source: input.source,
          createdAt: new Date(),
        });
      }
      return { success: true };
    }),

  // Admin: listar todos os perfis VIP
  listVipProfiles: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
    return db.select().from(vipProfiles);
  }),

  // Admin: criar/atualizar perfil VIP
  upsertVipProfile: protectedProcedure
    .input(z.object({
      id: z.number().optional(),
      userId: z.number().optional().nullable(),
      name: z.string().min(1),
      email: z.string().email().optional().nullable(),
      phone: z.string().optional().nullable(),
      relationship: z.string().optional().nullable(),
      role: z.string().optional().nullable(),
      bio: z.string().optional().nullable(),
      toneInstructions: z.string().optional().nullable(),
      personalContext: z.record(z.string(), z.unknown()).optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
      if (input.id) {
        await db.update(vipProfiles)
          .set({
            name: input.name,
            email: input.email ?? null,
            phone: input.phone ?? null,
            relationship: input.relationship ?? null,
            role: input.role ?? null,
            bio: input.bio ?? null,
            toneInstructions: input.toneInstructions ?? null,
            personalContext: input.personalContext ?? null,
            userId: input.userId ?? null,
          })
          .where(eq(vipProfiles.id, input.id));
        return { success: true, id: input.id };
      } else {
        const result = await db.insert(vipProfiles).values({
          name: input.name,
          email: input.email ?? null,
          phone: input.phone ?? null,
          relationship: input.relationship ?? null,
          role: input.role ?? null,
          bio: input.bio ?? null,
          toneInstructions: input.toneInstructions ?? null,
          personalContext: input.personalContext ?? null,
          userId: input.userId ?? null,
          active: true,
          createdAt: new Date(),
        });
        return { success: true, id: (result as any).insertId };
      }
    }),
});

/**
 * Busca o perfil VIP de um usuário pelo ID.
 * Retorna null se não for VIP.
 */
export async function getVipProfileForUser(userId: number): Promise<{
  name: string;
  relationship: string | null;
  role: string | null;
  bio: string | null;
  toneInstructions: string | null;
  personalContext: unknown;
} | null> {
  const db = await getDb();
  if (!db) return null;
  const profile = await db
    .select()
    .from(vipProfiles)
    .where(and(eq(vipProfiles.userId, userId), eq(vipProfiles.active, true)))
    .limit(1);
  return profile[0] ?? null;
}

/**
 * Busca todas as memórias de chat de um usuário.
 */
export async function getChatMemoriesForUser(userId: number): Promise<Record<string, string>> {
  const db = await getDb();
  if (!db) return {};
  const memories = await db
    .select()
    .from(chatMemory)
    .where(eq(chatMemory.userId, userId));
  return memories.reduce((acc: Record<string, string>, m: { memoryKey: string; memoryValue: string }) => {
    acc[m.memoryKey] = m.memoryValue;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Salva uma memória de chat de forma assíncrona (fire-and-forget).
 */
export async function saveChatMemory(userId: number, key: string, value: string, source = "conversation") {
  try {
    const db = await getDb();
    if (!db) return;
    const existing = await db
      .select({ id: chatMemory.id })
      .from(chatMemory)
      .where(and(eq(chatMemory.userId, userId), eq(chatMemory.memoryKey, key)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(chatMemory)
        .set({ memoryValue: value, source })
        .where(and(eq(chatMemory.userId, userId), eq(chatMemory.memoryKey, key)));
    } else {
      await db.insert(chatMemory).values({
        userId,
        memoryKey: key,
        memoryValue: value,
        source,
        createdAt: new Date(),
      });
    }
  } catch (e) {
    // fire-and-forget: não quebrar o fluxo principal
  }
}
