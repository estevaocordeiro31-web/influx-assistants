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
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)', fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(6,9,15,0.7)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div className="max-w-7xl mx-auto px-4 py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#fff', margin: 0 }}>
            Dashboard Administrativo
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setLocation("/admin/gemini-chat")}
              style={{
                padding: '6px 12px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 500,
                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)',
                color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gemini AI
            </button>
            <button
              onClick={() => setLocation("/support/ellie")}
              style={{
                padding: '6px 12px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 500,
                background: 'rgba(77,168,255,0.1)', border: '1px solid rgba(77,168,255,0.15)',
                color: '#4da8ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Headphones className="w-3.5 h-3.5" />
              Ellie's Support
            </button>
            <button
              onClick={() => setLocation("/admin/notifications")}
              style={{
                padding: '6px 12px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 500,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                position: 'relative',
              }}
            >
              <Bell className="w-3.5 h-3.5" />
              <span style={{ fontSize: '0.75rem' }}>Notificacoes</span>
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>3</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px', borderRadius: 10, fontSize: '0.8rem',
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Metricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total de Alunos', value: students.length, color: '#fff' },
            { label: 'Alunos Ativos', value: activeStudents, color: '#6abf4b' },
            { label: 'Em Risco', value: atRiskStudents, color: '#ef4444' },
            { label: 'Total de Horas', value: `${totalHours}h`, color: '#4da8ff' },
          ].map((stat) => (
            <div key={stat.label} style={{
              borderRadius: 16, padding: '16px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 6px' }}>{stat.label}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color, fontFamily: "'Syne', sans-serif", margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Lista de Alunos */}
        <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 12px' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#fff', margin: '0 0 4px' }}>Alunos</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: 0 }}>
                  Visualize e gerencie todos os alunos da plataforma
                </p>
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
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            {/* Barra de Busca */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px 10px 36px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '0.875rem', outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Tabela de Alunos */}
            {isLoading ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, margin: '0 auto 12px', background: 'rgba(255,255,255,0.04)', animation: 'app-loading-pulse 2s ease-in-out infinite' }} />
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>Carregando...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <Users style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.08)', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(255,255,255,0.25)' }}>Nenhum aluno encontrado</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['ID', 'Nome', 'Email', 'Nivel', 'Objetivo', 'Horas', 'Streak', 'Status', 'Acoes'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                        onClick={() => setSelectedStudent(student as StudentData)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '10px 12px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>
                          {(student as any).studentId || '-'}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{student.name}</td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{student.email}</td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{levelMap[student.level] || student.level}</td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{objectiveMap[student.objective] || student.objective}</td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{student.hoursLearned}h</td>
                        <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{student.streakDays}d</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
                            background: student.status === 'active' ? 'rgba(106,191,75,0.1)' : student.status === 'inactive' ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.1)',
                            color: student.status === 'active' ? '#6abf4b' : student.status === 'inactive' ? 'rgba(255,255,255,0.3)' : '#ef4444',
                            border: `1px solid ${student.status === 'active' ? 'rgba(106,191,75,0.15)' : student.status === 'inactive' ? 'rgba(255,255,255,0.06)' : 'rgba(239,68,68,0.15)'}`,
                          }}>
                            {student.status === 'active' ? 'Ativo' : student.status === 'inactive' ? 'Inativo' : 'Em Risco'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setLocation(`/admin/student/${student.id}/edit`); }}
                              style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(77,168,255,0.08)', border: '1px solid rgba(77,168,255,0.12)', color: '#4da8ff', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                            >
                              <Edit style={{ width: 12, height: 12 }} /> Editar
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setLocation(`/admin/student/${student.id}/analysis`); }}
                              style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.12)', color: '#a78bfa', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                            >
                              <BarChart3 style={{ width: 12, height: 12 }} /> Analise
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Detalhes do Aluno Selecionado */}
        {selectedStudent && (
          <div style={{
            marginTop: 20, borderRadius: 20, padding: '20px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#fff', margin: '0 0 4px' }}>{selectedStudent.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: 0 }}>{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '1rem' }}>x</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Nivel', value: levelMap[selectedStudent.level] },
                { label: 'Objetivo', value: objectiveMap[selectedStudent.objective] },
                { label: 'Horas', value: `${selectedStudent.hoursLearned}h` },
                { label: 'Streak', value: `${selectedStudent.streakDays} dias` },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setLocation(`/admin/student/${selectedStudent.id}/edit`)}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  background: 'rgba(77,168,255,0.1)', border: '1px solid rgba(77,168,255,0.2)',
                  color: '#4da8ff', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Edit style={{ width: 14, height: 14 }} /> Editar Perfil
              </button>
              <button
                onClick={() => setLocation(`/admin/student/${selectedStudent.id}/analysis`)}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
                  color: '#a78bfa', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <BarChart3 style={{ width: 14, height: 14 }} /> Analise Cruzada
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
