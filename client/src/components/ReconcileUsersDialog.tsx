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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LinkIcon, Search, CheckCircle, AlertTriangle, User, XCircle } from 'lucide-react';

interface ReconcileUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface UnlinkedUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  status: string | null;
}

interface StudentCandidate {
  id: string;
  name: string;
  email: string;
  book_level: string | null;
  status: string;
  matricula: string | null;
}

export function ReconcileUsersDialog({ open, onOpenChange, onSuccess }: ReconcileUsersDialogProps) {
  const [selectedUser, setSelectedUser] = useState<UnlinkedUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedCount, setLinkedCount] = useState(0);

  const utils = trpc.useUtils();

  // Buscar usuários sem vínculo
  const { data: unlinkedData, isLoading: loadingUnlinked, refetch: refetchUnlinked } =
    trpc.adminStudents.getUnlinkedUsers.useQuery(undefined, {
      enabled: open,
    });

  // Buscar candidatos para vincular
  const { data: candidatesData, isLoading: loadingCandidates } =
    trpc.adminStudents.searchStudentCandidates.useQuery(
      { query: searchQuery },
      { enabled: searchQuery.length >= 2 }
    );

  // Mutation para vincular
  const linkMutation = trpc.adminStudents.linkUserToStudent.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setLinkedCount((prev) => prev + 1);
      setSelectedUser(null);
      setSearchQuery('');
      refetchUnlinked();
      utils.adminStudents.getStudents.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro ao vincular: ${error.message}`);
    },
  });

  const handleLink = (candidate: StudentCandidate) => {
    if (!selectedUser) return;
    linkMutation.mutate({
      userId: selectedUser.id,
      studentId: candidate.id,
    });
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSearchQuery('');
    onOpenChange(false);
  };

  const unlinkedUsers: UnlinkedUser[] = unlinkedData?.users || [];
  const candidates: StudentCandidate[] = candidatesData?.students || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <LinkIcon className="w-5 h-5 text-orange-400" />
            Reconciliação de Usuários
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Vincule usuários sem student_id aos registros correspondentes no Dashboard Central.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contador de vinculações */}
          {linkedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-green-900/30 border border-green-700/40 rounded-lg p-3"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">
                {linkedCount} {linkedCount === 1 ? 'usuário vinculado' : 'usuários vinculados'} nesta sessão
              </span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!selectedUser ? (
              /* Lista de usuários sem vínculo */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    Usuários sem vínculo com o Dashboard Central:
                  </p>
                  {loadingUnlinked && (
                    <span className="text-xs text-gray-500">Carregando...</span>
                  )}
                </div>

                {unlinkedUsers.length === 0 && !loadingUnlinked ? (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                    <p className="text-green-300 font-medium">Todos os usuários estão vinculados!</p>
                    <p className="text-gray-500 text-sm">Não há usuários pendentes de reconciliação.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {unlinkedUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center">
                            <User className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name || 'Sem nome'}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-900/50 text-orange-300 border-orange-700 text-xs">
                            Sem vínculo
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                            className="border-orange-600 text-orange-300 hover:bg-orange-900/30 text-xs"
                          >
                            <LinkIcon className="w-3 h-3 mr-1" />
                            Vincular
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Busca de candidatos para vincular */
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Usuário selecionado */}
                <div className="bg-orange-900/20 border border-orange-700/40 rounded-lg p-3">
                  <p className="text-xs text-orange-400 uppercase tracking-wide mb-1">Vinculando usuário:</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-300" />
                    <div>
                      <p className="text-sm font-medium text-white">{selectedUser.name}</p>
                      <p className="text-xs text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Campo de busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar aluno no Dashboard Central (nome, email ou matrícula)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-800 border-gray-600 text-white placeholder-gray-500"
                    autoFocus
                  />
                </div>

                {/* Resultados da busca */}
                {searchQuery.length >= 2 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {loadingCandidates ? (
                      <p className="text-center text-gray-500 text-sm py-4">Buscando...</p>
                    ) : candidates.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                        <p className="text-yellow-300 text-sm">Nenhum aluno ativo encontrado</p>
                        <p className="text-gray-500 text-xs">Tente buscar por nome completo ou matrícula</p>
                      </div>
                    ) : (
                      candidates.map((candidate) => (
                        <motion.div
                          key={candidate.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{candidate.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-gray-400">{candidate.email || 'Sem email'}</p>
                              {candidate.book_level && (
                                <Badge className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs">
                                  {candidate.book_level}
                                </Badge>
                              )}
                              {candidate.matricula && (
                                <span className="text-xs text-gray-500">#{candidate.matricula}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleLink(candidate)}
                            disabled={linkMutation.isPending}
                            className="bg-green-700 hover:bg-green-600 text-white text-xs"
                          >
                            {linkMutation.isPending ? (
                              'Vinculando...'
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vincular
                              </>
                            )}
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}

                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="text-xs text-gray-500 text-center">Digite pelo menos 2 caracteres para buscar</p>
                )}

                {/* Botão voltar */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(null);
                    setSearchQuery('');
                  }}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar e voltar à lista
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão fechar */}
          {!selectedUser && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
