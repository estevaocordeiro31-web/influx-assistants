import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { CrossAnalysisView } from '@/components/CrossAnalysisView';
import { useAuth } from '@/_core/hooks/useAuth';

export default function StudentCrossAnalysisPage({ params }: any) {
  const studentId = params?.studentId;
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [parsedStudentId, setParsedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (studentId) {
      setParsedStudentId(parseInt(studentId, 10));
    }
  }, [studentId]);

  const { data: analysisData, isLoading } = trpc.crossAnalysis.getStudentAnalysis.useQuery(
    { studentId: parsedStudentId || 0 },
    { enabled: !!parsedStudentId }
  );

  if (!user) {
    return null;
  }

  if (!parsedStudentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Aluno não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Análise Cruzada do Aluno</h1>
            {analysisData?.analysis && (
              <p className="text-muted-foreground mt-2">
                {analysisData.analysis.studentName}
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && !analysisData?.success && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Erro ao carregar análise do aluno</p>
            </CardContent>
          </Card>
        )}

        {/* Analysis View */}
        {!isLoading && analysisData?.success && analysisData.analysis && (
          <CrossAnalysisView analysis={analysisData.analysis} />
        )}
      </div>
    </div>
  );
}
