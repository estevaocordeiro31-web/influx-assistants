import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Copy, CheckCircle, AlertTriangle, Mail, User, Lock } from 'lucide-react';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export function ResetPasswordDialog({ open, onOpenChange, student }: ResetPasswordDialogProps) {
  const [resetResult, setResetResult] = useState<{
    newPassword: string;
    name: string;
    email: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const resetMutation = trpc.adminStudents.resetStudentPassword.useMutation({
    onSuccess: (data) => {
      setResetResult({
        newPassword: data.newPassword,
        name: data.user.name || '',
        email: data.user.email || '',
      });
      toast.success(`Senha resetada com sucesso para ${data.user.name}!`);
    },
    onError: (error) => {
      toast.error(`Erro ao resetar senha: ${error.message}`);
    },
  });

  const handleReset = () => {
    if (!student) return;
    resetMutation.mutate({ userId: student.id, sendEmail: false });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAll = () => {
    if (!resetResult) return;
    const text = `🔐 Credenciais de Acesso - inFlux Personal Tutor\n\n🌐 Link: https://tutor.imaind.tech/login\n👤 Email: ${resetResult.email}\n🔑 Senha: ${resetResult.newPassword}\n\nAcesse e altere sua senha após o primeiro login.`;
    handleCopy(text);
  };

  const handleClose = () => {
    setResetResult(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <KeyRound className="w-5 h-5 text-yellow-400" />
            Resetar Senha do Aluno
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {student && `Resetar senha de ${student.name}`}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!resetResult ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Informações do aluno */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{student?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{student?.email}</span>
                </div>
              </div>

              {/* Aviso */}
              <div className="flex items-start gap-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Atenção</p>
                  <p className="text-yellow-300/80 mt-1">
                    A senha atual será substituída. A nova senha seguirá o padrão{' '}
                    <code className="bg-yellow-900/50 px-1 rounded">PrimeiroNome@2026</code>.
                    Compartilhe as credenciais com o aluno após o reset.
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={resetMutation.isPending}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {resetMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Resetar Senha
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Sucesso */}
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Senha resetada com sucesso!</span>
              </div>

              {/* Credenciais */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Credenciais de Acesso
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">URL de Acesso</p>
                      <p className="text-sm text-blue-400 font-mono">
                        tutor.imaind.tech/login
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy('https://tutor.imaind.tech/login')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-white font-mono">{resetResult.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(resetResult.email)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Nova Senha</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-green-400 font-mono font-bold">
                          {resetResult.newPassword}
                        </p>
                        <Badge className="bg-green-900/50 text-green-300 text-xs border-green-700">
                          <Lock className="w-2 h-2 mr-1" />
                          Nova
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(resetResult.newPassword)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instruções para compartilhar */}
              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
                <p className="text-xs text-blue-300">
                  💡 <strong>Dica:</strong> Clique em "Copiar Tudo" para copiar as credenciais
                  formatadas e enviar via WhatsApp ou email para o aluno.
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Fechar
                </Button>
                <Button
                  onClick={handleCopyAll}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Copiado!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copiar Tudo
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
