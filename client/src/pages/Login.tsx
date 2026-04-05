import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Eye, EyeOff, BookOpen, Mic, Trophy } from 'lucide-react';

const LUCAS_SCENE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-scene-arrival_29f3ee3b.png";

const FEATURES = [
  { icon: BookOpen, label: "Chunks do dia a dia" },
  { icon: Mic,      label: "Prática com IA" },
  { icon: Trophy,   label: "Gamificação real" },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');

  const loginMutation = trpc.authPassword.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Preencha email e senha'); return; }

    loginMutation.mutate({ email, password }, {
      onSuccess: (data) => {
        sessionStorage.clear();
        localStorage.clear();
        if (data.mustChangePassword) {
          window.location.replace('/change-password?required=true');
          return;
        }
        window.location.replace(data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      },
      onError: (err) => setError(err.message || 'Credenciais inválidas. Tente novamente.'),
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0d1a" }}>

      {/* ── LEFT PANEL — hero image (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* background scene */}
        <img
          src={LUCAS_SCENE}
          alt="Lucas chegando"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        {/* dark overlay gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,13,26,0.55) 0%, rgba(10,13,26,0.15) 60%, rgba(10,13,26,0.75) 100%)" }} />

        {/* Aurora glow spots */}
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-25 blur-[100px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, #0ea5e9, transparent 70%)" }} />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/influx-logo_17347370.jpeg" alt="inFlux" className="h-9 w-9 object-cover rounded-lg drop-shadow-lg" />
            <span className="text-white font-black text-xl tracking-tight">inFlux</span>
          </div>

          {/* Bottom tagline */}
          <div>
            <h2 className="text-white text-4xl font-black leading-tight mb-4 drop-shadow-lg">
              Aprenda inglês<br />
              <span style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                do jeito certo.
              </span>
            </h2>
            <div className="flex flex-col gap-2.5">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.3)" }}>
                    <Icon size={15} className="text-purple-300" />
                  </div>
                  <span className="text-gray-200 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Aurora glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, #0ea5e9 60%, transparent 80%)" }} />

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/influx-logo_17347370.jpeg" alt="inFlux" className="h-8 w-8 object-cover rounded-md" />
            <span className="text-white font-black text-lg">inFlux</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-white text-3xl font-black mb-1">Bem-vindo de volta</h1>
            <p className="text-gray-400 text-sm">Acesse sua plataforma personalizada</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                autoComplete="email"
                className="h-12 rounded-xl text-white placeholder-gray-500 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  autoComplete="current-password"
                  className="h-12 rounded-xl pr-11 text-white placeholder-gray-500 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Botão */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-12 rounded-xl font-bold text-base text-white mt-1"
              style={{
                background: loginMutation.isPending
                  ? "rgba(124,58,237,0.5)"
                  : "linear-gradient(135deg, #7c3aed, #0ea5e9)",
              }}
            >
              {loginMutation.isPending ? (
                <><Loader2 size={18} className="mr-2 animate-spin" /> Entrando...</>
              ) : "Entrar"}
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => setLocation('/')}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Voltar para a página inicial
            </button>
            <p className="text-xs text-gray-600">
              Problemas?{' '}
              <a href="mailto:suporte@influx.com.br" className="text-purple-400 hover:text-purple-300 transition-colors">
                suporte@influx.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
