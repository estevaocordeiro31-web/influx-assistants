import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentProfileDetailsProps {
  studentName: string;
  studentEmail: string;
  
  // Frequência
  attendanceRate: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  
  // Avaliações
  averageGrade: number;
  latestGrade: number;
  gradeTrend: 'up' | 'down' | 'stable';
  
  // Absências
  totalAbsences: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  
  // Insights
  riskFactors?: string[];
  strengths?: string[];
  recommendations?: string[];
  overallScore?: number;
}

export function StudentProfileDetails({
  studentName,
  studentEmail,
  attendanceRate,
  totalClasses,
  attendedClasses,
  missedClasses,
  averageGrade,
  latestGrade,
  gradeTrend,
  totalAbsences,
  justifiedAbsences,
  unjustifiedAbsences,
  riskFactors = [],
  strengths = [],
  recommendations = [],
  overallScore = 0,
}: StudentProfileDetailsProps) {
  const getTrendIcon = () => {
    switch (gradeTrend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Score Geral */}
      {overallScore > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Saúde Geral do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Score de Desempenho</span>
                  <span className="text-lg font-bold text-blue-600">{overallScore}/100</span>
                </div>
                <Progress value={overallScore} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequência */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequência</CardTitle>
          <CardDescription>Dados de presença nas aulas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Taxa de Frequência</span>
                <span className={`text-lg font-bold ${attendanceRate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                  {attendanceRate}%
                </span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Total de Aulas</p>
                <p className="text-2xl font-bold">{totalClasses}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Presentes</p>
                <p className="text-2xl font-bold text-green-600">{attendedClasses}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Faltas</p>
                <p className="text-2xl font-bold text-red-600">{missedClasses}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Desempenho Acadêmico</CardTitle>
          <CardDescription>Notas e tendência de aprendizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Média Geral</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${getGradeColor(averageGrade)}`}>
                  {averageGrade.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">/10</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Última Nota</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${getGradeColor(latestGrade)}`}>
                  {latestGrade.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">/10</p>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {getTrendIcon()}
                <span className="text-xs text-muted-foreground capitalize">
                  {gradeTrend === 'up' ? 'Em alta' : gradeTrend === 'down' ? 'Em queda' : 'Estável'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Absências */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Absências</CardTitle>
          <CardDescription>Registro de faltas justificadas e injustificadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{totalAbsences}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Justificadas</p>
              <p className="text-2xl font-bold text-yellow-600">{justifiedAbsences}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Injustificadas</p>
              <p className="text-2xl font-bold text-red-600">{unjustifiedAbsences}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fatores de Risco */}
      {riskFactors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5" />
              Fatores de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {riskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pontos Fortes */}
      {strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-green-900">
              <CheckCircle2 className="w-5 h-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base text-blue-900">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
