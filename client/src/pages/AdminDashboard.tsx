import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, AlertCircle, LogOut, Search, Bell, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface StudentData {
  id: number;
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
  const { data: studentsData, isLoading } = trpc.adminStudents.getStudents.useQuery({
    search: searchTerm || undefined,
    limit: 50,
  });

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
              <div className="flex gap-2">
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
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nível</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Objetivo</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Horas</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Streak</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Última Atividade</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedStudent(student as StudentData)}
                      >
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
