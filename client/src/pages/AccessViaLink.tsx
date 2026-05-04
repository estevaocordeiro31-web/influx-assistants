import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function AccessViaLink() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/access/:linkHash');
  const linkHash = params?.linkHash as string | undefined;
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Mutation para autenticar via link
  const authenticateMutation = trpc.personalizedLinks.authenticateViaLink.useMutation();

  useEffect(() => {
    if (!linkHash) return;

    // Chamar mutation para autenticar via link
    authenticateMutation.mutate(
      { linkHash },
      {
        onSuccess: (data) => {
          setSessionToken(linkHash);
          console.log('Autenticação bem-sucedida:', data);
          // Redirecionar para dashboard após 2 segundos com reload forçado
          setTimeout(() => {
            // Forçar reload completo da página para limpar cache e carregar nova sessão
            window.location.href = '/student/home';
          }, 2000);
        },
        onError: (error) => {
          console.error('Authentication error:', error);
        },
      }
    );
  }, [linkHash]);

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Link Inválido</h1>
          </div>
          <p className="text-gray-600 mb-6">
            O link de acesso não foi fornecido. Por favor, verifique o link e tente novamente.
          </p>
          <Button onClick={() => setLocation('/')} className="w-full">
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  if (authenticateMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Validando Link</h1>
          <p className="text-gray-600">
            Por favor aguarde enquanto validamos seu link de acesso...
          </p>
        </Card>
      </div>
    );
  }

  if (authenticateMutation.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Link Expirado</h1>
          </div>
          <p className="text-gray-600 mb-6">
            {authenticateMutation.error?.message || 'Este link de acesso expirou ou não é válido. Por favor, solicite um novo link ao seu coordenador.'}
          </p>
          <Button onClick={() => setLocation('/')} className="w-full">
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  if (sessionToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">Link Validado!</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Seu link foi validado com sucesso. Você será redirecionado para o dashboard em alguns segundos...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
