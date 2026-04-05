import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, Bell, CheckCircle2, Clock, User, 
  ChevronRight, Megaphone, Heart, AlertTriangle, Info
} from "lucide-react";

type MessageCategory = "pedagogical" | "announcement" | "congratulation" | "alert" | "info";

interface StudentMessage {
  id: string;
  title: string;
  content: string;
  sender: string;
  senderRole: string;
  category: MessageCategory;
  date: Date;
  isRead: boolean;
  priority?: "high" | "medium" | "low";
}

const CATEGORY_CONFIG: Record<MessageCategory, { icon: typeof MessageCircle; color: string; bgColor: string; label: string }> = {
  pedagogical: { icon: User, color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30", label: "Pedagógico" },
  announcement: { icon: Megaphone, color: "text-purple-400", bgColor: "bg-purple-500/20 border-purple-500/30", label: "Comunicado" },
  congratulation: { icon: Heart, color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30", label: "Parabéns" },
  alert: { icon: AlertTriangle, color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30", label: "Atenção" },
  info: { icon: Info, color: "text-cyan-400", bgColor: "bg-cyan-500/20 border-cyan-500/30", label: "Informação" },
};

function generateDemoMessages(): StudentMessage[] {
  const now = new Date();
  return [
    {
      id: "msg-1",
      title: "Parabéns pelo seu progresso!",
      content: "Olá! Quero parabenizar você pelo excelente desempenho nas últimas semanas. Seu progresso no Book atual está acima da média da turma. Continue assim! Lembre-se de praticar os chunks diariamente para manter o ritmo. Se precisar de ajuda extra, estou à disposição.",
      sender: "Coord. Amanda Silva",
      senderRole: "Coordenação Pedagógica",
      category: "congratulation",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      isRead: false,
      priority: "medium",
    },
    {
      id: "msg-2",
      title: "Lembrete: Prova de Unidade dia 15",
      content: "Atenção! A prova de revisão das Units 1-4 será aplicada no dia 15 deste mês, às 19h. Estude os chunks, gramática e vocabulário das unidades. Recomendo revisar os exercícios do app e praticar com o tutor virtual. Boa sorte!",
      sender: "Teacher Amanda",
      senderRole: "Professora",
      category: "alert",
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      isRead: false,
      priority: "high",
    },
    {
      id: "msg-3",
      title: "Novo evento: Movie Night em Inglês",
      content: "Temos o prazer de convidar você para a nossa Movie Night! Será no dia 20 às 20h no auditório da escola. Vamos assistir um filme em inglês com legendas em inglês e depois discutir em grupo. É uma ótima oportunidade para praticar listening e speaking de forma divertida!",
      sender: "inFlux Jundiaí",
      senderRole: "Escola",
      category: "announcement",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-4",
      title: "Dica de estudo: Connected Speech",
      content: "Olá! Percebi que você pode melhorar na área de connected speech. Recomendo praticar com os vídeos do Vacation Plus, especialmente os da Emily (sotaque britânico) e do Lucas (sotaque americano). Foque em como as palavras se conectam na fala natural. O tutor virtual também pode ajudar com isso!",
      sender: "Coord. Amanda Silva",
      senderRole: "Coordenação Pedagógica",
      category: "pedagogical",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "msg-5",
      title: "Horário de aulas atualizado",
      content: "Informamos que a partir da próxima semana, as aulas de terça-feira passarão a ser das 19:30 às 21:00. As aulas de quinta-feira permanecem no mesmo horário. Qualquer dúvida, entre em contato com a secretaria.",
      sender: "inFlux Jundiaí",
      senderRole: "Secretaria",
      category: "info",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
  ];
}

interface StudentMessagesProps {
  studentName?: string;
}

export function StudentMessages({ studentName }: StudentMessagesProps) {
  const [messages, setMessages] = useState<StudentMessage[]>(() => generateDemoMessages());
  const [selectedMessage, setSelectedMessage] = useState<StudentMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);
  
  const filteredMessages = useMemo(() => {
    if (filter === "unread") return messages.filter(m => !m.isRead);
    return messages;
  }, [messages, filter]);
  
  const markAsRead = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isRead: true } : m));
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          Mensagens
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs">{unreadCount} nova{unreadCount > 1 ? "s" : ""}</Badge>
          )}
        </h2>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "border-slate-600 text-slate-400"}
          >
            Todas
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "border-slate-600 text-slate-400"}
          >
            Não lidas
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Lista de mensagens */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-1">
              {filteredMessages.length === 0 ? (
                <p className="text-sm text-slate-500 italic p-4 text-center">
                  {filter === "unread" ? "Nenhuma mensagem não lida" : "Nenhuma mensagem"}
                </p>
              ) : (
                filteredMessages.map(msg => {
                  const config = CATEGORY_CONFIG[msg.category];
                  const Icon = config.icon;
                  const isActive = selectedMessage?.id === msg.id;
                  
                  return (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        markAsRead(msg.id);
                      }}
                      className={`
                        w-full text-left p-2 sm:p-3 rounded-lg transition-all flex items-start gap-2 sm:gap-3
                        ${isActive ? "bg-slate-700/80 ring-1 ring-green-500/50" : "hover:bg-slate-700/50"}
                        ${!msg.isRead ? "bg-slate-700/30" : ""}
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs sm:text-sm font-medium truncate ${!msg.isRead ? "text-white" : "text-slate-300"}`}>
                            {msg.title}
                          </p>
                          {!msg.isRead && (
                            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{msg.sender}</p>
                        <p className="text-[10px] text-slate-600">{formatDate(msg.date)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da mensagem */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            {selectedMessage ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${CATEGORY_CONFIG[selectedMessage.category].bgColor}`}>
                    {(() => {
                      const Icon = CATEGORY_CONFIG[selectedMessage.category].icon;
                      return <Icon className={`w-5 h-5 ${CATEGORY_CONFIG[selectedMessage.category].color}`} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white">{selectedMessage.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_CONFIG[selectedMessage.category].bgColor}`}>
                        {CATEGORY_CONFIG[selectedMessage.category].label}
                      </Badge>
                      {selectedMessage.priority === "high" && (
                        <Badge className="bg-red-500/20 text-red-400 text-[10px]">Urgente</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <User className="w-3 h-3" />
                    <span>{selectedMessage.sender} • {selectedMessage.senderRole}</span>
                    <span className="ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(selectedMessage.date)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-500">Lida</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Selecione uma mensagem para ler</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
