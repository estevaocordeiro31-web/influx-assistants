import { z } from "zod";
import { getDb } from "../db";
import { chunks, studentProfiles } from "../../drizzle/schema";
import { sql, eq, and, lte, gte } from "drizzle-orm";

// Mapeamento de Book para Level
const BOOK_TO_LEVEL = {
  1: "beginner",
  2: "elementary",
  3: "intermediate",
  4: "upper_intermediate",
  5: "advanced",
} as const;

const LEVEL_TO_BOOK = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  upper_intermediate: 4,
  advanced: 5,
} as const;

export const personalizedContentRouter = router({
  // Obter chunks do nível do aluno
  getChunksByLevel: protectedProcedure
    .input(z.object({
      context: z.enum(["career", "travel", "studies", "daily_life", "general"]).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Obter nível do aluno
      const profile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id))
        .limit(1);

      const level = profile[0]?.currentLevel || "beginner";

      // Buscar chunks do nível do aluno
      const query = db
        .select()
        .from(chunks)
        .where(
          and(
            eq(chunks.level, level as any),
            input.context ? eq(chunks.context, input.context as any) : undefined
          )
        )
        .limit(input.limit);

      const result = await query;
      return {
        level,
        book: LEVEL_TO_BOOK[level as keyof typeof LEVEL_TO_BOOK],
        chunks: result,
        total: result.length,
      };
    }),

  // Obter chunks para revisão (nível anterior + atual)
  getChunksForReview: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Obter nível do aluno
      const profile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id))
        .limit(1);

      const currentLevel = profile[0]?.currentLevel || "beginner";
      const levelOrder = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"];
      const currentIndex = levelOrder.indexOf(currentLevel);

      // Chunks do nível anterior (para revisão) + nível atual
      const levelsToInclude = currentIndex > 0 
        ? [levelOrder[currentIndex - 1], currentLevel]
        : [currentLevel];

      const result = await db
        .select()
        .from(chunks)
        .where(
          and(
            sql`${chunks.level} IN (${levelsToInclude.map(l => `'${l}'`).join(", ")})`
          )
        )
        .limit(input.limit);

      return {
        currentLevel,
        book: LEVEL_TO_BOOK[currentLevel as keyof typeof LEVEL_TO_BOOK],
        reviewChunks: result.filter(c => c.level !== currentLevel),
        newChunks: result.filter(c => c.level === currentLevel),
      };
    }),

  // Obter sugestões personalizadas baseadas no nível
  getPersonalizedSuggestions: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Obter perfil do aluno
      const profile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id))
        .limit(1);

      const student = profile[0];
      if (!student) {
        return {
          suggestions: [],
          message: "Complete seu perfil primeiro",
        };
      }

      const level = student.currentLevel || "beginner";
      const book = LEVEL_TO_BOOK[level as keyof typeof LEVEL_TO_BOOK];

      // Sugestões baseadas no nível
      const suggestions = {
        beginner: [
          "Pratique vocabulário básico com flashcards",
          "Ouça podcasts de inglês para iniciantes",
          "Assista a vídeos curtos com legendas em inglês",
          "Pratique pronúncia com o tutor de voz",
        ],
        elementary: [
          "Leia histórias simples em inglês",
          "Pratique conversação com o tutor de IA",
          "Faça exercícios de gramática básica",
          "Aprenda expressões comuns do dia a dia",
        ],
        intermediate: [
          "Leia artigos de notícias em inglês",
          "Pratique conversação sobre tópicos variados",
          "Assista a filmes com legendas em inglês",
          "Aprenda phrasal verbs e expressões idiomáticas",