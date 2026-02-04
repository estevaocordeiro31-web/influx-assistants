import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Copy, Check, Loader2, Search, User } from 'lucide-react';
import { toast } from 'sonner';

interface StudentData {
  id: number;
  name: string | null;
  email: string | null;
  studentId: string | null;
}

export function PersonalizedLinksManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Buscar alunos
  const { data: studentsData, isLoading: loadingStudents } = trpc.adminStudents.getStudents.useQuery({});
  
  const students: StudentData[] = studentsData?.students || [];

  // Filtrar alunos pelo termo de busca
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    const studentIdStr = student.studentId ? String(student.studentId).toLowerCase() : '';
    return (
      (student.name?.toLowerCase().includes(term) || false) ||
      (student.email?.toLowerCase().includes(term) || false) ||
      studentIdStr.includes(term) ||
      String(student.id).includes(term)
    );
  });

  const createLinkMutation = trpc.personalizedLinks.createLink.useMutation({
    onSuccess: (data) => {
      toast.success('Link criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar link: ${error.message}`);
    },
  });

  const handleCreateLink = async () => {
    if (!selectedStudent) {
      toast.error('Por favor, selecione um aluno');
      return;
    }
    createLinkMutation.mutate({ studentId: selectedStudent.id });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSelectStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setSearchTerm('');
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
          <div className="space-y-4">
            {/* Busca de Aluno */}
            <div className="space-y-2">
              <Label>Buscar Aluno</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={createLinkMutation.isPending}
                />
              </div>
              
              {/* Lista de Alunos Filtrados */}
              {searchTerm && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                  {loadingStudents ? (
                    <div className="p-4 text-center text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                      Carregando alunos...
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Nenhum aluno encontrado
                    </div>
                  ) : (
                    filteredStudents.slice(0, 10).map((student) => (
                      <button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {student.name || 'Sem nome'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono text-gray-400">
                              ID: {student.studentId || student.id}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Aluno Selecionado */}
            {selectedStudent && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedStudent.name || 'Sem nome'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedStudent.email}
                    </p>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      ID do Sistema: {selectedStudent.id} | ID do Aluno: {selectedStudent.studentId || '-'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Alterar
                  </Button>
                </div>
              </div>
            )}

            {/* Botão Gerar Link */}
            <Button
              onClick={handleCreateLink}
              disabled={!selectedStudent || createLinkMutation.isPending}
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
          </div>

          {/* Link Criado */}
          {createLinkMutation.data && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Link Criado com Sucesso!
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Aluno:</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedStudent?.name || 'Aluno'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Link:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100 overflow-auto break-all">
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
              <li>Receba o link personalizado por email ou WhatsApp</li>
              <li>Clique no link para acessar o dashboard</li>
              <li>Não é necessário fazer login - o link valida automaticamente</li>
              <li>O link é válido por 7 meses</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Para Coordenadores:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Busque o aluno pelo nome, email ou ID</li>
              <li>Selecione o aluno na lista</li>
              <li>Clique em "Gerar Link"</li>
              <li>Copie o link e compartilhe com o aluno</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
