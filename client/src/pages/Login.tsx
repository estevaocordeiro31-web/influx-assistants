import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = trpc.authPassword.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log('Login bem-sucedido:', data);
          
          // LIMPAR CACHE E STORAGE
          sessionStorage.clear();
          localStorage.clear();
          
          // Redirecionar baseado no role COM RELOAD FORÇADO
          if (data.user.role === 'admin') {
            window.location.replace('/admin/dashboard');
          } else {
            window.location.replace('/student/dashboard');
          }
        },
        onError: (error) => {
          console.error('Erro no login:', error);
          setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2a2f4a] to-[#1a1f3a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
        {/* Logo e Título */}
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
          <p className="text-gray-600">
            Faça login para acessar sua plataforma personalizada
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className="w-full"
              autoComplete="email"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className="w-full pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botão de Login */}
          <Button
            type="submit"
            className="w-full bg-[#39ff14] hover:bg-[#2ee00f] text-gray-900 font-semibold py-6 text-lg"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Link para Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation('/')}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Voltar para a página inicial
          </button>
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
