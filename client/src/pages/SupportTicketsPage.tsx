import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Ticket,
  TrendingUp,
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'inProgress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
  assignedTo: string;
}

export default function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'inProgress' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const { data: ticketsData, isLoading } = trpc.elliesSupport.getTickets.useQuery({
    status: statusFilter,
    limit: 100,
  });

  const tickets = ticketsData?.tickets || [];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'inProgress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'closed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'inProgress':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'inProgress':
        return 'Em Progresso';
      case 'closed':
        return 'Fechado';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'inProgress').length;
  const closedTickets = tickets.filter((t) => t.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Tickets</h1>
              <p className="text-gray-600 mt-2">Gerenciamento de atendimentos de coordenação</p>
            </div>
            <Button
              onClick={() => setIsCreatingTicket(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Ticket
            </Button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{tickets.length}</div>
              <p className="text-xs text-gray-500 mt-2">Todos os atendimentos</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700">Abertos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{openTickets}</div>
              <p className="text-xs text-red-500 mt-2">Aguardando atendimento</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700">Em Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{inProgressTickets}</div>
              <p className="text-xs text-yellow-500 mt-2">Sendo atendidos</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700">Fechados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{closedTickets}</div>
              <p className="text-xs text-green-500 mt-2">Resolvidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Título ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos</option>
                  <option value="open">Abertos</option>
                  <option value="inProgress">Em Progresso</option>
                  <option value="closed">Fechados</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Prioridade</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Tickets */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Tickets ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Nenhum ticket encontrado com os filtros selecionados.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {getStatusIcon(ticket.status)}
                          {getStatusLabel(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Atribuído a: {ticket.assignedTo}</span>
                        <span>
                          Criado em: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {ticket.resolvedAt && (
                          <span>
                            Resolvido em: {new Date(ticket.resolvedAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="shadow-lg border-0 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <TrendingUp className="w-5 h-5" />
              Dicas de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>✓ Responda tickets de alta prioridade em até 2 horas</p>
            <p>✓ Mantenha o histórico de conversa atualizado</p>
            <p>✓ Use Ellie para sugestões de respostas automáticas</p>
            <p>✓ Feche tickets apenas após confirmação do usuário</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
