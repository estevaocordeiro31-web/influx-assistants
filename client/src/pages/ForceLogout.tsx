import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, LogOut, CheckCircle } from 'lucide-react';

export default function ForceLogout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'logging-out' | 'clearing' | 'done'>('logging-out');
  
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    // Executar logout automaticamente ao carregar a página
    performLogout();
  }, []);

  const performLogout = async () => {
    try {
      setStep('logging-out');
      
      // 1. Chamar logout no backend
      await logoutMutation.mutateAsync();
      
      setStep('clearing');
      
      // 2. Limpar TUDO do navegador
      sessionStorage.clear();
      localStorage.clear();
      
      // 3. Limpar cookies manualmente
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // 4. Aguardar um pouco para garantir que tudo foi limpo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('done');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar tudo localmente
      setStep('clearing');
      sessionStorage.clear();
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      setStep('done');
    }
  };

  const goToLogin = () => {
    // Usar replace para garantir que não volta para esta página
    window.location.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2a2f4a] to-[#1a1f3a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo-influx.png"
              alt="inFlux Logo"
              className="h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Logout Forçado
          </h1>
        </div>

        {/* Status do Logout */}
        <div className="space-y-6">
          {step === 'logging-out' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-[#39ff14]" />
              <p className="text-lg text-gray-700 font-medium">
                Encerrando sessão no servidor...
              </p>
            </div>
          )}

          {step === 'clearing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-[#39ff14]" />
              <p className="text-lg text-gray-700 font-medium">
                Limpando cache e cookies...
              </p>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg text-gray-700 font-medium mb-6">
                ✅ Logout completo realizado!
              </p>
              <p className="text-sm text-gray-600 mb-8">
                Todas as sessões foram encerradas e o cache foi limpo.
                Agora você pode fazer login com outra conta.
              </p>
              <Button
                onClick={goToLogin}
                className="w-full bg-[#39ff14] hover:bg-[#2ee00f] text-gray-900 font-semibold py-6 text-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Ir para Login
              </Button>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Esta página garante que você saia completamente do sistema,
            limpando todas as sessões, cookies e cache do navegador.
          </p>
        </div>
      </Card>
    </div>
  );
}
