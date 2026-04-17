import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, TrendingUp, Clock } from 'lucide-react';

export function BackToSchoolDashboard() {
  const [campaignId] = useState(1);
  const statsQuery = trpc.backToSchool.getCampaignStats.useQuery({ campaignId });
  const [chartData, setChartData] = useState<any>(null);

  const stats = statsQuery.data?.stats;

  useEffect(() => {
    if (stats) {
      // Preparar dados para gráficos
      const bookData = Object.entries(stats.byBook).map(([name, count]) => ({
        name,
        alunos: count,
      }));

      const statusData = [
        { name: 'Matriculados', value: stats.byStatus.enrolled || 0 },
        { name: 'Pendentes', value: stats.byStatus.pending || 0 },
        { name: 'Completados', value: stats.byStatus.completed || 0 },
      ];

      setChartData({
        bookData,
        statusData,
      });
    }
  }, [stats]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  if (statsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton header */}
          <div className="mb-8">
            <div className="h-8 w-72 rounded-lg bg-white/5 animate-pulse mb-3" />
            <div className="h-4 w-96 rounded-md bg-white/[0.03] animate-pulse" />
          </div>
          {/* Skeleton KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse mb-4" />
                <div className="h-8 w-16 rounded-lg bg-white/[0.06] animate-pulse mb-2" />
                <div className="h-2 w-24 rounded bg-white/[0.03] animate-pulse" />
              </div>
            ))}
          </div>
          {/* Skeleton charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-5 w-40 rounded bg-white/5 animate-pulse mb-2" />
                <div className="h-3 w-56 rounded bg-white/[0.03] animate-pulse mb-6" />
                <div className="h-48 rounded-lg bg-white/[0.02] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Acompanhamento</h1>
          <p className="text-slate-400">Monitore o progresso da campanha de volta às aulas em tempo real</p>
        </div>

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total de Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalEnrolled}</div>
                <p className="text-xs text-slate-500 mt-1">Sincronizados</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Matriculados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{stats.byStatus.enrolled}</div>
                <p className="text-xs text-slate-500 mt-1">
                  {((stats.byStatus.enrolled / stats.totalEnrolled) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{stats.byStatus.pending || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Aguardando acesso</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-400">{stats.byStatus.completed || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Finalizaram</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Alunos por Book */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Alunos por Book</CardTitle>
                <CardDescription>Distribuição de alunos por nível</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.bookData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="alunos" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status de Alunos */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Status de Alunos</CardTitle>
                <CardDescription>Progresso geral da campanha</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detalhes por Book */}
        {stats && Object.keys(stats.byBook).length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Detalhes por Book</CardTitle>
              <CardDescription>Informações detalhadas de cada nível</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stats.byBook).map(([book, count]) => (
                  <div key={book} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">{book}</h3>
                    <p className="text-2xl font-bold text-indigo-400 mb-2">{count}</p>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${((count as number) / stats.totalEnrolled) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {(((count as number) / stats.totalEnrolled) * 100).toFixed(1)}% do total
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações Adicionais */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Informações da Campanha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-400">Acessos Expirados</p>
                <p className="text-2xl font-bold text-red-400">{stats?.accessExpiredCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats ? (((stats.byStatus.completed || 0) / stats.totalEnrolled) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Taxa de Acesso</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats ? (((stats.byStatus.enrolled + (stats.byStatus.pending || 0)) / stats.totalEnrolled) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Período Válido</p>
                <p className="text-sm font-semibold text-indigo-400">30 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
