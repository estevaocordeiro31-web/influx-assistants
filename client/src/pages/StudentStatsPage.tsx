import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp, Users, BookOpen, Target } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatsData {
  totalActive: number;
  byLevel: Array<{ level: string; count: number }>;
  byBook: Array<{ bookName: string; count: number }>;
  totalHoursLearned: number;
}

export default function StudentStatsPage() {
  const [, setLocation] = useLocation();

  // Buscar estatísticas de alunos ativos
  const { data: statsData, isLoading, error } = trpc.adminExport.getActiveStudentsStats.useQuery();

  const stats: StatsData | null = statsData?.stats || null;

  // Mapear níveis para português
  const levelMap: Record<string, string> = {
    beginner: "Iniciante",
    elementary: "Elementar",
    intermediate: "Intermediário",
    upper_intermediate: "Intermediário Superior",
    advanced: "Avançado",
    proficient: "Proficiente",
  };

  // Cores para gráficos
  const colors = [
    "#ff6384",
    "#36a2eb",
    "#ffce56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
  ];

  // Preparar dados para gráfico de níveis
  const levelChartData = stats?.byLevel.map((item, index) => ({
    name: levelMap[item.level] || item.level,
    value: item.count,
    fill: colors[index % colors.length],
  })) || [];

  // Preparar dados para gráfico de livros
  const bookChartData = stats?.byBook.map((item, index) => ({
    name: item.bookName,
    value: item.count,
    fill: colors[index % colors.length],
  })) || [];

  // Preparar dados para gráfico de horas
  const hoursChartData = stats?.byLevel.map((item) => {
    const avgHours = Math.round((stats.totalHoursLearned / stats.totalActive) * (item.count / stats.totalActive) * 100) / 100;
    return {
      name: levelMap[item.level] || item.level,
      horas: avgHours,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 rounded-lg bg-white/5 animate-pulse mb-3" />
          <div className="h-4 w-80 rounded-md bg-white/[0.03] animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-3 w-24 rounded bg-white/5 animate-pulse mb-3" />
                <div className="h-8 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-5 w-36 rounded bg-white/5 animate-pulse mb-6" />
                <div className="h-48 rounded-lg bg-white/[0.02] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar estatísticas</p>
          <Button onClick={() => setLocation("/admin")}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Estatísticas de Alunos</h1>
          <Button variant="outline" onClick={() => setLocation("/admin")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cartões de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total de Alunos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalActive}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Livros Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.byBook.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Níveis Representados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.byLevel.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total de Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalHoursLearned.toLocaleString()}h</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Níveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Distribuição por Nível
              </CardTitle>
              <CardDescription>Quantidade de alunos em cada nível</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={levelChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Livros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribuição por Livro
              </CardTitle>
              <CardDescription>Proporção de alunos por livro</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={bookChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Horas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Horas de Aprendizado
            </CardTitle>
            <CardDescription>Horas médias de aprendizado por nível</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hoursChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                <Legend />
                <Line type="monotone" dataKey="horas" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabelas de Detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tabela de Níveis */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Nível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold text-foreground">Nível</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">Alunos</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byLevel.map((item) => (
                      <tr key={item.level} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2 px-2 text-muted-foreground">{levelMap[item.level] || item.level}</td>
                        <td className="text-right py-2 px-2 font-semibold text-foreground">{item.count}</td>
                        <td className="text-right py-2 px-2 text-muted-foreground">
                          {((item.count / stats.totalActive) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Livros */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Livro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold text-foreground">Livro</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">Alunos</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byBook.map((item) => (
                      <tr key={item.bookName} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2 px-2 text-muted-foreground">{item.bookName}</td>
                        <td className="text-right py-2 px-2 font-semibold text-foreground">{item.count}</td>
                        <td className="text-right py-2 px-2 text-muted-foreground">
                          {((item.count / stats.totalActive) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
