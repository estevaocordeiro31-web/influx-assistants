import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TestLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('direcaojundiairetiro@influx.com.br');
  const [password, setPassword] = useState('inFlux123!@#');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Erro ao fazer login');
        return;
      }

      toast.success('Login realizado com sucesso!');
      // Aguardar um pouco para o cookie ser definido
      setTimeout(() => {
        setLocation('/');
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">Login de Teste</CardTitle>
          <CardDescription className="text-slate-400">
            Use as credenciais de teste para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              />
            </div>

            {/* Aviso */}
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                Este é um endpoint de teste para desenvolvimento. Não use em produção!
              </p>
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            {/* Credenciais de teste */}
            <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-300 space-y-1">
              <p className="font-semibold text-slate-200">Credenciais de teste:</p>
              <p>📧 direcaojundiairetiro@influx.com.br</p>
              <p>🔑 inFlux123!@#</p>
              <p className="text-xs text-slate-400 mt-2">Role: Admin</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
