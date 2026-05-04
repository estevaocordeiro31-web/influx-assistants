import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface SponteData {
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

interface SponteDataSectionProps {
  data: SponteData;
  isLoading?: boolean;
}

export function SponteDataSection({ data, isLoading }: SponteDataSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (percentage >= 75) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
  };

  const getEvaluationColor = (average: number) => {
    if (average >= 8) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (average >= 6) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
  };

  return (
    <div className="space-y-4">
      {/* Frequência */}
      <Card className={`border ${getAttendanceColor(data.attendance.percentage)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>Frequência</CardTitle>
            </div>
            <Badge variant="outline">
              {data.attendance.percentage.toFixed(1)}%
            </Badge>
          </div>
          <CardDescription>
            {data.attendance.present} de {data.attendance.total} aulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Presentes</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.attendance.present}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ausências</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.attendance.absent}
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.attendance.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Faltas */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <CardTitle>Faltas</CardTitle>
          </div>
          <CardDescription>
            Total de {data.absences.total} faltas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Justificadas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.absences.justified}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Não Justificadas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.absences.unjustified}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações */}
      <Card className={`border ${getEvaluationColor(data.evaluations.average)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Avaliações</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {data.evaluations.trend === 'up' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  ↑ Em alta
                </Badge>
              )}
              {data.evaluations.trend === 'down' && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  ↓ Em queda
                </Badge>
              )}
              {data.evaluations.trend === 'stable' && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  → Estável
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Última nota: {data.evaluations.lastScore.toFixed(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Média Geral</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {data.evaluations.average.toFixed(1)}/10
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(data.evaluations.average / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
