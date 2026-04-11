import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isRequired = new URLSearchParams(window.location.search).get('required') === 'true';

  const changePasswordMutation = trpc.authPassword.changePassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success('Senha alterada com sucesso!');
      setTimeout(() => {
        window.location.replace('/student/dashboard');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || 'Erro ao alterar senha');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não coincidem');
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (newPassword === currentPassword) {
      setError('A nova senha deve ser diferente da senha atual');
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>
        <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #22c55e, #06b6d4)', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Senha alterada!
          </h2>
          <p className="text-white/50">Redirecionando para o dashboard...</p>
        </div>
      </div>
    );
  }

  const PasswordField = ({ id, label, placeholder, value, setValue, show, setShow }: {
    id: string; label: string; placeholder: string;
    value: string; setValue: (v: string) => void;
    show: boolean; setShow: (v: boolean) => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white/70 text-sm font-medium">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={changePasswordMutation.isPending}
          className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 pl-10 pr-12 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
          autoComplete={id === 'current' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1145 30%, #0d2137 60%, #0a1628 100%)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'pulse 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animation: 'pulse 10s ease-in-out infinite alternate' }} />
      </div>

      <div className="w-full max-w-md relative z-10" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              }}>
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              {isRequired ? 'Troca de Senha Obrigatória' : 'Alterar Senha'}
            </h1>
            {isRequired ? (
              <div className="rounded-xl p-3 mt-3"
                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <p className="text-amber-300/80 text-sm">
                  Sua senha foi redefinida pelo administrador. Crie uma nova senha para continuar.
                </p>
              </div>
            ) : (
              <p className="text-white/50 text-sm">
                Escolha uma senha segura para proteger sua conta.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField
              id="current" label={isRequired ? 'Senha temporária' : 'Senha atual'}
              placeholder={isRequired ? 'Digite a senha temporária' : 'Sua senha atual'}
              value={currentPassword} setValue={setCurrentPassword}
              show={showCurrent} setShow={setShowCurrent}
            />
            <PasswordField
              id="new" label="Nova senha"
              placeholder="Mínimo 6 caracteres"
              value={newPassword} setValue={setNewPassword}
              show={showNew} setShow={setShowNew}
            />
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-xs text-red-400 -mt-3 ml-1">Senha muito curta (mínimo 6 caracteres)</p>
            )}
            <PasswordField
              id="confirm" label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              value={confirmPassword} setValue={setConfirmPassword}
              show={showConfirm} setShow={setShowConfirm}
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400 -mt-3 ml-1">As senhas não coincidem</p>
            )}
            {confirmPassword.length > 0 && newPassword === confirmPassword && newPassword.length >= 6 && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 -mt-3 ml-1">
                <CheckCircle className="w-3 h-3" /> Senhas coincidem
              </p>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                color: '#fff',
                boxShadow: changePasswordMutation.isPending ? 'none' : '0 4px 20px rgba(124, 58, 237, 0.3)',
              }}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </form>

          {/* Back link (only if not required) */}
          {!isRequired && (
            <div className="mt-5 text-center">
              <button
                onClick={() => window.history.back()}
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
