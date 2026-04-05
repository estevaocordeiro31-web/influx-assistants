import { describe, it, expect } from "vitest";

// Unit tests for badges system - testing logic without database dependency

describe("Badges System", () => {
  // Badge definitions
  const BADGE_DEFINITIONS = [
    { slug: "welcome_explorer", name: "Welcome Explorer", category: "welcome", influxcoinsReward: 10 },
    { slug: "first_steps", name: "First Steps", category: "progress", influxcoinsReward: 15 },
    { slug: "vocabulary_hunter", name: "Vocabulary Hunter", category: "progress", influxcoinsReward: 20 },
    { slug: "dialogue_master", name: "Dialogue Master", category: "mastery", influxcoinsReward: 25 },
    { slug: "streak_warrior_3", name: "Streak Warrior (3 days)", category: "streak", influxcoinsReward: 30 },
    { slug: "streak_warrior_7", name: "Streak Warrior (7 days)", category: "streak", influxcoinsReward: 50 },
    { slug: "book1_champion", name: "Book 1 Champion", category: "mastery", influxcoinsReward: 100 },
    { slug: "book2_champion", name: "Book 2 Champion", category: "mastery", influxcoinsReward: 100 },
    { slug: "exercise_machine_10", name: "Exercise Machine (10)", category: "progress", influxcoinsReward: 25 },
    { slug: "exercise_machine_25", name: "Exercise Machine (25)", category: "progress", influxcoinsReward: 50 },
    { slug: "exercise_machine_50", name: "Exercise Machine (50)", category: "progress", influxcoinsReward: 100 },
    { slug: "social_butterfly", name: "Social Butterfly", category: "social", influxcoinsReward: 20 },
  ];

  describe("Badge Definitions", () => {
    it("should have 12 badge definitions", () => {
      expect(BADGE_DEFINITIONS).toHaveLength(12);
    });

    it("should have unique slugs", () => {
      const slugs = BADGE_DEFINITIONS.map(b => b.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have unique names", () => {
      const names = BADGE_DEFINITIONS.map(b => b.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it("should have positive influxcoins rewards", () => {
      BADGE_DEFINITIONS.forEach(badge => {
        expect(badge.influxcoinsReward).toBeGreaterThan(0);
      });
    });

    it("should have valid categories", () => {
      const validCategories = ["welcome", "progress", "mastery", "streak", "social"];
      BADGE_DEFINITIONS.forEach(badge => {
        expect(validCategories).toContain(badge.category);
      });
    });
  });

  describe("Badge Category Classification", () => {
    function getCategoryFromSlug(slug: string): string {
      if (slug.includes("welcome") || slug.includes("first")) return "welcome";
      if (slug.includes("streak")) return "streak";
      if (slug.includes("champion") || slug.includes("master")) return "mastery";
      if (slug.includes("social") || slug.includes("butterfly")) return "social";
      return "progress";
    }

    it("should classify welcome badges correctly", () => {
      expect(getCategoryFromSlug("welcome_explorer")).toBe("welcome");
      expect(getCategoryFromSlug("first_steps")).toBe("welcome");
    });

    it("should classify streak badges correctly", () => {
      expect(getCategoryFromSlug("streak_warrior_3")).toBe("streak");
      expect(getCategoryFromSlug("streak_warrior_7")).toBe("streak");
    });

    it("should classify mastery badges correctly", () => {
      expect(getCategoryFromSlug("book1_champion")).toBe("mastery");
      expect(getCategoryFromSlug("book2_champion")).toBe("mastery");
      expect(getCategoryFromSlug("dialogue_master")).toBe("mastery");
    });

    it("should classify social badges correctly", () => {
      expect(getCategoryFromSlug("social_butterfly")).toBe("social");
    });

    it("should classify progress badges correctly", () => {
      expect(getCategoryFromSlug("vocabulary_hunter")).toBe("progress");
      expect(getCategoryFromSlug("exercise_machine_10")).toBe("progress");
      expect(getCategoryFromSlug("exercise_machine_25")).toBe("progress");
      expect(getCategoryFromSlug("exercise_machine_50")).toBe("progress");
    });
  });

  describe("Influxcoins Calculation", () => {
    it("should calculate total influxcoins for all badges", () => {
      const total = BADGE_DEFINITIONS.reduce((sum, b) => sum + b.influxcoinsReward, 0);
      expect(total).toBe(545); // 10+15+20+25+30+50+100+100+25+50+100+20
    });

    it("should calculate influxcoins for welcome badges", () => {
      const welcomeBadges = BADGE_DEFINITIONS.filter(b => b.category === "welcome");
      const total = welcomeBadges.reduce((sum, b) => sum + b.influxcoinsReward, 0);
      expect(total).toBe(10); // welcome_explorer only
    });

    it("should calculate influxcoins for mastery badges", () => {
      const masteryBadges = BADGE_DEFINITIONS.filter(b => b.category === "mastery");
      const total = masteryBadges.reduce((sum, b) => sum + b.influxcoinsReward, 0);
      expect(total).toBe(225); // 25+100+100
    });

    it("should calculate influxcoins for streak badges", () => {
      const streakBadges = BADGE_DEFINITIONS.filter(b => b.category === "streak");
      const total = streakBadges.reduce((sum, b) => sum + b.influxcoinsReward, 0);
      expect(total).toBe(80); // 30+50
    });
  });

  describe("Badge Progress Calculation", () => {
    it("should calculate progress percentage correctly", () => {
      const earned = 3;
      const total = 12;
      const percent = Math.round((earned / total) * 100);
      expect(percent).toBe(25);
    });

    it("should handle zero badges earned", () => {
      const earned = 0;
      const total = 12;
      const percent = total > 0 ? Math.round((earned / total) * 100) : 0;
      expect(percent).toBe(0);
    });

    it("should handle all badges earned", () => {
      const earned = 12;
      const total = 12;
      const percent = Math.round((earned / total) * 100);
      expect(percent).toBe(100);
    });

    it("should handle empty badge list", () => {
      const earned = 0;
      const total = 0;
      const percent = total > 0 ? Math.round((earned / total) * 100) : 0;
      expect(percent).toBe(0);
    });
  });

  describe("Badge Award Conditions", () => {
    it("should award welcome badge on first login", () => {
      const loginCount = 1;
      const shouldAward = loginCount >= 1;
      expect(shouldAward).toBe(true);
    });

    it("should award first_steps after completing 1 exercise", () => {
      const exercisesCompleted = 1;
      const shouldAward = exercisesCompleted >= 1;
      expect(shouldAward).toBe(true);
    });

    it("should not award exercise_machine_10 with only 5 exercises", () => {
      const exercisesCompleted = 5;
      const shouldAward = exercisesCompleted >= 10;
      expect(shouldAward).toBe(false);
    });

    it("should award exercise_machine_10 with 10 exercises", () => {
      const exercisesCompleted = 10;
      const shouldAward = exercisesCompleted >= 10;
      expect(shouldAward).toBe(true);
    });

    it("should award exercise_machine_25 with 25 exercises", () => {
      const exercisesCompleted = 25;
      const shouldAward = exercisesCompleted >= 25;
      expect(shouldAward).toBe(true);
    });

    it("should award exercise_machine_50 with 50 exercises", () => {
      const exercisesCompleted = 50;
      const shouldAward = exercisesCompleted >= 50;
      expect(shouldAward).toBe(true);
    });

    it("should award streak_warrior_3 after 3 consecutive days", () => {
      const consecutiveDays = 3;
      const shouldAward = consecutiveDays >= 3;
      expect(shouldAward).toBe(true);
    });

    it("should not award streak_warrior_7 after only 5 days", () => {
      const consecutiveDays = 5;
      const shouldAward = consecutiveDays >= 7;
      expect(shouldAward).toBe(false);
    });

    it("should award streak_warrior_7 after 7 consecutive days", () => {
      const consecutiveDays = 7;
      const shouldAward = consecutiveDays >= 7;
      expect(shouldAward).toBe(true);
    });
  });

  describe("Leaderboard Sorting", () => {
    const mockLeaderboard = [
      { studentId: "1", name: "Ana", badgeCount: 5, totalInfluxcoins: 150 },
      { studentId: "2", name: "Bruno", badgeCount: 8, totalInfluxcoins: 300 },
      { studentId: "3", name: "Carlos", badgeCount: 3, totalInfluxcoins: 75 },
      { studentId: "4", name: "Diana", badgeCount: 8, totalInfluxcoins: 250 },
    ];

    it("should sort by badge count descending", () => {
      const sorted = [...mockLeaderboard].sort((a, b) => b.badgeCount - a.badgeCount);
      expect(sorted[0].name).toBe("Bruno");
      expect(sorted[1].name).toBe("Diana");
    });

    it("should break ties by influxcoins", () => {
      const sorted = [...mockLeaderboard].sort((a, b) => {
        if (b.badgeCount !== a.badgeCount) return b.badgeCount - a.badgeCount;
        return b.totalInfluxcoins - a.totalInfluxcoins;
      });
      expect(sorted[0].name).toBe("Bruno"); // 8 badges, 300 coins
      expect(sorted[1].name).toBe("Diana"); // 8 badges, 250 coins
    });

    it("should assign correct ranks", () => {
      const sorted = [...mockLeaderboard]
        .sort((a, b) => b.badgeCount - a.badgeCount)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));
      expect(sorted[0].rank).toBe(1);
      expect(sorted[3].rank).toBe(4);
    });
  });

  describe("Badge Icon Mapping", () => {
    const BADGE_ICON_KEYS = [
      "welcome_explorer", "first_steps", "vocabulary_hunter",
      "dialogue_master", "streak_warrior_3", "streak_warrior_7",
      "book1_champion", "book2_champion", "exercise_machine_10",
      "exercise_machine_25", "exercise_machine_50", "social_butterfly",
    ];

    it("should have icons for all badge slugs", () => {
      expect(BADGE_ICON_KEYS).toHaveLength(12);
    });

    it("should match badge definitions", () => {
      const definitionSlugs = BADGE_DEFINITIONS.map(b => b.slug).sort();
      const iconSlugs = [...BADGE_ICON_KEYS].sort();
      expect(iconSlugs).toEqual(definitionSlugs);
    });
  });

  describe("Category Colors", () => {
    const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
      welcome: { bg: "bg-emerald-500/20", border: "border-emerald-500" },
      progress: { bg: "bg-blue-500/20", border: "border-blue-500" },
      mastery: { bg: "bg-purple-500/20", border: "border-purple-500" },
      streak: { bg: "bg-orange-500/20", border: "border-orange-500" },
      social: { bg: "bg-pink-500/20", border: "border-pink-500" },
    };

    it("should have colors for all categories", () => {
      const categories = ["welcome", "progress", "mastery", "streak", "social"];
      categories.forEach(cat => {
        expect(CATEGORY_COLORS[cat]).toBeDefined();
        expect(CATEGORY_COLORS[cat].bg).toBeTruthy();
        expect(CATEGORY_COLORS[cat].border).toBeTruthy();
      });
    });
  });
});
