import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, Users } from 'lucide-react';

export default function AdminBulkSyncPage() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncedCount, setSyncedCount] = useState(0);

  const syncMutation = trpc.bulkStudentSync.syncAllStudents.useMutation({
    onSuccess: (data) => {
      setSyncStatus('success');
      setSyncedCount(data.created + data.updated);
      setSyncMessage(`✅ ${data.created + data.updated} alunos sincronizados com sucesso!`);
    },
    onError: (error) => {
      setSyncStatus('error');
      setSyncMessage(`❌ Erro na sincronização: ${error.message}`);
    },
  });

  const statusQuery = trpc.bulkStudentSync.getSyncStatus.useQuery(undefined, { refetchInterval: 5000 });

  const handleSync = () => {
    setSyncStatus('syncing');
    setSyncMessage('Sincronizando alunos do Dashboard...');
    syncMutation.mutate({ dryRun: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Sincronização em Massa de Alunos
            </CardTitle>
            <CardDescription className="text-blue-100">
              Sincronize até 182 alunos ativos do Dashboard central
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Status atual */}
            {statusQuery.data && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Total de Alunos Sincronizados</p>
                  <p className="text-3xl font-bold text-blue-600">{statusQuery.data.totalStudents}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Última Sincronização</p>
                  <p className="text-sm text-green-600 font-semibold">
                    {statusQuery.data.lastSync
                      ? new Date(statusQuery.data.lastSync).toLocaleString('pt-BR')
                      : 'Nunca'}
                  </p>
                </div>
              </div>
            )}

            {/* Mensagem de status */}
            {syncMessage && (
              <Alert
                className={
                  syncStatus === 'success'
                    ? 'bg-green-50 border-green-200'
                    : syncStatus === 'error'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                }
              >
                <div className="flex items-center gap-2">
                  {syncStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {syncStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {syncStatus === 'syncing' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                </div>
                <AlertDescription className="ml-2">{syncMessage}</AlertDescription>
              </Alert>
            )}

            {/* Botão de sincronização */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSync()}
                disabled={syncStatus === 'syncing'}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Sincronizar 182 Alunos
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Esta ação importará todos os alunos ativos do Dashboard central com seus dados de nível, livros e cursos.
              </p>
            </div>

            {/* Informações */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <h3 className="font-semibold text-gray-900">O que será sincronizado:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Nome completo do aluno</li>
                <li>✓ Email e telefone</li>
                <li>✓ Nível (Book 1-5)</li>
                <li>✓ Livros já cursados</li>
                <li>✓ Cursos extras inscritos</li>
                <li>✓ Objetivo de aprendizado</li>
                <li>✓ Senhas temporárias</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Sincronizar alunos:</strong> Clique no botão acima para importar os 182 alunos do Dashboard
            </p>
            <p>
              <strong>2. Gerar mensagens:</strong> Crie 182 mensagens personalizadas com nome, nível e data de desbloqueio
            </p>
            <p>
              <strong>3. Enviar credenciais:</strong> O webhook enviará status de criação de acesso ao Dashboard para envio via WhatsApp
            </p>
            <p>
              <strong>4. Testar com 5 alunos:</strong> Valide o fluxo completo antes de expandir para todos os 182
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
