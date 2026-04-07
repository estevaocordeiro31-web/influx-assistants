import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllBooks,
  getBookById,
  getUnitsByBook,
  getStudentBookProgress,
  upsertStudentBookProgress,
  getChunksByUnit,
} from "./db-books";

vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "./db";

describe("Books Database Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBooks", () => {
    it("deve retornar todos os livros", async () => {
      const mockBooks = [
        {
          id: 1,
          bookId: "junior_starter_a",
          name: "Junior Starter A",
          level: "starter",
          category: "junior",
          stages: 2,
          totalUnits: 24,
          description: "Introdução ao inglês para crianças",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          bookId: "book_1",
          name: "Book 1",
          level: "beginner",
          category: "regular",
          stages: 2,
          totalUnits: 14,
          description: "Primeiro livro da série Regular",
          order: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockBooks),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await getAllBooks();

      expect(result).toEqual(mockBooks);
      expect(result.length).toBe(2);
    });

    it("deve filtrar livros por categoria", async () => {
      const mockBooks = [
        {
          id: 1,
          bookId: "junior_starter_a",
          name: "Junior Starter A",
          level: "starter",
          category: "junior",
          stages: 2,
          totalUnits: 24,
          description: "Introdução ao inglês para crianças",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockBooks),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await getAllBooks("junior");

      expect(result).toEqual(mockBooks);
      expect(result[0]?.category).toBe("junior");
    });
  });

  describe("getStudentBookProgress", () => {
    it("deve retornar o progresso do aluno em um livro", async () => {
      const mockProgress = {
        id: 1,
        studentId: 1,
        bookId: 1,
        currentUnit: 5,
        completedUnits: 4,
        progressPercentage: "35.71",
        startedAt: new Date(),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockProgress]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await getStudentBookProgress(1, 1);

      expect(result).toEqual(mockProgress);
      expect(result?.currentUnit).toBe(5);
    });

    it("deve retornar null quando não há progresso", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await getStudentBookProgress(999, 999);

      expect(result).toBeNull();
    });
  });

  describe("upsertStudentBookProgress", () => {
    it("deve criar novo progresso quando não existe", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue(undefined),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await upsertStudentBookProgress(1, 1, {
        currentUnit: 1,
        completedUnits: 0,
        progressPercentage: 0,
      });

      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("deve atualizar progresso existente", async () => {
      const existingProgress = {
        id: 1,
        studentId: 1,
        bookId: 1,
        currentUnit: 5,
        completedUnits: 4,
        progressPercentage: "35.71",
        startedAt: new Date(),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn()
          .mockResolvedValueOnce([existingProgress])
          .mockResolvedValueOnce([{ ...existingProgress, currentUnit: 6 }]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await upsertStudentBookProgress(1, 1, {
        currentUnit: 6,
        completedUnits: 5,
        progressPercentage: "42.86",
      });

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("getChunksByUnit", () => {
    it("deve retornar chunks de uma unit", async () => {
      const mockChunks = [
        {
          id: 1,
          unitId: 1,
          chunkId: 10,
          chunkType: "collocation",
          order: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          unitId: 1,
          chunkId: 11,
          chunkType: "phrasal_verb",
          order: 2,
          createdAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockChunks),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const result = await getChunksByUnit(1);

      expect(result).toEqual(mockChunks);
      expect(result.length).toBe(2);
    });
  });
});
