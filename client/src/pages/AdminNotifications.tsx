import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Trophy, 
  BookOpen, 
  Flame,
  UserX,
  ArrowLeft,
  Filter,
  CheckCheck
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type AlertType = 
  | "milestone_reached"
  | "struggling_chunk"
  | "inactive_student"
  | "book_completed"
  | "streak_milestone";

interface Alert {
  id: string;
  type: AlertType;
  studentId: number;
  studentName: string;
  message: string;
  details: string;
  severity: "info" | "warning" | "success";
  createdAt: Date;
  read: boolean;
}

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case "milestone_reached":
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case "struggling_chunk":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "inactive_student":
      return <UserX className="w-5 h-5 text-red-500" />;
    case "book_completed":
      return <BookOpen className="w-5 h-5 text-green-500" />;
    case "streak_milestone":
      return <Flame className="w-5 h-5 text-orange-400" />;
    default:
      return <Bell className="w-5 h-5 text-blue-500" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "warning":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "success":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;
  } else if (diffHours > 0) {
    return `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
  } else {
    return "Agora mesmo";
  }
};

// Dados de demonstração
const demoAlerts: Alert[] = [
  {
    id: "1",
    type: "book_completed",
    studentId: 1,
    studentName: "João Silva",
    message: "João Silva completou o Book 3!",
    details: "O aluno concluiu todas as 12 units do Book 3 - Intermediário com média de 87% nos exercícios.",
    severity: "success",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "struggling_chunk",
    studentId: 2,
    studentName: "Maria Santos",
    message: "Maria Santos com dificuldade em Present Perfect",
    details: "A aluna errou o chunk 'have been' 5 vezes consecutivas nos últimos exercícios. Recomenda-se revisão adicional.",
    severity: "warning",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "streak_milestone",
    studentId: 3,
    studentName: "Pedro Costa",
    message: "Pedro Costa atingiu 30 dias de sequência!",
    details: "O aluno está estudando consistentemente há 30 dias seguidos. Média de 45 minutos por dia.",
    severity: "success",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    type: "inactive_student",
    studentId: 4,
    studentName: "Ana Oliveira",
    message: "Ana Oliveira inativa há 7 dias",
    details: "A aluna não acessa a plataforma há uma semana. Último acesso: Unit 5 do Book 2.",
    severity: "warning",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "5",
    type: "milestone_reached",
    studentId: 5,
    studentName: "Carlos Mendes",
    message: "Carlos Mendes dominou 500 chunks!",
    details: "O aluno atingiu a marca de 500 chunks dominados com taxa de acerto acima de 80%.",
    severity: "success",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

export default function AdminNotifications() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "unread" | "warnings" | "success">("all");
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.read;
    if (filter === "warnings") return alert.severity === "warning";
    if (filter === "success") return alert.severity === "success";
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const warningsCount = alerts.filter(a => a.severity === "warning").length;

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
    toast.success("Alerta marcado como lido");
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    toast.success("Todos os alertas marcados como lidos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-400" />
                Central de Notificações
              </h1>
              <p className="text-sm text-slate-400">
                Acompanhe o progresso e alertas dos alunos
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todos como lidos
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total de Alertas</p>
                  <p className="text-2xl font-bold text-white">{alerts.length}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Não Lidos</p>
                  <p className="text-2xl font-bold text-yellow-400">{unreadCount}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Atenção Necessária</p>
                  <p className="text-2xl font-bold text-orange-400">{warningsCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Conquistas</p>
                  <p className="text-2xl font-bold text-green-400">
                    {alerts.filter(a => a.severity === "success").length}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600" : "border-slate-600 text-slate-300"}
          >
            Todos
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-yellow-600" : "border-slate-600 text-slate-300"}
          >
            Não Lidos ({unreadCount})
          </Button>
          <Button
            variant={filter === "warnings" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("warnings")}
            className={filter === "warnings" ? "bg-orange-600" : "border-slate-600 text-slate-300"}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Atenção
          </Button>
          <Button
            variant={filter === "success" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("success")}
            className={filter === "success" ? "bg-green-600" : "border-slate-600 text-slate-300"}
          >
            <Trophy className="w-4 h-4 mr-1" />
            Conquistas
          </Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum alerta encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`bg-slate-800/50 border-slate-700 transition-all ${
                  !alert.read ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{alert.message}</h3>
                        {!alert.read && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                            Novo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{alert.details}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{formatTimeAgo(alert.createdAt)}</span>
                        <span>•</span>
                        <span>Aluno: {alert.studentName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!alert.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/student/${alert.studentId}`)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Ver Aluno
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
