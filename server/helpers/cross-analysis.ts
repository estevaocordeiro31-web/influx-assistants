import { SponteStudentData } from './sponte-data';

export interface StudentProfileData {
  studyDurationYears: number | null;
  studyDurationMonths: number | null;
  specificGoals: string | null;
  discomfortAreas: string | null;
  comfortAreas: string | null;
  englishConsumptionSources: Record<string, boolean> | null;
  improvementAreas: string | null;
}

export interface RiskFactor {
  type: 'frequency' | 'grades' | 'absences' | 'engagement' | 'goal_mismatch';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface StrengthFactor {
  type: 'consistency' | 'high_grades' | 'engagement' | 'goal_alignment';
  description: string;
  value: number | string;
}

export interface CrossAnalysisResult {
  studentId: number;
  studentName: string;
  profileSummary: {
    goals: string;
    studyDuration: string;
    discomfortAreas: string;
    comfortAreas: string;
    improvementAreas: string;
    consumptionSources: string[];
  };
  spontePerformance: {
    attendanceRate: number;
    averageGrade: number;
    totalAbsences: number;
    justifiedAbsences: number;
    unjustifiedAbsences: number;
    gradeTrend: 'improving' | 'stable' | 'declining';
  };
  gaps: {
    frequencyGap: {
      expected: string;
      actual: number;
      gap: number;
      severity: 'low' | 'medium' | 'high';
    };
    performanceGap: {
      goalLevel: string;
      currentLevel: string;
      gap: number;
      severity: 'low' | 'medium' | 'high';
    };
    engagementGap: {
      expectedFrequency: string;
      actualFrequency: number;
      gap: number;
      severity: 'low' | 'medium' | 'high';
    };
  };
  riskFactors: RiskFactor[];
  strengthFactors: StrengthFactor[];
  insights: string[];
  recommendations: string[];
  overallHealthScore: number; // 0-100
}

/**
 * Realizar análise cruzada entre perfil do aluno e dados do Sponte
 */
export function performCrossAnalysis(
  studentId: number,
  studentName: string,
  profile: StudentProfileData,
  sponte: SponteStudentData
): CrossAnalysisResult {
  const riskFactors: RiskFactor[] = [];
  const strengthFactors: StrengthFactor[] = [];
  const insights: string[] = [];
  const recommendations: string[] = [];
  let healthScore = 100;

  // ========== ANÁLISE DE FREQUÊNCIA ==========
  const expectedFrequency = getExpectedFrequency(profile.specificGoals || '');
  const frequencyGap = expectedFrequency - sponte.attendance.percentage;
  
  if (frequencyGap > 20) {
    riskFactors.push({
      type: 'frequency',
      severity: 'high',
      description: `Frequência baixa (${sponte.attendance.percentage}%) comparada ao objetivo de ${expectedFrequency}%`,
      recommendation: 'Conversar com o aluno sobre barreiras para frequência e criar plano de ação',
    });
    healthScore -= 25;
    insights.push(`⚠️ Frequência crítica: O aluno está faltando muito. Presença em apenas ${sponte.attendance.present}/${sponte.attendance.total} aulas.`);
  } else if (frequencyGap > 10) {
    riskFactors.push({
      type: 'frequency',
      severity: 'medium',
      description: `Frequência moderada (${sponte.attendance.percentage}%) abaixo do esperado`,
      recommendation: 'Monitorar frequência e oferecer suporte se necessário',
    });
    healthScore -= 15;
  } else if (sponte.attendance.percentage >= expectedFrequency) {
    strengthFactors.push({
      type: 'consistency',
      description: 'Frequência consistente e dentro do esperado',
      value: `${sponte.attendance.percentage}%`,
    });
  }

  // ========== ANÁLISE DE DESEMPENHO ==========
  const goalLevel = mapGoalToLevel(profile.specificGoals || '');
  const currentLevel = mapGradeToLevel(sponte.evaluations.average);
  const performanceGap = levelToScore(goalLevel) - levelToScore(currentLevel);

  if (performanceGap > 2) {
    riskFactors.push({
      type: 'grades',
      severity: 'high',
      description: `Desempenho abaixo do objetivo. Atual: ${currentLevel}, Objetivo: ${goalLevel}`,
      recommendation: 'Oferecer aulas de reforço ou ajustar estratégia pedagógica',
    });
    healthScore -= 20;
    insights.push(`📉 Gap de desempenho: Aluno precisa melhorar de ${currentLevel} para ${goalLevel}.`);
  } else if (performanceGap > 1) {
    riskFactors.push({
      type: 'grades',
      severity: 'medium',
      description: `Desempenho moderadamente abaixo do objetivo`,
      recommendation: 'Oferecer suporte adicional em áreas específicas',
    });
    healthScore -= 10;
  } else if (performanceGap <= 0) {
    strengthFactors.push({
      type: 'high_grades',
      description: 'Desempenho alinhado ou acima do objetivo',
      value: `${sponte.evaluations.average.toFixed(1)}/10`,
    });
  }

  // ========== ANÁLISE DE TENDÊNCIA ==========
  if (sponte.evaluations.trend === 'down') {
    riskFactors.push({
      type: 'engagement',
      severity: 'high',
      description: 'Notas em queda - possível perda de engajamento',
      recommendation: 'Investigar causas da queda e oferecer suporte emocional/pedagógico',
    });
    healthScore -= 15;
    insights.push(`📉 Tendência negativa: Notas caindo. Investigar possíveis problemas.`);
  } else if (sponte.evaluations.trend === 'up') {
    strengthFactors.push({
      type: 'engagement',
      description: 'Notas em melhora - aluno está progredindo',
      value: 'Tendência positiva',
    });
  }

  // ========== ANÁLISE DE AUSÊNCIAS ==========
  const unjustifiedRatio = sponte.absences.total > 0 
    ? sponte.absences.unjustified / sponte.absences.total 
    : 0;

  if (unjustifiedRatio > 0.5) {
    riskFactors.push({
      type: 'absences',
      severity: 'high',
      description: `Muitas ausências injustificadas (${sponte.absences.unjustified}/${sponte.absences.total})`,
      recommendation: 'Conversar com o aluno sobre as ausências e entender as razões',
    });
    healthScore -= 15;
  } else if (sponte.absences.total > 5) {
    riskFactors.push({
      type: 'absences',
      severity: 'medium',
      description: `Total de ausências moderado (${sponte.absences.total})`,
      recommendation: 'Monitorar e oferecer suporte',
    });
    healthScore -= 8;
  }

  // ========== ANÁLISE DE ALINHAMENTO DE OBJETIVOS ==========
  const goalAlignment = analyzeGoalAlignment(profile, sponte);
  
  if (goalAlignment.mismatch) {
    riskFactors.push({
      type: 'goal_mismatch',
      severity: goalAlignment.severity,
      description: goalAlignment.description,
      recommendation: goalAlignment.recommendation,
    });
    healthScore -= goalAlignment.severity === 'high' ? 15 : 8;
    insights.push(`🎯 ${goalAlignment.insight}`);
  } else {
    strengthFactors.push({
      type: 'goal_alignment',
      description: 'Objetivos alinhados com ações do aluno',
      value: 'Bem alinhado',
    });
  }

  // ========== RECOMENDAÇÕES FINAIS ==========
  if (riskFactors.length === 0) {
    recommendations.push('✅ Aluno em bom caminho! Continue acompanhando.');
  } else {
    recommendations.push('⚠️ Aluno precisa de atenção. Priorize as ações recomendadas acima.');
    
    // Priorizar recomendações por severidade
    const highSeverity = riskFactors.filter(f => f.severity === 'high');
    if (highSeverity.length > 0) {
      recommendations.push(`🔴 URGENTE: ${highSeverity[0].recommendation}`);
    }
  }

  // Adicionar insights sobre consumo de inglês
  if (profile.englishConsumptionSources) {
    const sources = Object.entries(profile.englishConsumptionSources)
      .filter(([, selected]) => selected)
      .map(([source]) => source);
    
    if (sources.length > 0) {
      insights.push(`📺 Aluno consome inglês em: ${sources.join(', ')}`);
    } else {
      insights.push(`⚠️ Aluno não consome inglês fora da aula. Recomendar aumentar exposição.`);
      recommendations.push('Sugerir ao aluno que consuma mais conteúdo em inglês (séries, músicas, podcasts)');
    }
  }

  return {
    studentId,
    studentName,
    profileSummary: {
      goals: profile.specificGoals || 'Não informado',
      studyDuration: profile.studyDurationYears 
        ? `${profile.studyDurationYears}a ${profile.studyDurationMonths || 0}m`
        : 'Não informado',
      discomfortAreas: profile.discomfortAreas || 'Não informado',
      comfortAreas: profile.comfortAreas || 'Não informado',
      improvementAreas: profile.improvementAreas || 'Não informado',
      consumptionSources: profile.englishConsumptionSources
        ? Object.entries(profile.englishConsumptionSources)
            .filter(([, selected]) => selected)
            .map(([source]) => source)
        : [],
    },
    spontePerformance: {
      attendanceRate: sponte.attendance.percentage,
      averageGrade: sponte.evaluations.average,
      totalAbsences: sponte.absences.total,
      justifiedAbsences: sponte.absences.justified,
      unjustifiedAbsences: sponte.absences.unjustified,
      gradeTrend: sponte.evaluations.trend === 'up' ? 'improving' : sponte.evaluations.trend === 'down' ? 'declining' : 'stable',
    },
    gaps: {
      frequencyGap: {
        expected: `${expectedFrequency}%`,
        actual: sponte.attendance.percentage,
        gap: frequencyGap,
        severity: frequencyGap > 20 ? 'high' : frequencyGap > 10 ? 'medium' : 'low',
      },
      performanceGap: {
        goalLevel: goalLevel,
        currentLevel: currentLevel,
        gap: performanceGap,
        severity: performanceGap > 2 ? 'high' : performanceGap > 1 ? 'medium' : 'low',
      },
      engagementGap: {
        expectedFrequency: 'Semanal',
        actualFrequency: sponte.attendance.percentage,
        gap: 100 - sponte.attendance.percentage,
        severity: (100 - sponte.attendance.percentage) > 30 ? 'high' : 'medium',
      },
    },
    riskFactors,
    strengthFactors,
    insights,
    recommendations,
    overallHealthScore: Math.max(0, healthScore),
  };
}

/**
 * Mapear objetivo para frequência esperada
 */
function getExpectedFrequency(goal: string): number {
  const lowerGoal = goal.toLowerCase();
  
  if (lowerGoal.includes('fluência') || lowerGoal.includes('avançado')) {
    return 95; // Aluno que quer fluência deve ter frequência muito alta
  } else if (lowerGoal.includes('conversação') || lowerGoal.includes('intermediário')) {
    return 85;
  } else if (lowerGoal.includes('viagem') || lowerGoal.includes('básico')) {
    return 75;
  } else {
    return 80; // Default
  }
}

/**
 * Mapear nota para nível
 */
function mapGradeToLevel(grade: number): string {
  if (grade >= 9) return 'Avançado';
  if (grade >= 7.5) return 'Intermediário';
  if (grade >= 6) return 'Elementar';
  if (grade >= 4) return 'Iniciante';
  return 'Iniciante';
}

/**
 * Mapear objetivo para nível esperado
 */
function mapGoalToLevel(goal: string): string {
  const lowerGoal = goal.toLowerCase();
  
  if (lowerGoal.includes('fluência')) return 'Avançado';
  if (lowerGoal.includes('conversação')) return 'Intermediário';
  if (lowerGoal.includes('viagem')) return 'Elementar';
  if (lowerGoal.includes('carreira')) return 'Avançado';
  return 'Intermediário';
}

/**
 * Converter nível para score numérico
 */
function levelToScore(level: string): number {
  const scores: Record<string, number> = {
    'Iniciante': 1,
    'Elementar': 2,
    'Intermediário': 3,
    'Upper Intermediário': 3.5,
    'Avançado': 4,
    'Proficiente': 5,
  };
  return scores[level] || 2;
}

/**
 * Analisar alinhamento entre objetivos e ações
 */
function analyzeGoalAlignment(profile: StudentProfileData, sponte: SponteStudentData) {
  const goal = profile.specificGoals?.toLowerCase() || '';
  const attendance = sponte.attendance.percentage;
  const grade = sponte.evaluations.average;

  // Se quer fluência mas frequência baixa
  if (goal.includes('fluência') && attendance < 80) {
    return {
      mismatch: true,
      severity: 'high' as const,
      description: 'Aluno quer fluência mas frequência é baixa para atingir esse objetivo',
      recommendation: 'Conversar sobre o compromisso necessário para atingir fluência',
      insight: 'Objetivo ambicioso (fluência) mas frequência insuficiente para atingir',
    };
  }

  // Se quer fluência mas notas baixas
  if (goal.includes('fluência') && grade < 7) {
    return {
      mismatch: true,
      severity: 'high' as const,
      description: 'Aluno quer fluência mas desempenho atual está abaixo do esperado',
      recommendation: 'Oferecer suporte pedagógico intensivo',
      insight: 'Aluno precisa melhorar desempenho para atingir objetivo de fluência',
    };
  }

  // Se quer viagem mas frequência moderada
  if (goal.includes('viagem') && attendance < 60) {
    return {
      mismatch: true,
      severity: 'medium' as const,
      description: 'Objetivo de viagem requer mais dedicação',
      recommendation: 'Motivar aluno a aumentar frequência',
      insight: 'Objetivo de viagem requer mais dedicação e frequência',
    };
  }

  return {
    mismatch: false,
    severity: 'low' as const,
    description: '',
    recommendation: '',
    insight: '',
  };
}
