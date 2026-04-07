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