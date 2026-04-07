import { describe, it, expect } from "vitest";
import {
  mapSponteTurmaToBook,
  getBookById,
  getBookByCefrLevel,
  getNextBook,
  getPreviousBooks,
  calculateOverallProgress,
  INFLUX_BOOKS,
} from "./sponte-book-mapping";

describe("sponte-book-mapping", () => {
  describe("INFLUX_BOOKS", () => {
    it("deve ter 12 livros no total", () => {
      expect(INFLUX_BOOKS).toHaveLength(12);
    });

    it("deve ter 5 livros da série Junior", () => {
      const juniorBooks = INFLUX_BOOKS.filter((b) => b.series === "junior");
      expect(juniorBooks).toHaveLength(5);
    });

    it("deve ter 5 livros da série Regular", () => {
      const regularBooks = INFLUX_BOOKS.filter((b) => b.series === "regular");
      expect(regularBooks).toHaveLength(5);
    });

    it("deve ter 2 cursos avançados", () => {
      const advancedBooks = INFLUX_BOOKS.filter((b) => b.series === "advanced");
      expect(advancedBooks).toHaveLength(2);
    });
  });

  describe("mapSponteTurmaToBook", () => {
    it("deve mapear 'Book 1' para o livro correto", () => {
      const book = mapSponteTurmaToBook("Turma Book 1 - Manhã");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Book 1");
      expect(book?.cefrLevel).toBe("A1");
    });

    it("deve mapear 'Book 5' para o livro correto", () => {
      const book = mapSponteTurmaToBook("Book 5 - Noite");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Book 5");
      expect(book?.cefrLevel).toBe("C1");
    });

    it("deve mapear 'Junior 2' para o livro correto", () => {
      const book = mapSponteTurmaToBook("Junior 2 - Tarde");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Junior 2");
      expect(book?.series).toBe("junior");
    });

    it("deve mapear 'Junior Starter A' para o livro correto", () => {
      const book = mapSponteTurmaToBook("Junior Starter A");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Junior Starter A");
    });

    it("deve mapear 'Business English' para o livro correto", () => {
      const book = mapSponteTurmaToBook("Business English - Executivo");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Business English");
      expect(book?.series).toBe("advanced");
    });

    it("deve retornar null para turma desconhecida", () => {
      const book = mapSponteTurmaToBook("Turma Especial XYZ");
      expect(book).toBeNull();
    });

    it("deve ser case-insensitive", () => {
      const book = mapSponteTurmaToBook("BOOK 3 - MANHÃ");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Book 3");
    });
  });

  describe("getBookById", () => {
    it("deve retornar o livro correto pelo ID", () => {
      const book = getBookById(6);
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Book 1");
    });

    it("deve retornar null para ID inválido", () => {
      const book = getBookById(999);
      expect(book).toBeNull();
    });
  });

  describe("getBookByCefrLevel", () => {
    it("deve retornar o livro correto pelo nível CEFR", () => {
      const book = getBookByCefrLevel("B1");
      expect(book).not.toBeNull();
      expect(book?.name).toBe("Book 3");
    });

    it("deve retornar null para nível CEFR inválido", () => {
      const book = getBookByCefrLevel("D1");
      expect(book).toBeNull();
    });
  });

  describe("getNextBook", () => {
    it("deve retornar o próximo livro na sequência", () => {
      const nextBook = getNextBook(6); // Book 1
      expect(nextBook).not.toBeNull();
      expect(nextBook?.name).toBe("Book 2");
    });

    it("deve retornar null para o último livro", () => {
      const nextBook = getNextBook(12); // Business English
      expect(nextBook).toBeNull();
    });
  });

  describe("getPreviousBooks", () => {
    it("deve retornar os livros anteriores", () => {
      const previousBooks = getPreviousBooks(8); // Book 3
      expect(previousBooks).toHaveLength(7);
    });

    it("deve retornar array vazio para o primeiro livro", () => {
      const previousBooks = getPreviousBooks(1);
      expect(previousBooks).toHaveLength(0);
    });
  });

  describe("calculateOverallProgress", () => {
    it("deve calcular progresso geral corretamente", () => {
      const progress = calculateOverallProgress(10, 6); // Book 5, Unit 6
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it("deve retornar 0 para livro inválido", () => {
      const progress = calculateOverallProgress(999, 1);
      expect(progress).toBe(0);
    });
  });
});
