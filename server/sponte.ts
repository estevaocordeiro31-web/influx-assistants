/**
 * Sponte Integration Helper
 * Integra com a API do Sponte para sincronizar dados de alunos
 */

import axios from "axios";

// Configurações do Sponte
import { ENV } from "./_core/env";

const SPONTE_BASE_URL = "https://api.sponteweb.com.br";
const SPONTE_LOGIN = ENV.sponteLogin;
const SPONTE_PASSWORD = ENV.spontePassword;

interface SponteStudent {
  id: string;
  name: string;
  email: string;
  status: "ativo" | "inativo" | "desistente" | "trancado";
  level?: string;
  hoursLearned?: number;
  lastAccess?: Date;
}

interface SponteAuthResponse {
  token: string;
  expiresIn: number;
}

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

/**
 * Autentica com a API do Sponte e retorna um token
 */
export async function getSponteToken(): Promise<string> {
  // Verifica se token em cache ainda é válido
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const response = await axios.post<SponteAuthResponse>(
      `${SPONTE_BASE_URL}/auth/login`,
      {
        login: SPONTE_LOGIN,
        password: SPONTE_PASSWORD,
      },
      {
        timeout: 10000,
      }
    );

    cachedToken = response.data.token;
    // Token expira em 1 hora, renovar 5 minutos antes
    tokenExpiresAt = Date.now() + (response.data.expiresIn - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error("[Sponte] Erro ao autenticar:", error);
    throw new Error("Falha ao autenticar com Sponte");
  }
}

/**
 * Puxar dados de um aluno específico do Sponte
 */
export async function getSponteStudent(studentId: string): Promise<SponteStudent | null> {
  try {
    const token = await getSponteToken();

    const response = await axios.get(
      `${SPONTE_BASE_URL}/students/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      status: response.data.status || "ativo",
      level: response.data.level,
      hoursLearned: response.data.hoursLearned || 0,
      lastAccess: response.data.lastAccess ? new Date(response.data.lastAccess) : undefined,
    };
  } catch (error) {
    console.error(`[Sponte] Erro ao buscar aluno ${studentId}:`, error);
    return null;
  }
}

/**
/**
 * Recupera lista de alunos ativos do Sponte
 */
export async function getSponteActiveStudents(): Promise<SponteStudent[]> {
  try {
    const token = await getSponteToken();

    const response = await axios.get(
      `${SPONTE_BASE_URL}/students?status=ativo&limit=1000`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data.map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.status || "ativo",
      level: student.level,
      hoursLearned: student.hoursLearned || 0,
      lastAccess: student.lastAccess ? new Date(student.lastAccess) : undefined,
    }));
  } catch (error) {
    console.error("[Sponte] Erro ao buscar alunos ativos:", error);
    return [];
  }
}

/**
 * Atualizar status de um aluno no Sponte
 */
export async function updateSponteStudentStatus(
  studentId: string,
  status: "ativo" | "inativo" | "desistente" | "trancado"
): Promise<boolean> {
  try {
    const token = await getSponteToken();

    await axios.patch(
      `${SPONTE_BASE_URL}/students/${studentId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return true;
  } catch (error) {
    console.error(`[Sponte] Erro ao atualizar status do aluno ${studentId}:`, error);
    return false;
  }
}

/**
 * Registrar acesso do aluno no Sponte
 */
export async function logSponteStudentAccess(studentId: string): Promise<boolean> {
  try {
    const token = await getSponteToken();

    await axios.post(
      `${SPONTE_BASE_URL}/students/${studentId}/access-log`,
      {
        timestamp: new Date().toISOString(),
        app: "influx-personal-tutor",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return true;
  } catch (error) {
    console.error(`[Sponte] Erro ao registrar acesso do aluno ${studentId}:`, error);
    return false;
  }
}

/**
 * Sincronizar dados de alunos do Sponte com o banco de dados local
 */
export async function syncSponteStudents(): Promise<{ synced: number; failed: number }> {
  try {
    const students = await getSponteActiveStudents();
    let synced = 0;
    let failed = 0;

    for (const student of students) {
      try {
        // Aqui você implementaria a lógica de sincronização com o banco de dados local
        // Por enquanto, apenas contamos os sucessos
        synced++;
      } catch (error) {
        console.error(`[Sponte] Erro ao sincronizar aluno ${student.id}:`, error);
        failed++;
      }
    }

    console.log(`[Sponte] Sincronização concluída: ${synced} alunos sincronizados, ${failed} falharam`);
    return { synced, failed };
  } catch (error) {
    console.error("[Sponte] Erro durante sincronização:", error);
    return { synced: 0, failed: 0 };
  }
}


// Interfaces para Matrículas e Turmas
interface SponteMatricula {
  id: string;
  alunoId: string;
  turmaId: string;
  turmaNome: string;
  cursoNome: string;
  dataInicio: string;
  dataFim?: string;
  status: string;
  estagioAtual?: string;
  unitAtual?: number;
}

interface SponteTurma {
  id: string;
  nome: string;
  curso: string;
  nivel?: string;
  professor?: string;
  horario?: string;
  diasSemana?: string[];
}

/**
 * Buscar matrículas de um aluno específico
 */
export async function getSponteStudentMatriculas(alunoId: string): Promise<SponteMatricula[]> {
  try {
    const token = await getSponteToken();

    const response = await axios.get(
      `${SPONTE_BASE_URL}/api/v3/Matriculas?alunoId=${alunoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data.map((m: any) => ({
      id: m.id || m.Id,
      alunoId: m.alunoId || m.AlunoId,
      turmaId: m.turmaId || m.TurmaId,
      turmaNome: m.turmaNome || m.TurmaNome || m.Turma?.Nome || '',
      cursoNome: m.cursoNome || m.CursoNome || m.Curso?.Nome || '',
      dataInicio: m.dataInicio || m.DataInicio,
      dataFim: m.dataFim || m.DataFim,
      status: m.status || m.Status || 'ativo',
      estagioAtual: m.estagioAtual || m.EstagioAtual,
      unitAtual: m.unitAtual || m.UnitAtual || 1,
    }));
  } catch (error) {
    console.error(`[Sponte] Erro ao buscar matrículas do aluno ${alunoId}:`, error);
    return [];
  }
}

/**
 * Buscar todas as turmas ativas
 */
export async function getSponteTurmas(): Promise<SponteTurma[]> {
  try {
    const token = await getSponteToken();

    const response = await axios.get(
      `${SPONTE_BASE_URL}/api/v3/Turmas`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data.map((t: any) => ({
      id: t.id || t.Id,
      nome: t.nome || t.Nome,
      curso: t.curso || t.Curso || t.CursoNome,
      nivel: t.nivel || t.Nivel,
      professor: t.professor || t.Professor,
      horario: t.horario || t.Horario,
      diasSemana: t.diasSemana || t.DiasSemana || [],
    }));
  } catch (error) {
    console.error("[Sponte] Erro ao buscar turmas:", error);
    return [];
  }
}

/**
 * Buscar matrícula ativa de um aluno (a mais recente)
 */
export async function getSponteActiveMatricula(alunoId: string): Promise<SponteMatricula | null> {
  const matriculas = await getSponteStudentMatriculas(alunoId);
  
  // Filtrar apenas matrículas ativas e ordenar por data de início (mais recente primeiro)
  const ativas = matriculas
    .filter(m => m.status.toLowerCase() === 'ativo' || m.status.toLowerCase() === 'ativa')
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
  
  return ativas[0] || null;
}

/**
 * Buscar livro atual do aluno baseado na matrícula
 */
export async function getSponteStudentCurrentBook(alunoId: string): Promise<{
  bookName: string;
  turmaName: string;
  unit: number;
} | null> {
  const matricula = await getSponteActiveMatricula(alunoId);
  
  if (!matricula) {
    return null;
  }
  
  return {
    bookName: matricula.cursoNome || matricula.turmaNome,
    turmaName: matricula.turmaNome,
    unit: matricula.unitAtual || 1,
  };
}
