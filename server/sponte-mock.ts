/**
 * Mock da API Sponte para desenvolvimento e testes
 * Simula dados reais de alunos para testar a integração
 */

interface MockSponteStudent {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "desistente" | "trancado";
  level: string;
  hoursLearned: number;
  lastAccess: Date;
}

// Dados simulados de alunos da inFlux
const mockStudents: MockSponteStudent[] = [
  {
    id: "sponte-001",
    name: "João Silva",
    email: "joao@example.com",
    status: "ativo",
    level: "Intermediário",
    hoursLearned: 24,
    lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
  },
  {
    id: "sponte-002",
    name: "Maria Santos",
    email: "maria@example.com",
    status: "ativo",
    level: "Iniciante",
    hoursLearned: 8,
    lastAccess: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
  },
  {
    id: "sponte-003",
    name: "Pedro Costa",
    email: "pedro@example.com",
    status: "inativo",
    level: "Elementar",
    hoursLearned: 12,
    lastAccess: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
  },
  {
    id: "sponte-004",
    name: "Ana Oliveira",
    email: "ana@example.com",
    status: "ativo",
    level: "Avançado",
    hoursLearned: 120,
    lastAccess: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
  },
  {
    id: "sponte-005",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    status: "desistente",
    level: "Iniciante",
    hoursLearned: 4,
    lastAccess: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 dias atrás
  },
];

/**
 * Mock: Autentica com a API Sponte (simula)
 */
export async function mockGetSponteToken(): Promise<string> {
  // Simula um delay de autenticação
  await new Promise((resolve) => setTimeout(resolve, 100));
  return "mock-token-" + Date.now();
}

/**
 * Mock: Recupera lista de alunos ativos do Sponte
 */
export async function mockGetSponteActiveStudents(): Promise<MockSponteStudent[]> {
  // Simula um delay de API
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Retorna apenas alunos ativos
  return mockStudents.filter((s) => s.status === "ativo");
}

/**
 * Mock: Recupera todos os alunos (ativos e inativos)
 */
export async function mockGetAllSponteStudents(): Promise<MockSponteStudent[]> {
  // Simula um delay de API
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockStudents;
}

/**
 * Mock: Atualiza status de um aluno
 */
export async function mockUpdateSponteStudentStatus(
  studentId: string,
  status: "ativo" | "inativo" | "desistente" | "trancado"
): Promise<boolean> {
  const student = mockStudents.find((s) => s.id === studentId);
  if (student) {
    student.status = status;
    return true;
  }
  return false;
}

/**
 * Mock: Registra acesso do aluno
 */
export async function mockLogSponteStudentAccess(studentId: string): Promise<boolean> {
  const student = mockStudents.find((s) => s.id === studentId);
  if (student) {
    student.lastAccess = new Date();
    return true;
  }
  return false;
}

/**
 * Mock: Sincroniza dados de alunos
 */
export async function mockSyncSponteStudents(): Promise<{ synced: number; failed: number }> {
  const students = await mockGetAllSponteStudents();
  return {
    synced: students.length,
    failed: 0,
  };
}
