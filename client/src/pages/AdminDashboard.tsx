import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, AlertCircle, LogOut, Search, Bell, Loader2, Edit, BarChart3, Sparkles, Brain, MessageSquare, Hash, RefreshCw, Download, Headphones, KeyRound, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { CreateStudentDialog } from "@/components/CreateStudentDialog";
import { ResetPasswordDialog } from "@/components/ResetPasswordDialog";
import { ReconcileUsersDialog } from "@/components/ReconcileUsersDialog";
import { Breadcrumb } from "@/components/Breadcrumb";

interface StudentData {
  id: number;
  studentId: string | null;
  name: string;
  email: string;
  level: "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced" | "proficient";
  objective: "career" | "travel" | "studies" | "other";
  hoursLearned: number;
  streakDays: number;
  lastActivity: string;
  status: string;
  createdAt: Date;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterObjective, setFilterObjective] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [resetStudent, setResetStudent] = useState<{ id: number; name: string; email: string } | null>(null);
  const [showReconcile, setShowReconcile] = useState(false);

  // Buscar alunos do banco de dados
  const { data: studentsData, isLoading, refetch } = trpc.adminStudents.getStudents.useQuery({
    search: searchTerm || undefined,
    limit: 500,
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

  // Query para estatísticas de sincronização
  const syncStatsQuery = trpc.bulkStudentSync.getSyncStatus.useQuery(undefined, {
    refetchInterval: false,
  });

  // Mutation para sincronizar todos os alunos
  const syncAllStudentsMutation = trpc.bulkStudentSync.syncAllStudents.useMutation({
    onSuccess: (result: any) => {
      const msg = result.created > 0
        ? `✅ ${result.created} novos alunos criados, ${result.updated} atualizados!`
        : `✅ Sincronização concluída: ${result.updated} alunos atualizados`;
      toast.success(msg);
      refetch();
      syncStatsQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro ao sincronizar: ${error.message}`);
    },
  });

  const students = studentsData?.students || [];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || student.level === filterLevel;
    const matchesObjective = !filterObjective || student.objective === filterObjective;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    return matchesSearch && matchesLevel && matchesObjective && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterLevel("");
    setFilterObjective("");
    setFilterStatus("");
  };

  const hasActiveFilters = filterLevel || filterObjective || filterStatus || searchTerm;

  const activeStudents = students.filter((s: StudentData) => s.status === "ativo").length;
  const atRiskStudents = students.filter((s: StudentData) => s.status === "desistente" || s.status === "trancado").length;
  const totalHours = students.reduce((sum: number, s: StudentData) => sum + s.hoursLearned, 0);

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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.name || "Admin"}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/admin', current: false },
          { label: 'Alunos', current: true },
        ]} />

        {/* Card de Status de Sincronização */}
        {syncStatsQuery.data && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-sm">
            <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-green-700 dark:text-green-300">
              <strong>Dashboard Central:</strong> {syncStatsQuery.data.centralTotal} alunos ({syncStatsQuery.data.centralAtivos} ativos)
              &nbsp;&bull;&nbsp;
              <strong>inFlux:</strong> {syncStatsQuery.data.totalStudents} usuários ({syncStatsQuery.data.linkedTotal} vinculados)
              {syncStatsQuery.data.unlinked > 0 && (
                <span className="text-amber-600 dark:text-amber-400">&nbsp;&bull;&nbsp;{syncStatsQuery.data.unlinked} sem vínculo</span>
              )}
            </span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Alunos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{activeStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">Em Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-red-600">{atRiskStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600">Total de Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{totalHours}h</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Alunos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
              <div>
                <CardTitle>Alunos</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os alunos da plataforma
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
                <CreateStudentDialog onSuccess={() => refetch()} />
                <Button
                  onClick={async () => {
                    try {
                      await assignAllIdsMutation.mutateAsync();
                      refetch();
                      toast.success('IDs de alunos gerados com sucesso!');
                    } catch (error: any) {
                      toast.error(`Erro ao gerar IDs: ${error.message}`);
                    }
                  }}
                  disabled={assignAllIdsMutation.isPending}
                  className="gap-2"
                >
                  {assignAllIdsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                  Gerar IDs
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await syncAllStudentsMutation.mutateAsync({});
                    } catch (error) {
                      toast.error("Erro ao sincronizar alunos");
                    }
                  }}
                  disabled={syncAllStudentsMutation.isPending}
                  className="bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800"
                  title={syncStatsQuery.data ? `Dashboard Central: ${syncStatsQuery.data.centralTotal} alunos (${syncStatsQuery.data.centralAtivos} ativos) | inFlux: ${syncStatsQuery.data.totalStudents} usuários` : 'Sincronizar com Dashboard Central'}
                >
                  {syncAllStudentsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sincronizar com Dashboard
                  {syncStatsQuery.data && (
                    <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                      ({syncStatsQuery.data.centralAtivos} ativos)
                    </span>
                  )}
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
                {syncStatsQuery.data && syncStatsQuery.data.unlinked > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowReconcile(true)}
                    className="bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-950 dark:hover:bg-orange-900 dark:border-orange-800 dark:text-orange-300"
                    title="Vincular usuários sem student_id ao Dashboard Central"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Reconciliar ({syncStatsQuery.data.unlinked} sem vínculo)
                  </Button>
                )}
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

            {/* Filtros Avançados */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Filtros Avançados</h3>
                {hasActiveFilters && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="text-xs"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium mb-2 block">Nível</label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="">Todos os níveis</option>
                    <option value="beginner">Iniciante</option>
                    <option value="elementary">Elementar</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="upper_intermediate">Intermediário Superior</option>
                    <option value="advanced">Avançado</option>
                    <option value="proficient">Proficiente</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Objetivo</label>
                  <select
                    value={filterObjective}
                    onChange={(e) => setFilterObjective(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="">Todos os objetivos</option>
                    <option value="career">Carreira</option>
                    <option value="travel">Viagens</option>
                    <option value="studies">Estudos</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                  >
                    <option value="">Todos os status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="desistente">Desistente</option>
                    <option value="trancado">Trancado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabela de Alunos */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Nível</th>
                      <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Objetivo</th>
                      <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Horas</th>
                      <th className="text-left py-3 px-4 font-semibold hidden xl:table-cell">Streak</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-xs">{student.studentId || "-"}</td>
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-xs hidden sm:table-cell">{student.email}</td>
                        <td className="py-3 px-4 text-xs">{levelMap[student.level] || student.level}</td>
                        <td className="py-3 px-4 text-xs hidden md:table-cell">{objectiveMap[student.objective] || student.objective}</td>
                        <td className="py-3 px-4 text-xs hidden lg:table-cell">{student.hoursLearned}h</td>
                        <td className="py-3 px-4 text-xs hidden xl:table-cell">{student.streakDays} dias</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                              student.status === "ativo"
                                ? "bg-green-100 text-green-800"
                                : student.status === "inativo"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                              className="gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setResetStudent({ id: student.id, name: student.name, email: student.email })}
                              className="gap-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                              title="Resetar senha"
                            >
                              <KeyRound className="w-4 h-4" />
                              <span className="hidden lg:inline">Senha</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={!!resetStudent}
        onOpenChange={(open) => !open && setResetStudent(null)}
        student={resetStudent}
      />

      {/* Reconcile Users Dialog */}
      <ReconcileUsersDialog
        open={showReconcile}
        onOpenChange={setShowReconcile}
        onSuccess={() => {
          syncStatsQuery.refetch();
          refetch();
        }}
      />
    </div>
  );
}
