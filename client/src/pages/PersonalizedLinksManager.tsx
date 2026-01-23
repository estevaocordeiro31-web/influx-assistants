import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PersonalizedLinksManager() {
  const [studentId, setStudentId] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const createLinkMutation = trpc.personalizedLinks.createLink.useMutation({
    onSuccess: (data) => {
      toast.success('Link criado com sucesso!');
      setStudentId('');
    },
    onError: (error) => {
      toast.error(`Erro ao criar link: ${error.message}`);
    },
  });

  const deactivateLinkMutation = trpc.personalizedLinks.deactivateLink.useMutation({
    onSuccess: () => {
      toast.success('Link desativado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao desativar link: ${error.message}`);
    },
  });

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.error('Por favor, insira o ID do aluno');
      return;
    }
    createLinkMutation.mutate({ studentId: parseInt(studentId) });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gerenciador de Links Personalizados
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crie e gerencie links de acesso personalizados para alunos
        </p>
      </div>

      {/* Criar Novo Link */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Link</CardTitle>
          <CardDescription>
            Gere um link personalizado válido por 7 meses para um aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">ID do Aluno</Label>
              <Input
                id="studentId"
                type="number"
                placeholder="Ex: 1"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={createLinkMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              disabled={createLinkMutation.isPending}
              className="w-full"
            >
              {createLinkMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Link'
              )}
            </Button>
          </form>

          {createLinkMutation.data && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Link Criado com Sucesso!
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email do Aluno:</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        fabio_hk@hotmail.com
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Link:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100 overflow-auto">
                          {createLinkMutation.data.fullUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(createLinkMutation.data.fullUrl)}
                        >
                          {copiedLink === createLinkMutation.data.fullUrl ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Válido até:</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {new Date(createLinkMutation.data.link.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Como Usar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Para Alunos:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Receba o link personalizado por email</li>
              <li>Clique no link para acessar o dashboard</li>
              <li>Não é necessário fazer login - o link valida automaticamente</li>
              <li>O link é válido por 7 meses</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Para Coordenadores:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Insira o ID do aluno acima</li>
              <li>Clique em "Gerar Link"</li>
              <li>Copie o link e compartilhe com o aluno</li>
              <li>Você pode desativar links a qualquer momento</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
