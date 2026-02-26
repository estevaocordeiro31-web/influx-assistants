import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Página de debug para testar o sistema de login
 * Acesso: /test-login-debug
 */
export default function TestLoginDebug() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Testar autenticação
  const { data: authData, isLoading: authLoading } = trpc.auth.me.useQuery();

  const addResult = (name: string, status: 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, { name, status, message }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Teste 1: Verificar se está autenticado
      addResult(
        'Autenticação',
        authData ? 'success' : 'error',
        authData ? `Usuário autenticado: ${authData.name || authData.email}` : 'Não autenticado'
      );

      // Teste 2: Verificar dados do usuário
      if (authData) {
        addResult(
          'Dados do Usuário',
          'success',
          `ID: ${authData.id}, Role: ${authData.role}`
        );
      } else {
        addResult(
          'Dados do Usuário',
          'error',
          'Nenhum usuário autenticado'
        );
      }

      // Teste 3: Verificar cookies
      const cookies = document.cookie;
      if (cookies.includes('session')) {
        addResult(
          'Cookie de Sessão',
          'success',
          'Cookie de sessão encontrado'
        );
      } else {
        addResult(
          'Cookie de Sessão',
          'error',
          'Cookie de sessão não encontrado'
        );
      }

      // Teste 4: Verificar localStorage
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        addResult(
          'LocalStorage',
          'success',
          'Dados de autenticação armazenados'
        );
      } else {
        addResult(
          'LocalStorage',
          'error',
          'Nenhum dado de autenticação no localStorage'
        );
      }

    } catch (error) {
      addResult(
        'Testes',
        'error',
        `Erro ao executar testes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Debug de Login</h1>

          {/* Status Atual */}
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="font-semibold mb-4">Status Atual</h2>
            {authLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : authData ? (
              <div className="space-y-2">
                <p className="text-green-600 font-semibold">✓ Autenticado</p>
                <p>Nome: {authData.name}</p>
                <p>Email: {authData.email}</p>
                <p>Role: {authData.role}</p>
              </div>
            ) : (
              <p className="text-red-600 font-semibold">✗ Não autenticado</p>
            )}
          </div>

          {/* Botão de Teste */}
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="w-full mb-8"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Executando testes...
              </>
            ) : (
              'Executar Testes de Diagnóstico'
            )}
          </Button>

          {/* Resultados */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Resultados dos Testes</h2>
              {testResults.map((result, index) => (
                <Alert key={index} className={result.status === 'success' ? 'border-green-500' : 'border-red-500'}>
                  <div className="flex items-start gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{result.name}</p>
                      <AlertDescription>{result.message}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="font-semibold mb-4">Informações do Navegador</h2>
            <p className="text-sm text-muted-foreground">
              URL: {window.location.href}
            </p>
            <p className="text-sm text-muted-foreground">
              User Agent: {navigator.userAgent}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
