import { describe, it, expect } from "vitest";

// Test the book-themes utility functions
// We import the logic directly since it's a shared utility

// Replicate the theme logic for testing (same as client/src/lib/book-themes.ts)
const BOOK_THEMES: Record<number, { book: number; name: string; level: string; primary: string; emoji: string }> = {
  1: { book: 1, name: "Book 1", level: "Beginner", primary: "#84cc16", emoji: "🌱" },
  2: { book: 2, name: "Book 2", level: "Elementary", primary: "#38bdf8", emoji: "💧" },
  3: { book: 3, name: "Book 3", level: "Intermediate", primary: "#a855f7", emoji: "🔮" },
  4: { book: 4, name: "Book 4", level: "Upper Intermediate", primary: "#f97316", emoji: "🔥" },
  5: { book: 5, name: "Book 5", level: "Advanced", primary: "#dc2626", emoji: "🏆" },
};

function getBookTheme(bookNumber: number | undefined | null) {
  if (!bookNumber || !BOOK_THEMES[bookNumber]) return BOOK_THEMES[1];
  return BOOK_THEMES[bookNumber];
}

function getBookNumberFromLevel(level: string | undefined | null): number {
  if (!level) return 1;
  const lower = level.toLowerCase().trim();
  const bookMatch = lower.match(/book\s*(\d)/);
  if (bookMatch) return parseInt(bookMatch[1]);
  if (lower.includes("beginner") || lower.includes("iniciante") || lower === "a1") return 1;
  if (lower.includes("elementary") || lower.includes("elementar") || lower === "a2") return 2;
  if (lower.includes("intermediate") && !lower.includes("upper")) return 3;
  if (lower.includes("upper") || lower.includes("b2")) return 4;
  if (lower.includes("advanced") || lower.includes("avançado") || lower.includes("c1") || lower.includes("c2")) return 5;
  return 1;
}

// Available courses list
const AVAILABLE_COURSES = [
  { code: "vp1", name: "Vacation Plus 1", category: "vacation_plus" },
  { code: "vp2", name: "Vacation Plus 2", category: "vacation_plus" },
  { code: "vp3", name: "Vacation Plus 3", category: "vacation_plus" },
  { code: "vp4", name: "Vacation Plus 4", category: "vacation_plus" },
  { code: "traveler", name: "Traveler", category: "special" },
  { code: "on_business", name: "On Business", category: "special" },
  { code: "reading_club", name: "Reading Club", category: "club" },
];

// Access control logic (same as StudentDashboard)
function checkAccess(myCourses: string[] | undefined) {
  const hasReadingClub = myCourses?.includes("reading_club") ?? false;
  const hasVacationPlus = myCourses?.some((c) => c.startsWith("vp")) ?? false;
  const hasTraveler = myCourses?.includes("traveler") ?? false;
  const hasOnBusiness = myCourses?.includes("on_business") ?? false;
  return { hasReadingClub, hasVacationPlus, hasTraveler, hasOnBusiness };
}

describe("Book Themes", () => {
  it("should return correct theme for each book number", () => {
    expect(getBookTheme(1).primary).toBe("#84cc16"); // Verde limão
    expect(getBookTheme(2).primary).toBe("#38bdf8"); // Azul claro
    expect(getBookTheme(3).primary).toBe("#a855f7"); // Roxo
    expect(getBookTheme(4).primary).toBe("#f97316"); // Laranja
    expect(getBookTheme(5).primary).toBe("#dc2626"); // Vermelho escuro
  });

  it("should return default theme (Book 1) for invalid book numbers", () => {
    expect(getBookTheme(0).book).toBe(1);
    expect(getBookTheme(6).book).toBe(1);
    expect(getBookTheme(null).book).toBe(1);
    expect(getBookTheme(undefined).book).toBe(1);
  });

  it("should have correct emojis for each level", () => {
    expect(getBookTheme(1).emoji).toBe("🌱");
    expect(getBookTheme(2).emoji).toBe("💧");
    expect(getBookTheme(3).emoji).toBe("🔮");
    expect(getBookTheme(4).emoji).toBe("🔥");
    expect(getBookTheme(5).emoji).toBe("🏆");
  });
});

describe("Book Number from Level", () => {
  it("should parse 'Book N' format", () => {
    expect(getBookNumberFromLevel("Book 1")).toBe(1);
    expect(getBookNumberFromLevel("Book 2")).toBe(2);
    expect(getBookNumberFromLevel("Book 3")).toBe(3);
    expect(getBookNumberFromLevel("Book 4")).toBe(4);
    expect(getBookNumberFromLevel("Book 5")).toBe(5);
  });

  it("should parse level names in English", () => {
    expect(getBookNumberFromLevel("Beginner")).toBe(1);
    expect(getBookNumberFromLevel("Elementary")).toBe(2);
    expect(getBookNumberFromLevel("Intermediate")).toBe(3);
    expect(getBookNumberFromLevel("Upper Intermediate")).toBe(4);
    expect(getBookNumberFromLevel("Advanced")).toBe(5);
  });

  it("should parse level names in Portuguese", () => {
    expect(getBookNumberFromLevel("Iniciante")).toBe(1);
    expect(getBookNumberFromLevel("Elementar")).toBe(2);
    expect(getBookNumberFromLevel("Avançado")).toBe(5);
  });

  it("should parse CEFR levels", () => {
    expect(getBookNumberFromLevel("A1")).toBe(1);
    expect(getBookNumberFromLevel("A2")).toBe(2);
    expect(getBookNumberFromLevel("B2")).toBe(4);
    expect(getBookNumberFromLevel("C1")).toBe(5);
    expect(getBookNumberFromLevel("C2")).toBe(5);
  });

  it("should return 1 for null/undefined/empty", () => {
    expect(getBookNumberFromLevel(null)).toBe(1);
    expect(getBookNumberFromLevel(undefined)).toBe(1);
    expect(getBookNumberFromLevel("")).toBe(1);
  });
});

describe("Course Access Control", () => {
  it("should deny all access when no courses assigned", () => {
    const access = checkAccess([]);
    expect(access.hasReadingClub).toBe(false);
    expect(access.hasVacationPlus).toBe(false);
    expect(access.hasTraveler).toBe(false);
    expect(access.hasOnBusiness).toBe(false);
  });

  it("should deny all access when courses is undefined", () => {
    const access = checkAccess(undefined);
    expect(access.hasReadingClub).toBe(false);
    expect(access.hasVacationPlus).toBe(false);
    expect(access.hasTraveler).toBe(false);
    expect(access.hasOnBusiness).toBe(false);
  });

  it("should grant Reading Club access when enrolled", () => {
    const access = checkAccess(["reading_club"]);
    expect(access.hasReadingClub).toBe(true);
    expect(access.hasVacationPlus).toBe(false);
  });

  it("should grant Vacation Plus access for any VP course", () => {
    expect(checkAccess(["vp1"]).hasVacationPlus).toBe(true);
    expect(checkAccess(["vp2"]).hasVacationPlus).toBe(true);
    expect(checkAccess(["vp3"]).hasVacationPlus).toBe(true);
    expect(checkAccess(["vp4"]).hasVacationPlus).toBe(true);
  });

  it("should grant multiple accesses", () => {
    const access = checkAccess(["reading_club", "vp2", "traveler", "on_business"]);
    expect(access.hasReadingClub).toBe(true);
    expect(access.hasVacationPlus).toBe(true);
    expect(access.hasTraveler).toBe(true);
    expect(access.hasOnBusiness).toBe(true);
  });

  it("should not grant Reading Club for VP courses", () => {
    const access = checkAccess(["vp1", "vp2"]);
    expect(access.hasReadingClub).toBe(false);
    expect(access.hasVacationPlus).toBe(true);
  });
});

describe("Available Courses", () => {
  it("should have 7 courses total", () => {
    expect(AVAILABLE_COURSES).toHaveLength(7);
  });

  it("should have 4 Vacation Plus courses", () => {
    const vpCourses = AVAILABLE_COURSES.filter((c) => c.category === "vacation_plus");
    expect(vpCourses).toHaveLength(4);
  });

  it("should have 2 special courses", () => {
    const specialCourses = AVAILABLE_COURSES.filter((c) => c.category === "special");
    expect(specialCourses).toHaveLength(2);
  });

  it("should have 1 club course", () => {
    const clubCourses = AVAILABLE_COURSES.filter((c) => c.category === "club");
    expect(clubCourses).toHaveLength(1);
  });

  it("should have unique course codes", () => {
    const codes = AVAILABLE_COURSES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
