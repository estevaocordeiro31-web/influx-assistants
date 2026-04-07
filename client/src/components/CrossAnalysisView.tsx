import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CrossAnalysisViewProps {
  analysis: any;
}

export function CrossAnalysisView({ analysis }: CrossAnalysisViewProps) {
  if (!analysis) return null;

  const healthScore = analysis.overallHealthScore;
  const getHealthColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 75) return 'bg-green-50';
    if (score >= 50) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <Card className={getHealthBg(healthScore)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Saúde Geral do Aluno</span>
            <span className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}/100
            </span>
          </CardTitle>
          <CardDescription>
            {healthScore >= 75
              ? '✅ Aluno em bom caminho'
              : healthScore >= 50
              ? '⚠️ Aluno precisa de atenção'
              : '🔴 Aluno em risco'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={healthScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Perfil do Aluno */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Tempo de Estudo</h3>
              <p className="text-lg">{analysis.profileSummary.studyDuration}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Objetivos</h3>
              <p className="text-lg">{analysis.profileSummary.goals}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Áreas de Conforto</h3>
              <p className="text-lg">{analysis.profileSummary.comfortAreas}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Áreas de Desconforto</h3>
              <p className="text-lg">{analysis.profileSummary.discomfortAreas}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Fontes de Consumo</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.profileSummary.consumptionSources.length > 0 ? (
                  analysis.profileSummary.consumptionSources.map((source: string) => (
                    <span
                      key={source}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {source}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhuma fonte informada</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desempenho no Sponte */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho (Sponte)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Frequência</h3>
              <p className="text-2xl font-bold">{analysis.spontePerformance.attendanceRate}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Média de Notas</h3>
              <p className="text-2xl font-bold">{analysis.spontePerformance.averageGrade.toFixed(1)}/10</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total de Ausências</h3>
              <p className="text-2xl font-bold">{analysis.spontePerformance.totalAbsences}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Tendência</h3>
              <div className="flex items-center gap-2">
                {analysis.spontePerformance.gradeTrend === 'improving' ? (
                  <>
                    <TrendingUp className="text-green-600" />
                    <span className="text-lg font-bold text-green-600">Melhorando</span>
                  </>
                ) : analysis.spontePerformance.gradeTrend === 'declining' ? (
                  <>
                    <TrendingDown className="text-red-600" />
                    <span className="text-lg font-bold text-red-600">Caindo</span>
                  </>
                ) : (
                  <span className="text-lg font-bold">Estável</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaps Identificados */}
      <Card>
        <CardHeader>
          <CardTitle>Gaps Identificados</CardTitle>
          <CardDescription>Diferenças entre objetivos e desempenho real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Frequency Gap */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Gap de Frequência</h3>
                <span className={`text-sm font-bold ${
                  analysis.gaps.frequencyGap.severity === 'high'
                    ? 'text-red-600'
                    : analysis.gaps.frequencyGap.severity === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {analysis.gaps.frequencyGap.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Esperado: {analysis.gaps.frequencyGap.expected} | Atual: {analysis.gaps.frequencyGap.actual}%
              </p>
              <Progress value={Math.max(0, 100 - analysis.gaps.frequencyGap.gap)} className="h-2" />
            </div>

            {/* Performance Gap */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Gap de Desempenho</h3>
                <span className={`text-sm font-bold ${
                  analysis.gaps.performanceGap.severity === 'high'
                    ? 'text-red-600'
                    : analysis.gaps.performanceGap.severity === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {analysis.gaps.performanceGap.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Objetivo: {analysis.gaps.performanceGap.goalLevel} | Atual: {analysis.gaps.performanceGap.currentLevel}
              </p>
            </div>

            {/* Engagement Gap */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Gap de Engajamento</h3>
                <span className={`text-sm font-bold ${
                  analysis.gaps.engagementGap.severity === 'high'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {analysis.gaps.engagementGap.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Esperado: {analysis.gaps.engagementGap.expectedFrequency} | Atual: {analysis.gaps.engagementGap.actualFrequency}%
              </p>
              <Progress value={analysis.gaps.engagementGap.actualFrequency} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fatores de Risco */}
      {analysis.riskFactors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={20} />
              Fatores de Risco ({analysis.riskFactors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.riskFactors.map((factor: any, idx: number) => (
                <div key={idx} className="border-l-4 border-red-600 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold">{factor.description}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      factor.severity === 'high'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {factor.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pontos Fortes */}
      {analysis.strengthFactors.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} />
              Pontos Fortes ({analysis.strengthFactors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.strengthFactors.map((factor: any, idx: number) => (
                <div key={idx} className="border-l-4 border-green-600 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{factor.description}</h3>
                    <span className="text-sm font-bold text-green-600">{factor.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {analysis.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.insights.map((insight: string, idx: number) => (
                <div key={idx} className="flex gap-2 text-sm">
                  <span className="text-muted-foreground">•</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      {analysis.recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-600">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex gap-2 text-sm">
                  <span className="text-blue-600 font-bold">→</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
