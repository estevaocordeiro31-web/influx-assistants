import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { trpc } from '../lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function DirectLogin() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/login-direct/:token');
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = trpc.directLogin.loginViaToken.useMutation();

  useEffect(() => {
    if (!params?.token) {
      setStatus('error');
      setErrorMessage('Token não fornecido na URL');
      return;
    }

    // Limpar tudo antes de tentar login
    sessionStorage.clear();
    localStorage.clear();

    // Executar login automaticamente
    performLogin(params.token);
  }, [params?.token]);

  const performLogin = async (token: string) => {
    try {
      setStatus('processing');

      const result = await loginMutation.mutateAsync({ token });

      setStatus('success');

      // Aguardar um pouco para mostrar sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirecionar com reload completo
      window.location.replace(result.redirectTo);
    } catch (error: any) {
      console.error('Erro no login direto:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Erro ao fazer login. Token inválido ou expirado.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2a2f4a] to-[#1a1f3a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/influx-logo.png"
              alt="inFlux Logo"
              className="h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            inFlux Personal Tutor
          </h1>
        </div>

        {/* Status */}
        <div className="space-y-6">
          {status === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-[#39ff14]" />
              <p className="text-lg text-gray-700 font-medium">
                Autenticando...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Aguarde enquanto validamos seu acesso
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg text-gray-700 font-medium mb-2">
                ✅ Login realizado com sucesso!
              </p>
              <p className="text-sm text-gray-600">
                Redirecionando para seu dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8">
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  O link de acesso pode estar expirado ou inválido.
                  Entre em contato com a coordenação para obter um novo link.
                </p>
                <Button
                  onClick={() => setLocation('/login')}
                  className="w-full bg-[#39ff14] hover:bg-[#2ee00f] text-gray-900 font-semibold"
                >
                  Ir para Login Manual
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Informações de Suporte */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Problemas para acessar?{' '}
            <a
              href="mailto:suporte@influx.com.br"
              className="text-[#39ff14] hover:underline font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
