import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  studentProfiles,
  studentBookProgress,
  studentCourses,
  chunks,
  books,
  studentImportedData,
  studentTopicProgress,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Router de Personalização Centralizado
 * 
 * Fornece dados personalizados para cada aluno baseado em:
 * - Nível atual (Book)
 * - Livros já cursados
 * - Cursos extras inscritos
 * - Objetivo de aprendizado
 * - Progresso no banco de dados
 */

export const studentPersonalizationRouter = router({
  /**
   * Obter perfil completo do aluno autenticado
   * Retorna: nível, livros cursados, cursos extras, objetivo, progresso
   */
  getStudentProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // 1. Obter perfil do aluno
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile.length) {
      return {
        error: "Perfil não encontrado",
        studentId: ctx.user.id,
      };
    }

    const studentProfile = profile[0];

    // 2. Obter livros cursados
    const bookProgress = await db
      .select({
        bookId: studentBookProgress.bookId,
        bookName: books.name,
        level: books.level,
        currentUnit: studentBookProgress.currentUnit,
        completedUnits: studentBookProgress.completedUnits,
        progressPercentage: studentBookProgress.progressPercentage,
        completedAt: studentBookProgress.completedAt,
      })
      .from(studentBookProgress)
      .innerJoin(books, eq(studentBookProgress.bookId, books.id))
      .where(eq(studentBookProgress.studentId, ctx.user.id));

    // 3. Obter cursos extras inscritos
    const enrolledCourses = await db
      .select({
        courseCode: studentCourses.courseCode,
        courseName: studentCourses.courseName,
        isActive: studentCourses.isActive,
        enrolledAt: studentCourses.enrolledAt,
      })
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.studentId, ctx.user.id),
          eq(studentCourses.isActive, true)
        )
      );

    // 4. Obter dados importados (notas, presença, etc)
    const importedData = await db
      .select()
      .from(studentImportedData)
      .where(eq(studentImportedData.studentId, ctx.user.id))
      .limit(1);

    return {
      success: true,
      student: {
        id: ctx.user.id,
        name: ctx.user.name,
        email: ctx.user.email,
        currentLevel: studentProfile.currentLevel,
        objective: studentProfile.objective,
        totalHoursLearned: studentProfile.totalHoursLearned,
        streakDays: studentProfile.streakDays,
      },
      bookProgress,
      enrolledCourses,
      importedData: importedData[0] || null,
      createdAt: studentProfile.createdAt,
    };
  }),

  /**
   * Obter chunks personalizados para o aluno
   * Filtra por: nível atual + contexto (objetivo)
   */
  getPersonalizedChunks: protectedProcedure
    .input(
      z.object({
        context: z
          .enum(["career", "travel", "studies", "daily_life", "general"])
          .optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Obter nível do aluno
      const profile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id))
        .limit(1);

      if (!profile.length) {
        return { error: "Perfil não encontrado", chunks: [] };
      }

      const level = profile[0].currentLevel;
      const objective = profile[0].objective;

      // Buscar chunks do nível do aluno
      const studentChunks = await db
        .select()
        .from(chunks)
        .where(
          and(
            eq(chunks.level, level as any),
            input.context ? eq(chunks.context, input.context as any) : undefined
          )
        )
        .limit(input.limit);

      return {
        success: true,
        level,
        objective,
        chunks: studentChunks,
        total: studentChunks.length,
      };
    }),

  /**
   * Obter materiais exclusivos do aluno
   * Baseado em: cursos inscritos, nível, livros cursados
   */
  getExclusiveMaterials: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // 1. Obter cursos inscritos
    const courses = await db
      .select({ courseCode: studentCourses.courseCode })
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.studentId, ctx.user.id),
          eq(studentCourses.isActive, true)
        )
      );

    const courseCodes = courses.map((c) => c.courseCode);

    // 2. Obter nível do aluno
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, ctx.user.id))
      .limit(1);

    const level = profile[0]?.currentLevel || "beginner";

    return {
      success: true,
      studentId: ctx.user.id,
      enrolledCourses: courseCodes,
      level,
      message: `Aluno tem acesso a ${courseCodes.length} cursos extras`,
    };
  }),

  /**
   * Obter sugestões personalizadas baseadas no perfil
   */
  getPersonalizedSuggestions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Obter perfil
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile.length) {
      return {
        error: "Perfil não encontrado",
        suggestions: [],
      };
    }

    const student = profile[0];
    const level = student.currentLevel;
    const objective = student.objective;

    // Sugestões baseadas no nível e objetivo
    const suggestionsByLevel: Record<string, string[]> = {
      beginner: [
        "Pratique vocabulário básico com flashcards",
        "Ouça podcasts de inglês para iniciantes",
        "Assista vídeos curtos com legendas",
      ],
      elementary: [
        "Leia histórias simples em inglês",
        "Pratique conversação com o tutor de IA",
        "Faça exercícios de gramática básica",
      ],
      intermediate: [
        "Leia artigos de notícias em inglês",
        "Pratique conversação sobre tópicos variados",
        "Assista filmes com legendas em inglês",
      ],
      upper_intermediate: [
        "Leia livros em inglês",
        "Pratique discussões aprofundadas",
        "Estude expressões idiomáticas avançadas",
      ],
      advanced: [
        "Leia literatura clássica em inglês",
        "Pratique debates e argumentação",
        "Estude nuances de linguagem nativa",
      ],
    };

    const baseSuggestions = suggestionsByLevel[level] || [];

    // Sugestões adicionais baseadas no objetivo
    const objectiveSuggestions: Record<string, string[]> = {
      career: [
        "Aprenda vocabulário profissional específico",
        "Pratique apresentações em inglês",
        "Estude email corporativo em inglês",
      ],
      travel: [
        "Aprenda expressões de viagem",
        "Pratique conversação em situações turísticas",
        "Estude gírias locais de destinos populares",
      ],
      studies: [
        "Aprenda vocabulário acadêmico",
        "Pratique escrita de ensaios em inglês",
        "Estude apresentações acadêmicas",
      ],
      other: [
        "Explore seus interesses pessoais em inglês",
        "Pratique conversação casual",
        "Assista conteúdo que você gosta em inglês",
      ],
    };

    const additionalSuggestions = objectiveSuggestions[objective] || [];

    return {
      success: true,
      level,
      objective,
      suggestions: [...baseSuggestions, ...additionalSuggestions],
    };
  }),

  /**
   * Obter progresso do aluno em tópicos específicos
   */
  getTopicProgress: protectedProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const query = db
        .select()
        .from(studentTopicProgress)
        .where(eq(studentTopicProgress.studentId, ctx.user.id));

      const progress = await query;

      // Filtrar por categoria se fornecida
      const filtered = input.category
        ? progress.filter((p) => p.category === input.category)
        : progress;

      return {
        success: true,
        studentId: ctx.user.id,
        totalTopics: filtered.length,
        completedTopics: filtered.filter((p) => p.completed).length,
        completionPercentage:
          filtered.length > 0
            ? Math.round(
                (filtered.filter((p) => p.completed).length / filtered.length) *
                  100
              )
            : 0,
        topics: filtered,
      };
    }),

  /**
   * Verificar se aluno tem acesso a um curso específico
   */
  hasAccessToCourse: protectedProcedure
    .input(z.object({ courseCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const course = await db
        .select()
        .from(studentCourses)
        .where(
          and(
            eq(studentCourses.studentId, ctx.user.id),
            eq(studentCourses.courseCode, input.courseCode),
            eq(studentCourses.isActive, true)
          )
        )
        .limit(1);

      return {
        success: true,
        hasAccess: course.length > 0,
        courseCode: input.courseCode,
        course: course[0] || null,
      };
    }),

  /**
   * Obter dashboard personalizado completo
   */
  getPersonalizedDashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Obter todos os dados personalizados
    const profile = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile.length) {
      return { error: "Perfil não encontrado" };
    }

    const student = profile[0];

    // Obter progresso em livros
    const bookProgress = await db
      .select()
      .from(studentBookProgress)
      .where(eq(studentBookProgress.studentId, ctx.user.id));

    // Obter cursos inscritos
    const courses = await db
      .select()
      .from(studentCourses)
      .where(
        and(
          eq(studentCourses.studentId, ctx.user.id),
          eq(studentCourses.isActive, true)
        )
      );

    // Obter progresso em tópicos
    const topicProgress = await db
      .select()
      .from(studentTopicProgress)
      .where(eq(studentTopicProgress.studentId, ctx.user.id));

    return {
      success: true,
      student: {
        id: ctx.user.id,
        name: ctx.user.name,
        email: ctx.user.email,
        level: student.currentLevel,
        objective: student.objective,
        hoursLearned: student.totalHoursLearned,
        streak: student.streakDays,
      },
      books: {
        inProgress: bookProgress.filter((b) => !b.completedAt),
        completed: bookProgress.filter((b) => b.completedAt),
      },
      courses: {
        active: courses,
        count: courses.length,
      },
      progress: {
        totalTopics: topicProgress.length,
        completedTopics: topicProgress.filter((p) => p.completed).length,
        completionPercentage:
          topicProgress.length > 0
            ? Math.round(
                (topicProgress.filter((p) => p.completed).length /
                  topicProgress.length) *
                  100
              )
            : 0,
      },
    };
  }),
});
