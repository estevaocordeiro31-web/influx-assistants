import { getDb } from "./db";
import { blogTipsBadges, blogTipsFavorites, blogTipsFeedback, type BlogTipsBadge } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Badge definitions for blog engagement
 */
export const BADGE_DEFINITIONS = {
  "first-tip": {
    name: "Primeiro Passo",
    description: "Leu a primeira dica do blog",
    icon: "🌱",
    requiredTips: 1,
  },
  "tip-collector": {
    name: "Colecionador de Dicas",
    description: "Salvou 5 dicas nos favoritos",
    icon: "⭐",
    requiredTips: 5,
  },
  "engaged-learner": {
    name: "Aprendiz Engajado",
    description: "Marcou 10 dicas como úteis",
    icon: "🎯",
    requiredTips: 10,
  },
  "blog-master": {
    name: "Mestre do Blog",
    description: "Completou 20 dicas",
    icon: "👑",
    requiredTips: 20,
  },
};

/**
 * Check and unlock badges for a student
 */
export async function checkAndUnlockBadges(studentId: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  // Get student's favorite tips count
  const favoritesCount = await database
    .select()
    .from(blogTipsFavorites)
    .where(eq(blogTipsFavorites.studentId, studentId));

  // Get student's useful feedback count
  const usefulFeedbackCount = await database
    .select()
    .from(blogTipsFeedback)
    .where(
      and(
        eq(blogTipsFeedback.studentId, studentId),
        eq(blogTipsFeedback.feedback, "useful")
      )
    );

  // Get already unlocked badges
  const unlockedBadges = await database
    .select()
    .from(blogTipsBadges)
    .where(eq(blogTipsBadges.studentId, studentId));

  const unlockedBadgeNames = unlockedBadges.map((b: BlogTipsBadge) => b.badgeName);

  // Check each badge condition
  const newBadges: Array<{
    badgeName: string;
    badgeDescription: string;
    badgeIcon: string;
    tipsCompleted: number;
  }> = [];

  // First tip badge
  if (
    favoritesCount.length > 0 &&
    !unlockedBadgeNames.includes("first-tip")
  ) {
    const badge = BADGE_DEFINITIONS["first-tip"];
    newBadges.push({
      badgeName: badge.name,
      badgeDescription: badge.description,
      badgeIcon: badge.icon,
      tipsCompleted: favoritesCount.length,
    });
  }

  // Tip collector badge
  if (
    favoritesCount.length >= 5 &&
    !unlockedBadgeNames.includes("tip-collector")
  ) {
    const badge = BADGE_DEFINITIONS["tip-collector"];
    newBadges.push({
      badgeName: badge.name,
      badgeDescription: badge.description,
      badgeIcon: badge.icon,
      tipsCompleted: favoritesCount.length,
    });
  }

  // Engaged learner badge
  if (
    usefulFeedbackCount.length >= 10 &&
    !unlockedBadgeNames.includes("engaged-learner")
  ) {
    const badge = BADGE_DEFINITIONS["engaged-learner"];
    newBadges.push({
      badgeName: badge.name,
      badgeDescription: badge.description,
      badgeIcon: badge.icon,
      tipsCompleted: usefulFeedbackCount.length,
    });
  }

  // Blog master badge
  if (
    favoritesCount.length >= 20 &&
    !unlockedBadgeNames.includes("blog-master")
  ) {
    const badge = BADGE_DEFINITIONS["blog-master"];
    newBadges.push({
      badgeName: badge.name,
      badgeDescription: badge.description,
      badgeIcon: badge.icon,
      tipsCompleted: favoritesCount.length,
    });
  }

  // Insert new badges
  if (newBadges.length > 0) {
    await database.insert(blogTipsBadges).values(
      newBadges.map((badge) => ({
        studentId,
        ...badge,
      }))
    );
  }

  return newBadges;
}

/**
 * Add a tip to student's favorites
 */
export async function addTipToFavorites(
  studentId: number,
  tipId: string,
  tipTitle: string,
  tipCategory: string
) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  // Check if already favorited
  const existing = await database
    .select()
    .from(blogTipsFavorites)
    .where(
      and(
        eq(blogTipsFavorites.studentId, studentId),
        eq(blogTipsFavorites.tipId, tipId)
      )
    );

  if (existing.length > 0) {
    return { success: false, message: "Tip already in favorites" };
  }

  await database.insert(blogTipsFavorites).values({
    studentId,
    tipId,
    tipTitle,
    tipCategory,
  });

  // Check and unlock badges
  await checkAndUnlockBadges(studentId);

  return { success: true, message: "Tip added to favorites" };
}

/**
 * Remove a tip from student's favorites
 */
export async function removeTipFromFavorites(
  studentId: number,
  tipId: string
) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  await database
    .delete(blogTipsFavorites)
    .where(
      and(
        eq(blogTipsFavorites.studentId, studentId),
        eq(blogTipsFavorites.tipId, tipId)
      )
    );

  return { success: true, message: "Tip removed from favorites" };
}

/**
 * Get student's favorite tips
 */
export async function getStudentFavoriteTips(studentId: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const favorites = await database
    .select()
    .from(blogTipsFavorites)
    .where(eq(blogTipsFavorites.studentId, studentId));

  return favorites;
}

/**
 * Save feedback for a tip
 */
export async function saveTipFeedback(
  studentId: number,
  tipId: string,
  tipTitle: string,
  feedback: "useful" | "not_useful",
  notes?: string
) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  // Check if feedback already exists
  const existing = await database
    .select()
    .from(blogTipsFeedback)
    .where(
      and(
        eq(blogTipsFeedback.studentId, studentId),
        eq(blogTipsFeedback.tipId, tipId)
      )
    );

  if (existing.length > 0) {
    // Update existing feedback
    await database
      .update(blogTipsFeedback)
      .set({ feedback, notes })
      .where(
        and(
          eq(blogTipsFeedback.studentId, studentId),
          eq(blogTipsFeedback.tipId, tipId)
        )
      );
  } else {
    // Insert new feedback
    await database.insert(blogTipsFeedback).values({
      studentId,
      tipId,
      tipTitle,
      feedback,
      notes,
    });
  }

  // Check and unlock badges
  await checkAndUnlockBadges(studentId);

  return { success: true, message: "Feedback saved" };
}

/**
 * Get student's badges
 */
export async function getStudentBadges(studentId: number) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const badges = await database
    .select()
    .from(blogTipsBadges)
    .where(eq(blogTipsBadges.studentId, studentId));

  return badges;
}

/**
 * Get feedback statistics for a tip
 */
export async function getTipFeedbackStats(tipId: string) {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const feedback = await database
    .select()
    .from(blogTipsFeedback)
    .where(eq(blogTipsFeedback.tipId, tipId));

  const usefulCount = feedback.filter((f: any) => f.feedback === "useful").length;
  const notUsefulCount = feedback.filter(
    (f: any) => f.feedback === "not_useful"
  ).length;

  return {
    tipId,
    totalFeedback: feedback.length,
    useful: usefulCount,
    notUseful: notUsefulCount,
    usefulPercentage:
      feedback.length > 0 ? (usefulCount / feedback.length) * 100 : 0,
  };
}
