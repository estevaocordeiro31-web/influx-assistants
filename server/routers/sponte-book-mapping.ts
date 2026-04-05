/**
 * Mapeamento de Turmas/Cursos do Sponte para Livros inFlux (CEFR)
 * 
 * Estrutura dos livros inFlux:
 * - Série Junior: Junior Starter A/B, Junior 1/2/3
 * - Série Regular: Book 1 (A1), Book 2 (A2), Book 3 (B1), Book 4 (B2), Book 5 (C1)
 * - Cursos Avançados: Conversação Avançada (C1-C2), Business English (B2-C1)
 */

export interface BookInfo {
  id: number;
  name: string;
  level: string;
  cefrLevel: string;
  series: 'junior' | 'regular' | 'advanced';
  totalUnits: number;
  totalChunks: number;
}

// Mapeamento completo dos livros inFlux
export const INFLUX_BOOKS: BookInfo[] = [
  // Série Junior (Kids)
  { id: 1, name: "Junior Starter A", level: "Kids", cefrLevel: "Pre-A1", series: "junior", totalUnits: 8, totalChunks: 45 },
  { id: 2, name: "Junior Starter B", level: "Kids", cefrLevel: "Pre-A1", series: "junior", totalUnits: 8, totalChunks: 52 },
  { id: 3, name: "Junior 1", level: "Kids", cefrLevel: "A1", series: "junior", totalUnits: 10, totalChunks: 68 },
  { id: 4, name: "Junior 2", level: "Kids", cefrLevel: "A1-A2", series: "junior", totalUnits: 10, totalChunks: 75 },
  { id: 5, name: "Junior 3", level: "Kids", cefrLevel: "A2", series: "junior", totalUnits: 10, totalChunks: 82 },
  
  // Série Regular (CEFR)
  { id: 6, name: "Book 1", level: "A1", cefrLevel: "A1", series: "regular", totalUnits: 12, totalChunks: 120 },
  { id: 7, name: "Book 2", level: "A2", cefrLevel: "A2", series: "regular", totalUnits: 12, totalChunks: 135 },
  { id: 8, name: "Book 3", level: "B1", cefrLevel: "B1", series: "regular", totalUnits: 12, totalChunks: 148 },
  { id: 9, name: "Book 4", level: "B2", cefrLevel: "B2", series: "regular", totalUnits: 12, totalChunks: 156 },
  { id: 10, name: "Book 5", level: "C1", cefrLevel: "C1", series: "regular", totalUnits: 12, totalChunks: 162 },
  
  // Cursos Avançados
  { id: 11, name: "Conversação Avançada", level: "C1-C2", cefrLevel: "C1-C2", series: "advanced", totalUnits: 10, totalChunks: 100 },
  { id: 12, name: "Business English", level: "B2-C1", cefrLevel: "B2-C1", series: "advanced", totalUnits: 10, totalChunks: 120 },
];

// Palavras-chave para identificar o livro a partir do nome da turma no Sponte
const BOOK_KEYWORDS: Record<string, number> = {
  // Junior
  "junior starter a": 1,
  "junior starter b": 2,
  "junior 1": 3,
  "junior 2": 4,
  "junior 3": 5,
  "jsa": 1,
  "jsb": 2,
  "j1": 3,
  "j2": 4,
  "j3": 5,
  
  // Regular
  "book 1": 6,
  "book 2": 7,
  "book 3": 8,
  "book 4": 9,
  "book 5": 10,
  "b1": 6,
  "b2": 7,
  "b3": 8,
  "b4": 9,
  "b5": 10,
  "livro 1": 6,
  "livro 2": 7,
  "livro 3": 8,
  "livro 4": 9,
  "livro 5": 10,
  
  // CEFR levels (usando prefixo para evitar conflito)
  "nivel a1": 6,
  "nivel a2": 7,
  "nivel b1": 8,
  "nivel b2": 9,
  "nivel c1": 10,
  "level a1": 6,
  "level a2": 7,
  "level b1": 8,
  "level b2": 9,
  "level c1": 10,
  
  // Avançados
  "conversação avançada": 11,
  "conversacao avancada": 11,
  "advanced conversation": 11,
  "business": 12,
  "business english": 12,
  "inglês para negócios": 12,
  "ingles para negocios": 12,
};

/**
 * Mapeia o nome da turma do Sponte para o livro inFlux correspondente
 */
export function mapSponteTurmaToBook(turmaName: string): BookInfo | null {
  if (!turmaName) return null;
  
  const normalizedName = turmaName.toLowerCase().trim();
  
  // Primeiro, tentar match exato
  for (const [keyword, bookId] of Object.entries(BOOK_KEYWORDS)) {
    if (normalizedName.includes(keyword)) {
      return INFLUX_BOOKS.find(b => b.id === bookId) || null;
    }
  }
  
  // Tentar extrair número do livro (ex: "Turma Book 3 - Manhã")
  const bookMatch = normalizedName.match(/book\s*(\d)/i);
  if (bookMatch) {
    const bookNum = parseInt(bookMatch[1]);
    if (bookNum >= 1 && bookNum <= 5) {
      return INFLUX_BOOKS.find(b => b.id === bookNum + 5) || null;
    }
  }
  
  // Tentar extrair Junior (ex: "Junior 2 - Tarde")
  const juniorMatch = normalizedName.match(/junior\s*(\d)/i);
  if (juniorMatch) {
    const juniorNum = parseInt(juniorMatch[1]);
    if (juniorNum >= 1 && juniorNum <= 3) {
      return INFLUX_BOOKS.find(b => b.id === juniorNum + 2) || null;
    }
  }
  
  // Tentar Junior Starter
  if (normalizedName.includes("starter")) {
    if (normalizedName.includes("a") || normalizedName.includes("1")) {
      return INFLUX_BOOKS.find(b => b.id === 1) || null;
    }
    if (normalizedName.includes("b") || normalizedName.includes("2")) {
      return INFLUX_BOOKS.find(b => b.id === 2) || null;
    }
  }
  
  return null;
}

/**
 * Obter livro por ID
 */
export function getBookById(bookId: number): BookInfo | null {
  return INFLUX_BOOKS.find(b => b.id === bookId) || null;
}

/**
 * Obter livro por nível CEFR
 */
export function getBookByCefrLevel(cefrLevel: string): BookInfo | null {
  return INFLUX_BOOKS.find(b => b.cefrLevel === cefrLevel) || null;
}

/**
 * Obter próximo livro na sequência
 */
export function getNextBook(currentBookId: number): BookInfo | null {
  const currentIndex = INFLUX_BOOKS.findIndex(b => b.id === currentBookId);
  if (currentIndex === -1 || currentIndex >= INFLUX_BOOKS.length - 1) {
    return null;
  }
  return INFLUX_BOOKS[currentIndex + 1];
}

/**
 * Obter livros anteriores (já completados)
 */
export function getPreviousBooks(currentBookId: number): BookInfo[] {
  const currentIndex = INFLUX_BOOKS.findIndex(b => b.id === currentBookId);
  if (currentIndex <= 0) return [];
  return INFLUX_BOOKS.slice(0, currentIndex);
}

/**
 * Calcular progresso total baseado no livro atual e unit
 */
export function calculateOverallProgress(currentBookId: number, currentUnit: number): number {
  const previousBooks = getPreviousBooks(currentBookId);
  const currentBook = getBookById(currentBookId);
  
  if (!currentBook) return 0;
  
  // Total de chunks dos livros anteriores
  const previousChunks = previousBooks.reduce((sum, book) => sum + book.totalChunks, 0);
  
  // Chunks do livro atual (proporcional à unit)
  const currentProgress = (currentUnit / currentBook.totalUnits) * currentBook.totalChunks;
  
  // Total de chunks de todos os livros
  const totalChunks = INFLUX_BOOKS.reduce((sum, book) => sum + book.totalChunks, 0);
  
  return Math.round(((previousChunks + currentProgress) / totalChunks) * 100);
}
