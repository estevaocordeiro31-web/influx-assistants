import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BackToSchoolAdminPage() {
  const [campaignId] = useState(1); // Usar ID da campanha padrão
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const syncMutation = trpc.backToSchool.syncStudentsWithBooks.useMutation();
  const reportQuery = trpc.backToSchool.generateReportByBook.useQuery({ campaignId }, { enabled: false });
  const sendReportMutation = trpc.backToSchool.sendReportToCoordinator.useMutation();
  const statsQuery = trpc.backToSchool.getCampaignStats.useQuery({ campaignId });
  const exportQuery = trpc.backToSchool.exportReportAsCSV.useQuery({ campaignId }, { enabled: false });

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setError(null);
      const result = await syncMutation.mutateAsync({ campaignId });
      setSyncResult(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendReport = async () => {
    try {
      setError(null);
      const result = await sendReportMutation.mutateAsync({
        campaignId,
        coordinatorEmail: 'jennifer@influx.com.br',
      });
      alert('Relatório enviado com sucesso para Jennifer!');
    } catch (err) {
      setError(String(err));
    }
  };

  const handleExportCSV = async () => {
    try {
      setError(null);
      const result = await exportQuery.refetch();
      if (!result.data) throw new Error('Failed to export CSV');
      const csvData = result.data;
      // Criar download do CSV
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData.csv));
      element.setAttribute('download', csvData.filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      setError(String(err));
    }
  };

  const stats = statsQuery.data?.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Volta às Aulas - Administração</h1>
          <p className="text-slate-400">Sincronize alunos, gere relatórios e acompanhe a campanha</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Total de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalEnrolled}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Matriculados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.byStatus.enrolled}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Acessos Expirados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{stats.accessExpiredCount}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{stats.byStatus.completed}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Books Distribution */}
        {stats && Object.keys(stats.byBook).length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Book</CardTitle>
              <CardDescription>Alunos sincronizados por nível</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.byBook).map(([book, count]) => (
                  <div key={book} className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">{book}</p>
                    <p className="text-2xl font-bold text-indigo-400">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Result */}
        {syncResult && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Sincronização Concluída
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300">{syncResult.message}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Alunos Processados</p>
                    <p className="text-2xl font-bold text-green-400">{syncResult.data.success}</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-slate-400">Erros</p>
                    <p className="text-2xl font-bold text-red-400">{syncResult.data.errors}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              'Iniciar Sincronização'
            )}
          </Button>

          <Button
            onClick={handleSendReport}
            disabled={!syncResult}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base"
          >
            Enviar Relatório para Jennifer
          </Button>

          <Button
            onClick={handleExportCSV}
            disabled={!syncResult || exportQuery.isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
          >
            {exportQuery.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </>
            )}
          </Button>
        </div>

        {/* Info Section */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Informações da Campanha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-300">
            <p>
              <strong>Estrutura de Books:</strong> Fluxie → Junior → Regular → Comunicação Avançada
            </p>
            <p>
              <strong>Total de Alunos:</strong> 182 alunos do Dashboard
            </p>
            <p>
              <strong>Senha Temporária:</strong> Gerada automaticamente para cada aluno
            </p>
            <p>
              <strong>Acesso Válido por:</strong> 30 dias após sincronização
            </p>
            <p>
              <strong>Relatório:</strong> Enviado para Jennifer com lista completa de alunos por book
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
