/**
 * Helper para extrair e processar dados do Sponte
 * Retorna frequência, faltas e avaliações do aluno
 */

export interface SponteStudentData {
  attendance: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  absences: {
    total: number;
    justified: number;
    unjustified: number;
  };
  evaluations: {
    average: number;
    lastScore: number;
    trend: 'up' | 'down' | 'stable';
  };
}

/**
 * Extrai dados do Sponte para um aluno
 * Por enquanto retorna dados mockados para teste
 * Será integrado com API real do Sponte depois
 */
export async function getSponteStudentData(studentEmail: string): Promise<SponteStudentData> {
  try {
    // Mock data para Fabio durante testes
    if (studentEmail === 'fabio_hk@hotmail.com') {
      return {
        attendance: {
          total: 20,
          present: 18,
          absent: 2,
          percentage: 90,
        },
        absences: {
          total: 2,
          justified: 1,
          unjustified: 1,
        },
        evaluations: {
          average: 8.5,
          lastScore: 9.0,
          trend: 'up',
        },
      };
    }

    // Dados genéricos para outros alunos
    return {
      attendance: {
        total: 20,
        present: 16,
        absent: 4,
        percentage: 80,
      },
      absences: {
        total: 4,
        justified: 2,
        unjustified: 2,
      },
      evaluations: {
        average: 7.5,
        lastScore: 7.8,
        trend: 'stable',
      },
    };
  } catch (error) {
    console.error(`[Sponte Data] Erro ao obter dados para ${studentEmail}:`, error);
    
    // Retornar dados padrão em caso de erro
    return {
      attendance: {
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
      },
      absences: {
        total: 0,
        justified: 0,
        unjustified: 0,
      },
      evaluations: {
        average: 0,
        lastScore: 0,
        trend: 'stable',
      },
    };
  }
}

/**
 * Calcula a tendência de avaliações
 * Compara última nota com média
 */
export function calculateEvaluationTrend(
  average: number,
  lastScore: number
): 'up' | 'down' | 'stable' {
  const difference = lastScore - average;
  
  if (difference > 0.5) return 'up';
  if (difference < -0.5) return 'down';
  return 'stable';
}

/**
 * Formata dados do Sponte para exibição
 */
export function formatSponteData(data: SponteStudentData) {
  return {
    ...data,
    attendance: {
      ...data.attendance,
      percentage: Math.round(data.attendance.percentage * 10) / 10,
    },
    evaluations: {
      ...data.evaluations,
      average: Math.round(data.evaluations.average * 10) / 10,
      lastScore: Math.round(data.evaluations.lastScore * 10) / 10,
    },
  };
}
