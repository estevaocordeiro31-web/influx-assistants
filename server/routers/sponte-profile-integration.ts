import { getSponteStudentData, type SponteStudentData } from './sponte-data';

export interface StudentSponteProfile {
  // Dados básicos
  name: string;
  email: string;
  
  // Frequência
  attendanceRate: number; // Percentual 0-100
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  
  // Avaliações
  averageGrade: number; // 0-10
  latestGrade: number;
  
  // Absências
  totalAbsences: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  
  // Tendência
  gradeTrend: 'up' | 'down' | 'stable';
}

/**
 * Integrar dados do Sponte com perfil do aluno
 */
export async function getStudentSponteProfile(studentEmail: string): Promise<StudentSponteProfile | null> {
  try {
    const sponteData = await getSponteStudentData(studentEmail);
    
    if (!sponteData) {
      return null;
    }

    // Extrair dados de frequência
    const totalClasses = sponteData.attendance.total;
    const attendedClasses = sponteData.attendance.present;
    const missedClasses = sponteData.attendance.absent;
    const attendanceRate = sponteData.attendance.percentage;

    // Extrair dados de avaliações
    const averageGrade = sponteData.evaluations.average;
    const latestGrade = sponteData.evaluations.lastScore;
    const gradeTrend = sponteData.evaluations.trend;

    // Extrair dados de absências
    const totalAbsences = sponteData.absences.total;
    const justifiedAbsences = sponteData.absences.justified;
    const unjustifiedAbsences = sponteData.absences.unjustified;

    return {
      name: '',
      email: studentEmail,
      
      attendanceRate,
      totalClasses,
      attendedClasses,
      missedClasses,
      
      averageGrade,
      latestGrade,
      
      totalAbsences,
      justifiedAbsences,
      unjustifiedAbsences,
      
      gradeTrend,
    };
  } catch (error) {
    console.error(`Erro ao integrar dados do Sponte para ${studentEmail}:`, error);
    return null;
  }
}

/**
 * Calcular insights do perfil do aluno
 */
export interface StudentProfileInsights {
  riskFactors: string[];
  strengths: string[];
  recommendations: string[];
  overallScore: number; // 0-100
}

export function analyzeStudentProfile(profile: StudentSponteProfile): StudentProfileInsights {
  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];
  let overallScore = 100;

  // Analisar frequência
  if (profile.attendanceRate < 70) {
    riskFactors.push(`Frequência baixa (${profile.attendanceRate}%)`);
    recommendations.push('Aumentar frequência nas aulas');
    overallScore -= 20;
  } else if (profile.attendanceRate >= 90) {
    strengths.push('Excelente frequência');
  }

  // Analisar desempenho
  if (profile.averageGrade < 6) {
    riskFactors.push(`Desempenho baixo (média ${profile.averageGrade})`);
    recommendations.push('Revisar conteúdo com tutor');
    overallScore -= 25;
  } else if (profile.averageGrade >= 8) {
    strengths.push('Excelente desempenho');
  }

  // Analisar tendência de notas
  if (profile.gradeTrend === 'down') {
    riskFactors.push('Desempenho em queda');
    recommendations.push('Investigar causas da queda de desempenho');
    overallScore -= 15;
  } else if (profile.gradeTrend === 'up') {
    strengths.push('Desempenho em alta');
  }

  // Analisar absências
  if (profile.unjustifiedAbsences > profile.justifiedAbsences) {
    riskFactors.push(`Muitas faltas injustificadas (${profile.unjustifiedAbsences})`);
    recommendations.push('Conversar sobre assiduidade');
    overallScore -= 10;
  }

  return {
    riskFactors,
    strengths,
    recommendations,
    overallScore: Math.max(0, Math.min(100, overallScore)),
  };
}
