/**
 * Student Report Viewer Component
 * Displays student progress report with print/download functionality
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Printer, Loader2, TrendingUp, Award, Target, Clock } from 'lucide-react';

interface StudentReportViewerProps {
  studentId?: number;
}

export function StudentReportViewer({ studentId }: StudentReportViewerProps) {
  const [showFullReport, setShowFullReport] = useState(false);
  
  const { data: reportData, isLoading, error } = trpc.reports.getStudentReportData.useQuery(
    { studentId },
    { enabled: true }
  );
  
  const { data: fullReport, isLoading: isLoadingFull } = trpc.reports.getStudentReport.useQuery(
    { studentId },
    { enabled: showFullReport }
  );
  
  const handlePrint = () => {
    if (fullReport?.html) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(fullReport.html);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  
  const handleDownload = () => {
    if (fullReport?.html) {
      const blob = new Blob([fullReport.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-progresso-${reportData?.student.name || 'aluno'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8 text-center text-red-400">
          Erro ao carregar relatório: {error.message}
        </CardContent>
      </Card>
    );
  }
  
  if (!reportData) {
    return null;
  }
  
  const { student, progress, activity, badges, recommendations } = reportData;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Relatório de Progresso</CardTitle>
                <p className="text-slate-400">{student.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullReport(true)}
                disabled={isLoadingFull}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                {isLoadingFull ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Gerar Relatório
              </Button>
              {fullReport && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-3xl font-bold text-white">{student.totalHours}h</p>
            <p className="text-sm text-slate-400">Horas de Estudo</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold text-white">{student.chunksLearned}</p>
            <p className="text-sm text-slate-400">Chunks Dominados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-3xl font-bold text-white">{student.streak}</p>
            <p className="text-sm text-slate-400">Dias Seguidos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-3xl font-bold text-white">{progress.averageScore}%</p>
            <p className="text-sm text-slate-400">Média Geral</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <span className="text-lg">✓</span> Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.strongAreas.length > 0 ? (
              <ul className="space-y-2">
                {progress.strongAreas.map((area, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {area}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">Continue praticando para identificar seus pontos fortes</p>
            )}
          </CardContent>
        </Card>
        
        {/* Weak Areas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <span className="text-lg">⚠</span> Áreas para Melhorar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.weakAreas.length > 0 ? (
              <ul className="space-y-2">
                {progress.weakAreas.map((area, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    {area}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">Excelente! Nenhuma área crítica identificada</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Badges */}
      {badges.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">🏆 Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.id}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium"
                >
                  🏆 {badge.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recommendations */}
      <Card className="bg-green-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400">💡 Recomendações do Fluxie</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="text-green-500 mt-1">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Full Report Preview */}
      {fullReport && showFullReport && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Prévia do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="bg-white rounded-lg overflow-hidden"
              style={{ height: '600px' }}
            >
              <iframe
                srcDoc={fullReport.html}
                className="w-full h-full border-0"
                title="Relatório de Progresso"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
