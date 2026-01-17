/**
 * Sponte Integration Helper
 * Integra com a API do Sponte para sincronizar dados de alunos
 */

import axios from "axios";

// Configurações do Sponte
const SPONTE_BASE_URL = "https://api.sponteweb.com.br";
const SPONTE_LOGIN = process.env.SPONTE_LOGIN || "estevao2@influxjundiai2";
const SPONTE_PASSWORD = process.env.SPONTE_PASSWORD || "Estevao1!";

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
async function getSponteToken(): Promise<string> {
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
 * Puxar lista de alunos ativos do Sponte
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
