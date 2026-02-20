import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Download, TrendingUp, Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface ReportData {
  avgResponseTime: number;
  resolutionRate: number;
  totalTickets: number;
  ticketsByPriority: { priority: string; count: number }[];
  coordinatorPerformance: { name: string; resolved: number; pending: number; avgTime: number }[];
  dailyTickets: { date: string; open: number; resolved: number }[];
}

export default function SupportReportsPage() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-02-20');
  const [coordinatorFilter, setCoordinatorFilter] = useState('all');

  // Mock data - em produção viria do backend
  const reportData: ReportData = {
    avgResponseTime: 2.5, // horas
    resolutionRate: 87, // percentual
    totalTickets: 145,
    ticketsByPriority: [
      { priority: 'Alta', count: 35 },
      { priority: 'Média', count: 65 },
      { priority: 'Baixa', count: 45 },
    ],
    coordinatorPerformance: [
      { name: 'Ellie', resolved: 52, pending: 8, avgTime: 2.1 },
      { name: 'Jennifer', resolved: 45, pending: 12, avgTime: 2.8 },
      { name: 'Admin', resolved: 28, pending: 5, avgTime: 1.9 },
    ],
    dailyTickets: [
      { date: '01/02', open: 12, resolved: 8 },
      { date: '02/02', open: 15, resolved: 10 },
      { date: '03/02', open: 18, resolved: 14 },
      { date: '04/02', open: 16, resolved: 12 },
      { date: '05/02', open: 20, resolved: 18 },
      { date: '06/02', open: 14, resolved: 16 },
      { date: '07/02', open: 10, resolved: 9 },
    ],
  };

  const COLORS = ['#ef4444', '#eab308', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios de Atendimento</h1>
              <p className="text-gray-600 mt-2">Análise de performance e métricas de coordenação</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          {/* Filtros */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">De</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Até</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Coordenador</label>
                  <select
                    value={coordinatorFilter}
                    onChange={(e) => setCoordinatorFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos</option>
                    <option value="ellie">Ellie</option>
                    <option value="jennifer">Jennifer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tempo Médio de Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{reportData.avgResponseTime}h</div>
              <p className="text-xs text-blue-500 mt-2">↓ 0.5h vs semana anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Taxa de Resolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{reportData.resolutionRate}%</div>
              <p className="text-xs text-green-500 mt-2">↑ 5% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Total de Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{reportData.totalTickets}</div>
              <p className="text-xs text-purple-500 mt-2">Período selecionado</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Coordenadores Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">3</div>
              <p className="text-xs text-orange-500 mt-2">Ellie, Jennifer, Admin</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Tickets por Dia */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Tickets por Dia</CardTitle>
              <CardDescription>Tickets abertos vs resolvidos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.dailyTickets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="open" stroke="#ef4444" name="Abertos" />
                  <Line type="monotone" dataKey="resolved" stroke="#22c55e" name="Resolvidos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Tickets por Prioridade */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Distribuição por Prioridade</CardTitle>
              <CardDescription>Tickets por nível de prioridade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.ticketsByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ priority, count }) => `${priority}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportData.ticketsByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Performance por Coordenador */}
          <Card className="shadow-lg border-0 lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance por Coordenador</CardTitle>
              <CardDescription>Tickets resolvidos, pendentes e tempo médio</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.coordinatorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolvidos" />
                  <Bar dataKey="pending" fill="#ef4444" name="Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Performance Detalhada */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Detalhes de Performance</CardTitle>
            <CardDescription>Métricas detalhadas por coordenador</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Coordenador</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Resolvidos</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pendentes</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Tempo Médio</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Taxa Resolução</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.coordinatorPerformance.map((coord) => (
                    <tr key={coord.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{coord.name}</td>
                      <td className="text-center py-3 px-4 text-green-600 font-semibold">
                        {coord.resolved}
                      </td>
                      <td className="text-center py-3 px-4 text-red-600 font-semibold">
                        {coord.pending}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600">{coord.avgTime}h</td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {Math.round((coord.resolved / (coord.resolved + coord.pending)) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="shadow-lg border-0 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <TrendingUp className="w-5 h-5" />
              Insights e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              ✓ <strong>Ellie</strong> tem melhor tempo médio de resposta (2.1h) - considere usar como modelo
            </p>
            <p>
              ✓ Taxa de resolução geral está <strong>acima de 85%</strong> - excelente performance
            </p>
            <p>
              ✓ Tickets de <strong>alta prioridade</strong> representam 24% do total - foco em automação
            </p>
            <p>
              ✓ Tendência de crescimento de tickets - considere expandir equipe ou automação
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
