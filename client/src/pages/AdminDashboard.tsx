import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, AlertCircle, LogOut, Search, Bell, Loader2, Edit, BarChart3, Sparkles, Brain, MessageSquare, Hash, RefreshCw, Download, Headphones } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface StudentData {
  id: number;
  studentId: string | null;
  name: string;
  email: string;
  level: string;
  objective: string;
  hoursLearned: number;
  streakDays: number;
  lastActivity: string;
  status: "active" | "inactive" | "at_risk";
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  // Buscar alunos do banco de dados
  const { data: studentsData, isLoading, refetch } = trpc.adminStudents.getStudents.useQuery({
    search: searchTerm || undefined,
    limit: 50,
  });

  // Mutation para gerar IDs de todos os alunos
  const assignAllIdsMutation = trpc.adminStudents.assignAllStudentIds.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Mutation para exportar dados de alunos ativos
  const exportStudentsJSONMutation = trpc.adminExport.exportActiveStudentsJSON.useQuery();
  const exportStudentsCSVMutation = trpc.adminExport.exportActiveStudentsCSV.useQuery();

  const students = studentsData?.students || [];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudents = students.filter((s) => s.status === "active").length;
  const atRiskStudents = students.filter((s) => s.status === "at_risk").length;
  const totalHours = students.reduce((sum, s) => sum + s.hoursLearned, 0);

  // Mapeamento de níveis
  const levelMap: Record<string, string> = {
    beginner: "Iniciante",
    elementary: "Elementar",
    intermediate: "Intermediário",
    upper_intermediate: "Intermediário Superior",
    advanced: "Avançado",
    proficient: "Proficiente",
  };

  // Mapeamento de objetivos
  const objectiveMap: Record<string, string> = {
    career: "Carreira",
    travel: "Viagens",
    studies: "Estudos",
    other: "Outro",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/admin/gemini-chat")}
              className="bg-purple-50 hover:bg-purple-100 border-purple-200"
            >
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              Gemini AI
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/support/ellie")}
              className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
            >
              <Headphones className="w-4 h-4 mr-2 text-indigo-600" />
              Ellie's Support
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/admin/notifications")}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificações
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alunos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{atRiskStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalHours}h</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Alunos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alunos</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os alunos da plataforma
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const result = await assignAllIdsMutation.mutateAsync();
                      toast.success(result.message);
                    } catch (error) {
                      toast.error("Erro ao gerar IDs");
                    }
                  }}
                  disabled={assignAllIdsMutation.isPending}
                >
                  {assignAllIdsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Hash className="w-4 h-4 mr-2" />
                  )}
                  Gerar IDs
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/admin/personalized-links")}
                >
                  Gerar Links
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/admin/upload-materials")}
                >
                  Compartilhar Materiais
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/admin/dashboard")}
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                  Estatísticas de Alunos
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const result = await exportStudentsCSVMutation.refetch();
                      if (result.data?.csv) {
                        const blob = new Blob([result.data.csv], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `alunos_ativos_${new Date().toISOString().split('T')[0]}.csv`;
                        link.click();
                        toast.success(`${result.data.count} alunos exportados com sucesso!`);
                      }
                    } catch (error) {
                      toast.error('Erro ao exportar dados de alunos ativos');
                    }
                  }}
                  disabled={exportStudentsCSVMutation.isLoading}
                >
                  {exportStudentsCSVMutation.isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar Alunos Ativos (CSV)
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const result = await exportStudentsJSONMutation.refetch();
                      if (result.data?.data) {
                        const json = JSON.stringify(result.data.data, null, 2);
                        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `alunos_ativos_${new Date().toISOString().split('T')[0]}.json`;
                        link.click();
                        toast.success(`${result.data.count} alunos exportados com sucesso!`);
                      }
                    } catch (error) {
                      toast.error('Erro ao exportar dados de alunos ativos');
                    }
                  }}
                  disabled={exportStudentsJSONMutation.isLoading}
                >
                  {exportStudentsJSONMutation.isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar Alunos Ativos (JSON)
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Barra de Busca */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabela de Alunos */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nível</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Objetivo</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Horas</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Streak</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Última Atividade</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedStudent(student as StudentData)}
                      >
                        <td className="py-3 px-4 text-sm font-mono text-xs">
                          {(student as any).studentId || <span className="text-muted-foreground">-</span>}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{student.email}</td>
                        <td className="py-3 px-4 text-sm">{levelMap[student.level] || student.level}</td>
                        <td className="py-3 px-4 text-sm">{objectiveMap[student.objective] || student.objective}</td>
                        <td className="py-3 px-4 text-sm">{student.hoursLearned}h</td>
                        <td className="py-3 px-4 text-sm">{student.streakDays}d</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{student.lastActivity}</td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              student.status === "active"
                                ? "bg-green-100 text-green-800"
                                : student.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.status === "active"
                              ? "Ativo"
                              : student.status === "inactive"
                              ? "Inativo"
                              : "Em Risco"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/admin/student/${student.id}/edit`);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/admin/student/${student.id}/analysis`);
                            }}
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                          >
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Análise
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Aluno Selecionado */}
        {selectedStudent && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedStudent.name}</CardTitle>
                  <CardDescription>{selectedStudent.email}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedStudent(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Nível</p>
                  <p className="font-semibold">{levelMap[selectedStudent.level]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Objetivo</p>
                  <p className="font-semibold">{objectiveMap[selectedStudent.objective]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horas Aprendidas</p>
                  <p className="font-semibold">{selectedStudent.hoursLearned}h</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="font-semibold">{selectedStudent.streakDays} dias</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setLocation(`/admin/student/${selectedStudent.id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil Detalhado
                </Button>
                <Button
                  onClick={() => setLocation(`/admin/student/${selectedStudent.id}/analysis`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Análise Cruzada
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
