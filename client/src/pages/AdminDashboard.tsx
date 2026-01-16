import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, AlertCircle, LogOut, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface StudentData {
  id: number;
  name: string;
  email: string;
  level: string;
  objective: string;
  hoursLearned: number;
  chunksLearned: number;
  lastActivity: string;
  status: "active" | "inactive" | "at_risk";
}

const SAMPLE_STUDENTS: StudentData[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    level: "Intermediário",
    objective: "Carreira",
    hoursLearned: 24,
    chunksLearned: 18,
    lastActivity: "Hoje",
    status: "active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    level: "Iniciante",
    objective: "Viagens",
    hoursLearned: 8,
    chunksLearned: 5,
    lastActivity: "3 dias atrás",
    status: "inactive",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@example.com",
    level: "Elementar",
    objective: "Estudos",
    hoursLearned: 12,
    chunksLearned: 8,
    lastActivity: "5 dias atrás",
    status: "at_risk",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const filteredStudents = SAMPLE_STUDENTS.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudents = SAMPLE_STUDENTS.filter((s) => s.status === "active").length;
  const atRiskStudents = SAMPLE_STUDENTS.filter((s) => s.status === "at_risk").length;
  const totalHours = SAMPLE_STUDENTS.reduce((sum, s) => sum + s.hoursLearned, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {SAMPLE_STUDENTS.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alunos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{atRiskStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalHours}h</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Alunos</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os alunos da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
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

                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        selectedStudent?.id === student.id
                          ? "border-primary bg-blue-50"
                          : "border-border hover:border-primary hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {student.level}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.hoursLearned}h aprendidas
                          </p>
                        </div>
                        {student.status === "at_risk" && (
                          <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedStudent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedStudent.name}</CardTitle>
                  <CardDescription>{selectedStudent.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nível</p>
                    <p className="font-semibold text-foreground">{selectedStudent.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objetivo</p>
                    <p className="font-semibold text-foreground">{selectedStudent.objective}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Aprendidas</p>
                    <p className="font-semibold text-foreground">{selectedStudent.hoursLearned}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chunks Aprendidos</p>
                    <p className="font-semibold text-foreground">{selectedStudent.chunksLearned}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Última Atividade</p>
                    <p className="font-semibold text-foreground">{selectedStudent.lastActivity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
                      className={`font-semibold ${
                        selectedStudent.status === "active"
                          ? "text-green-600"
                          : selectedStudent.status === "inactive"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedStudent.status === "active"
                        ? "Ativo"
                        : selectedStudent.status === "inactive"
                        ? "Inativo"
                        : "Em Risco"}
                    </p>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Ver Detalhes Completos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <CardContent className="text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um aluno para ver detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
