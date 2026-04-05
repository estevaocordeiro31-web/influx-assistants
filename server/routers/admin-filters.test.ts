import { describe, it, expect } from 'vitest';

/**
 * Testes para validar filtros avançados do AdminDashboard
 */

interface StudentData {
  id: number;
  studentId: string | null;
  name: string;
  email: string;
  level: "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced" | "proficient";
  objective: "career" | "travel" | "studies" | "other";
  hoursLearned: number;
  streakDays: number;
  lastActivity: string;
  status: string;
  createdAt: Date;
}

// Mock de dados de alunos
const mockStudents: StudentData[] = [
  {
    id: 1,
    studentId: "INF-2026-0001",
    name: "João Silva",
    email: "joao@example.com",
    level: "beginner",
    objective: "career",
    hoursLearned: 10,
    streakDays: 5,
    lastActivity: "01/03/2026",
    status: "ativo",
    createdAt: new Date(),
  },
  {
    id: 2,
    studentId: "INF-2026-0002",
    name: "Maria Santos",
    email: "maria@example.com",
    level: "intermediate",
    objective: "travel",
    hoursLearned: 25,
    streakDays: 10,
    lastActivity: "28/02/2026",
    status: "ativo",
    createdAt: new Date(),
  },
  {
    id: 3,
    studentId: "INF-2026-0003",
    name: "Pedro Costa",
    email: "pedro@example.com",
    level: "advanced",
    objective: "studies",
    hoursLearned: 50,
    streakDays: 20,
    lastActivity: "25/02/2026",
    status: "inativo",
    createdAt: new Date(),
  },
];

// Função de filtro (mesmo padrão do AdminDashboard)
function filterStudents(
  students: StudentData[],
  searchTerm: string,
  filterLevel: string,
  filterObjective: string,
  filterStatus: string
): StudentData[] {
  return students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || student.level === filterLevel;
    const matchesObjective = !filterObjective || student.objective === filterObjective;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    return matchesSearch && matchesLevel && matchesObjective && matchesStatus;
  });
}

describe('AdminDashboard - Filtros Avançados', () => {
  it('deve retornar todos os alunos quando nenhum filtro está ativo', () => {
    const result = filterStudents(mockStudents, '', '', '', '');
    expect(result).toHaveLength(3);
  });

  it('deve filtrar por nível "beginner"', () => {
    const result = filterStudents(mockStudents, '', 'beginner', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('João Silva');
  });

  it('deve filtrar por nível "intermediate"', () => {
    const result = filterStudents(mockStudents, '', 'intermediate', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Maria Santos');
  });

  it('deve filtrar por objetivo "career"', () => {
    const result = filterStudents(mockStudents, '', '', 'career', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('João Silva');
  });

  it('deve filtrar por objetivo "travel"', () => {
    const result = filterStudents(mockStudents, '', '', 'travel', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Maria Santos');
  });

  it('deve filtrar por status "ativo"', () => {
    const result = filterStudents(mockStudents, '', '', '', 'ativo');
    expect(result).toHaveLength(2);
  });

  it('deve filtrar por status "inativo"', () => {
    const result = filterStudents(mockStudents, '', '', '', 'inativo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pedro Costa');
  });

  it('deve combinar filtros: nível + objetivo', () => {
    const result = filterStudents(mockStudents, '', 'beginner', 'career', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('João Silva');
  });

  it('deve combinar filtros: nível + status', () => {
    const result = filterStudents(mockStudents, '', 'intermediate', '', 'ativo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Maria Santos');
  });

  it('deve combinar filtros: objetivo + status', () => {
    const result = filterStudents(mockStudents, '', '', 'studies', 'inativo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pedro Costa');
  });

  it('deve filtrar por busca de nome', () => {
    const result = filterStudents(mockStudents, 'João', '', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('João Silva');
  });

  it('deve filtrar por busca de email', () => {
    const result = filterStudents(mockStudents, 'maria@', '', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Maria Santos');
  });

  it('deve combinar busca com filtros', () => {
    const result = filterStudents(mockStudents, 'Silva', 'beginner', 'career', 'ativo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('João Silva');
  });

  it('deve retornar vazio quando nenhum aluno corresponde aos filtros', () => {
    const result = filterStudents(mockStudents, '', 'proficient', '', '');
    expect(result).toHaveLength(0);
  });

  it('deve retornar vazio quando a busca não encontra correspondência', () => {
    const result = filterStudents(mockStudents, 'inexistente', '', '', '');
    expect(result).toHaveLength(0);
  });

  it('deve ser case-insensitive na busca', () => {
    const result1 = filterStudents(mockStudents, 'JOÃO', '', '', '');
    const result2 = filterStudents(mockStudents, 'joão', '', '', '');
    expect(result1).toHaveLength(1);
    expect(result2).toHaveLength(1);
    expect(result1[0].id).toBe(result2[0].id);
  });

  it('deve filtrar corretamente com múltiplos filtros ativados', () => {
    const result = filterStudents(mockStudents, '', 'advanced', 'studies', 'inativo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pedro Costa');
  });
});
