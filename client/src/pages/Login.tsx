import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Eye, EyeOff, GraduationCap } from 'lucide-react';
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
          // Keep tRPC query cache intact, only clear session-specific storage
          sessionStorage.clear();

          const target = data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
          // Use href instead of replace to ensure cookie is set before navigation
          window.location.href = target;
        },
        onError: (error) => {
          setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'pulse 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animation: 'pulse 10s ease-in-out infinite alternate' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', animation: 'pulse 12s ease-in-out infinite' }} />
      </div>

      {/* Glassmorphism card */}
      <div className="w-full max-w-md relative z-10"
        style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              }}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              ImAInd <span style={{ color: '#06b6d4' }}>TUTOR</span>
            </h1>
            <p className="text-sm text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sua plataforma personalizada de aprendizado
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                autoComplete="email"
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70 text-sm font-medium">
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
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 pr-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                color: '#fff',
                boxShadow: loginMutation.isPending ? 'none' : '0 4px 20px rgba(124, 58, 237, 0.3)',
              }}
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

          {/* Divider */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/30 text-center">
              Problemas para acessar?{' '}
              <a
                href="mailto:suporte@influx.com.br"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </div>

        {/* Subtle brand footer */}
        <p className="text-center text-[11px] text-white/20 mt-6">
          Powered by ImAInd
        </p>
      </div>
    </div>
  );
}
