import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, BookOpen, 
  GraduationCap, Bell, Star, Users, MapPin, MessageCircle
} from "lucide-react";

// Tipos de eventos
type EventType = "class" | "exam" | "deadline" | "event" | "holiday" | "meeting" | "message";

interface CalendarEvent {
  id: string;
  title: string;
  titlePt?: string;
  date: Date;
  time?: string;
  endTime?: string;
  type: EventType;
  description?: string;
  location?: string;
  instructor?: string;
  priority?: "high" | "medium" | "low";
  isRecurring?: boolean;
}

// Configuração visual por tipo de evento
const EVENT_CONFIG: Record<EventType, { icon: typeof Calendar; color: string; bgColor: string; label: string }> = {
  class: { icon: BookOpen, color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30", label: "Aula" },
  exam: { icon: GraduationCap, color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/30", label: "Prova" },
  deadline: { icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30", label: "Prazo" },
  event: { icon: Star, color: "text-purple-400", bgColor: "bg-purple-500/20 border-purple-500/30", label: "Evento" },
  holiday: { icon: Calendar, color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30", label: "Feriado" },
  meeting: { icon: Users, color: "text-cyan-400", bgColor: "bg-cyan-500/20 border-cyan-500/30", label: "Reunião" },
  message: { icon: MessageCircle, color: "text-orange-400", bgColor: "bg-orange-500/20 border-orange-500/30", label: "Mensagem" },
};

// Dados de demonstração - eventos do aluno
function generateDemoEvents(): CalendarEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const events: CalendarEvent[] = [];
  
  // Aulas regulares (Terça e Quinta)
  for (let day = 1; day <= 28; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    
    if (dow === 2) { // Terça
      events.push({
        id: `class-tue-${day}`,
        title: "English Class - Conversation",
        titlePt: "Aula de Inglês - Conversação",
        date,
        time: "19:00",
        endTime: "20:30",
        type: "class",
        location: "Sala 3 - inFlux Jundiaí",
        instructor: "Teacher Amanda",
        isRecurring: true,
      });
    }
    if (dow === 4) { // Quinta
      events.push({
        id: `class-thu-${day}`,
        title: "English Class - Grammar & Practice",
        titlePt: "Aula de Inglês - Gramática & Prática",
        date,
        time: "19:00",
        endTime: "20:30",
        type: "class",
        location: "Sala 3 - inFlux Jundiaí",
        instructor: "Teacher Amanda",
        isRecurring: true,
      });
    }
  }
  
  // Eventos especiais
  events.push(
    {
      id: "exam-1",
      title: "Unit Test - Book Review",
      titlePt: "Prova de Unidade - Revisão do Book",
      date: new Date(year, month, 15),
      time: "19:00",
      type: "exam",
      description: "Prova cobrindo Units 1-4 do Book atual",
      location: "Sala 1 - inFlux Jundiaí",
      priority: "high",
    },
    {
      id: "event-1",
      title: "English Movie Night",
      titlePt: "Noite do Cinema em Inglês",
      date: new Date(year, month, 20),
      time: "20:00",
      endTime: "22:00",
      type: "event",
      description: "Sessão de cinema com filme em inglês e discussão",
      location: "Auditório - inFlux Jundiaí",
      priority: "medium",
    },
    {
      id: "deadline-1",
      title: "Homework Submission",
      titlePt: "Entrega de Homework",
      date: new Date(year, month, 12),
      time: "23:59",
      type: "deadline",
      description: "Entregar exercícios das Units 3-4",
      priority: "high",
    },
    {
      id: "meeting-1",
      title: "Parent-Teacher Meeting",
      titlePt: "Reunião Pedagógica",
      date: new Date(year, month, 25),
      time: "18:00",
      endTime: "19:00",
      type: "meeting",
      description: "Reunião com coordenação pedagógica sobre progresso",
      location: "Sala de Reuniões",
      priority: "medium",
    },
    {
      id: "event-2",
      title: "inFlux Conversation Club",
      titlePt: "Clube de Conversação inFlux",
      date: new Date(year, month, 22),
      time: "10:00",
      endTime: "11:30",
      type: "event",
      description: "Prática de conversação livre com nativos",
      location: "Online - Zoom",
    },
    {
      id: "holiday-1",
      title: "Carnival Holiday",
      titlePt: "Feriado de Carnaval",
      date: new Date(year, 1, 17),
      type: "holiday",
      description: "Sem aulas - Feriado de Carnaval",
    },
    {
      id: "message-1",
      title: "Pedagogical Update",
      titlePt: "Atualização Pedagógica",
      date: new Date(year, month, 8),
      type: "message",
      description: "Parabéns pelo progresso! Continue assim!",
      priority: "low",
    }
  );
  
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface StudentCalendarProps {
  studentName?: string;
}

export function StudentCalendar({ studentName }: StudentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  
  const events = useMemo(() => generateDemoEvents(), []);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Gerar dias do mês
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Eventos do dia selecionado
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(e => 
      e.date.getDate() === selectedDate.getDate() &&
      e.date.getMonth() === selectedDate.getMonth() &&
      e.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, events]);
  
  // Próximos eventos (próximos 7 dias)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events.filter(e => e.date >= now && e.date <= weekLater).slice(0, 5);
  }, [events]);
  
  // Verificar se um dia tem eventos
  const getEventsForDay = (day: number) => {
    return events.filter(e => 
      e.date.getDate() === day &&
      e.date.getMonth() === currentMonth &&
      e.date.getFullYear() === currentYear
    );
  };
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };
  
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Minha Agenda
        </h2>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode("month")}
            className={viewMode === "month" ? "bg-green-500/20 border-green-500/50 text-green-400" : "border-slate-600 text-slate-400"}
          >
            Mês
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode("week")}
            className={viewMode === "week" ? "bg-green-500/20 border-green-500/50 text-green-400" : "border-slate-600 text-slate-400"}
          >
            Semana
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Calendário */}
        <Card className="md:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-base sm:text-lg text-white">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map(day => (
                <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-slate-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grid do calendário */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espaços vazios antes do primeiro dia */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-14" />
              ))}
              
              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const today = isToday(day);
                const selected = isSelected(day);
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={`
                      h-10 sm:h-14 rounded-lg flex flex-col items-center justify-start pt-1 relative transition-all
                      ${today ? "bg-green-500/30 border border-green-400/50" : ""}
                      ${selected ? "bg-green-500/20 ring-2 ring-green-400" : ""}
                      ${!today && !selected ? "hover:bg-slate-700/50" : ""}
                    `}
                  >
                    <span className={`text-xs sm:text-sm font-medium ${today ? "text-green-400" : "text-slate-300"}`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((event, idx) => {
                          const config = EVENT_CONFIG[event.type];
                          return (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Legenda */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-700">
              {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")}`} />
                  <span className="text-[10px] sm:text-xs text-slate-500">{config.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Painel lateral - Eventos do dia */}
        <div className="space-y-4">
          {/* Eventos do dia selecionado */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-sm sm:text-base text-white">
                {selectedDate ? (
                  <>
                    {selectedDate.getDate()} de {MONTH_NAMES[selectedDate.getMonth()]}
                  </>
                ) : "Selecione um dia"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              {selectedDayEvents.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500 italic">Nenhum evento neste dia</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(event => {
                    const config = EVENT_CONFIG[event.type];
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className={`p-2 sm:p-3 rounded-lg border ${config.bgColor}`}>
                        <div className="flex items-start gap-2">
                          <Icon className={`w-4 h-4 mt-0.5 ${config.color} shrink-0`} />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">
                              {event.titlePt || event.title}
                            </p>
                            {event.time && (
                              <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {event.time}{event.endTime ? ` - ${event.endTime}` : ""}
                              </p>
                            )}
                            {event.location && (
                              <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </p>
                            )}
                            {event.description && (
                              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">{event.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximos eventos */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-400" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              {upcomingEvents.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500 italic">Nenhum evento nos próximos 7 dias</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map(event => {
                    const config = EVENT_CONFIG[event.type];
                    const Icon = config.icon;
                    const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50">
                        <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">
                            {event.titlePt || event.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {event.time || "Dia todo"}
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${
                          daysUntil <= 1 ? "border-red-500/50 text-red-400" : 
                          daysUntil <= 3 ? "border-yellow-500/50 text-yellow-400" : 
                          "border-slate-600 text-slate-400"
                        }`}>
                          {daysUntil === 0 ? "Hoje" : daysUntil === 1 ? "Amanhã" : `${daysUntil}d`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
