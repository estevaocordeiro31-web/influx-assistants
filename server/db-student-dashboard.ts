import { getDb } from "./db";
import { users, studentProfiles } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Busca dados completos do dashboard do aluno
 */
export async function getStudentDashboardData(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Buscar usuário e perfil
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const [profile] = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId))
    .limit(1);

  // Badges baseados nas conquistas
  const badges = [];
  
  if ((profile?.streakDays || 0) >= 30) {
    badges.push({
      name: "Maratonista",
      icon: "🏃",
      description: `${profile?.streakDays} dias seguidos`,
    });
  }
  
  if ((profile?.totalHoursLearned || 0) >= 100) {
    badges.push({
      name: "Dedicado",
      icon: "⭐",
      description: `${profile?.totalHoursLearned}+ horas`,
    });
  }

  // Mapear nível do banco para nome amigável
  const levelMap: Record<string, string> = {
    beginner: "Iniciante",
    elementary: "Elementar",
    intermediate: "Intermediário",
    upper_intermediate: "Intermediário+",
    advanced: "Avançado",
    proficient: "Proficiente",
  };

  // Retornar dados estruturados
  return {
    name: user.name || "Aluno",
    email: user.email || "",
    level: levelMap[profile?.currentLevel || "beginner"] || "Iniciante",
    currentBook: "Book 1", // TODO: Adicionar campo no schema
    currentBookId: 1,
    currentUnit: 1,
    totalUnits: 12,
    progressPercentage: 0,
    totalHoursLearned: profile?.totalHoursLearned || 0,
    totalChunksLearned: 0, // TODO: Calcular do studentChunkProgress
    streakDays: profile?.streakDays || 0,
    nextReview: 0, // TODO: Calcular chunks para revisar
    badges,
    completedBooks: [],
    recentChunks: [],
    weeklyProgress: generateDefaultWeeklyProgress(),
  };
}

/**
 * Gera progresso semanal padrão para novos alunos
 */
function generateDefaultWeeklyProgress() {
  return [
    { day: "Seg", hours: 0, chunks: 0 },
    { day: "Ter", hours: 0, chunks: 0 },
    { day: "Qua", hours: 0, chunks: 0 },
    { day: "Qui", hours: 0, chunks: 0 },
    { day: "Sex", hours: 0, chunks: 0 },
    { day: "Sáb", hours: 0, chunks: 0 },
    { day: "Dom", hours: 0, chunks: 0 },
  ];
}
