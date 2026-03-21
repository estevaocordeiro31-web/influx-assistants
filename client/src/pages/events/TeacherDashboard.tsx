import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Trophy, Tv, QrCode, BookOpen, Mic, HelpCircle, Wind, Music, Beer, ChevronRight, Clock, Target, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIMELINE = [
  { time: "18h30", label: "Abertura", desc: "Alunos chegam e escaneiam o QR Code. Deixe a tela de recepção projetada.", icon: "🚪", done: false },
  { time: "18h40", label: "Introdução", desc: "Abra a tela de Introdução com Lucas, Emily e Aiko. Apresente os personagens.", icon: "🎭", done: false },
  { time: "18h55", label: "Missões", desc: "Libere os alunos para as missões principais: Chunk Lesson, Quiz, Listening, Speaking, Food Challenge.", icon: "🎯", done: false },
  { time: "19h40", label: "Drinking Games", desc: "Inicie os Drinking Games! Comece com o Tongue Twister para aquecer.", icon: "🍺", done: false },
  { time: "20h10", label: "Hot Seat", desc: "Projete o Hot Seat TV na tela grande. Escolha um voluntário para começar.", icon: "🔥", done: false },
  { time: "20h40", label: "Leaderboard", desc: "Projete o Leaderboard TV. Anuncie os top 3 e entregue os prêmios.", icon: "🏆", done: false },
  { time: "21h00", label: "Encerramento", desc: "Foto em grupo, divulgue o inFlux AITutor e convide para o próximo evento.", icon: "🎉", done: false },
];

const TIPS = [
  {
    category: "🎤 Como usar o Tongue Twister",
    color: "#06b6d4",
    tips: [
      "Peça para os alunos tentarem em voz alta antes de digitar — cria mais risadas!",
      "Nível 'Insane ☠️' é para desafiar voluntários corajosos na frente do grupo.",
      "A IA avalia a tentativa escrita — incentive a escrever como pronunciou.",
      "Score abaixo de 60%? O aluno bebe (ou faz o forfait em inglês).",
    ],
  },
  {
    category: "🕵️ Como usar o Who Am I?",
    color: "#a855f7",
    tips: [
      "Lembre os alunos: só perguntas de Sim/Não em inglês! Ex: 'Are you a singer?'",
      "Incentive perguntas criativas: 'Are you still alive?' 'Are you from Brazil?'",
      "Se travar, diga 'Ask about their job first!' para guiar.",
      "Use o Hot Seat para jogar em grupo — projete na TV e um aluno fecha os olhos.",
    ],
  },
  {
    category: "🎵 Como usar o Finish the Lyrics",
    color: "#ec4899",
    tips: [
      "Categorias mais fáceis: Pop Hits e 80s Classics.",
      "Irish Songs é temático — use para criar clima de St. Patrick's!",
      "Incentive os alunos a cantarem em voz alta ao invés de só digitar.",
      "Botão 🇬🇧 'Listen with Emily' toca o trecho — use antes de responder.",
    ],
  },
  {
    category: "📺 Modo TV — Dicas de Projeção",
    color: "#f59e0b",
    tips: [
      "Leaderboard TV: atualiza automaticamente a cada 8 segundos.",
      "Hot Seat TV: o jogador fica de costas para a tela enquanto o grupo vê o personagem.",
      "Tela de Recepção: deixe projetada durante toda a chegada dos alunos.",
      "Use o celular como controle remoto — todas as telas são responsivas.",
    ],
  },
  {
    category: "🌟 Dicas Gerais de Facilitação",
    color: "#22c55e",
    tips: [
      "Fale inglês o tempo todo — use gestos e expressões faciais para se fazer entender.",
      "Celebre cada tentativa, mesmo errada: 'Great try! Almost perfect!'",
      "Crie equipes para os Drinking Games — competição em grupo é mais divertida.",
      "Tire fotos para o Instagram! Marque @influxjundiai.",
    ],
  },
];

const TV_SCREENS = [
  { label: "📺 Tela de Recepção (QR)", path: "/events/reception-tv", desc: "Deixar projetada na chegada dos alunos", color: "#22c55e" },
  { label: "🏆 Leaderboard ao Vivo", path: "/events/leaderboard-tv", desc: "Ranking em tempo real dos jogadores", color: "#f59e0b" },
  { label: "🔥 Hot Seat TV", path: "/events/hot-seat-tv", desc: "Modo grupo — personagem na tela grande", color: "#ef4444" },
  { label: "☘️ Introdução", path: "/events/intro", desc: "Lucas, Emily e Aiko contam a história", color: "#a855f7" },
];

export default function TeacherDashboard() {
  const [, navigate] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"timeline" | "tips" | "tv" | "stats">("timeline");

  const { data: leaderboard, isLoading } = trpc.culturalEvents.getLeaderboard.useQuery(
    { eventId: "stpatricks_2026", limit: 10 },
    { refetchInterval: 10000 }
  );

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen pb-10"
      style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}
    >
      <div className="max-w-2xl mx-auto px-4 pt-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(64,224,128,0.15)", border: "1px solid rgba(64,224,128,0.3)" }}
            >
              👩‍🏫
            </div>
            <div>
              <h1 className="text-white font-black text-xl">Teacher Dashboard</h1>
              <p className="text-green-400 text-xs font-semibold">St. Patrick's Night 2026 · inFlux Jundiaí</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Sexta-feira, 20 de Março · 18h30 às 22h00
          </p>
        </div>

        {/* Quick stats */}
        {leaderboard && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(64,224,128,0.08)", border: "1px solid rgba(64,224,128,0.2)" }}>
              <p className="text-2xl font-black text-green-400">{leaderboard.length}</p>
              <p className="text-white/50 text-xs">Participantes</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(244,169,35,0.08)", border: "1px solid rgba(244,169,35,0.2)" }}>
              <p className="text-2xl font-black text-yellow-400">
                {leaderboard.reduce((sum, p) => sum + (p.totalPoints ?? 0), 0)}
              </p>
              <p className="text-white/50 text-xs">Pontos Totais</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <p className="text-2xl font-black text-purple-400">
                {leaderboard.filter(p => (p.totalPoints ?? 0) > 0).length}
              </p>
              <p className="text-white/50 text-xs">Ativos</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-5 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
          {[
            { key: "timeline", label: "⏱ Roteiro" },
            { key: "tv", label: "📺 Telas TV" },
            { key: "tips", label: "💡 Dicas" },
            { key: "stats", label: "🏆 Ranking" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: activeTab === tab.key ? "rgba(64,224,128,0.2)" : "transparent",
                color: activeTab === tab.key ? "#40e080" : "rgba(255,255,255,0.4)",
                border: activeTab === tab.key ? "1px solid rgba(64,224,128,0.3)" : "1px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-3">
            <p className="text-white/40 text-xs mb-3">Toque para marcar como concluído</p>
            {TIMELINE.map((step, i) => {
              const done = completedSteps.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className="w-full text-left rounded-2xl p-4 flex items-start gap-4 transition-all active:scale-98"
                  style={{
                    background: done ? "rgba(64,224,128,0.1)" : "rgba(255,255,255,0.04)",
                    border: done ? "1px solid rgba(64,224,128,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-xs font-bold" style={{ color: done ? "#40e080" : "#f59e0b" }}>{step.time}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm">{step.label}</p>
                      {done && <CheckCircle2 size={14} className="text-green-400" />}
                    </div>
                    <p className="text-white/50 text-xs mt-1">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab: TV Screens */}
        {activeTab === "tv" && (
          <div className="space-y-3">
            <div
              className="rounded-2xl p-4 mb-4 flex items-start gap-3"
              style={{ background: "rgba(244,169,35,0.08)", border: "1px solid rgba(244,169,35,0.2)" }}
            >
              <AlertCircle size={18} className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-yellow-200/80 text-sm">
                Abra estas telas no computador conectado à TV/projetor. Todas abrem em nova aba em fullscreen.
              </p>
            </div>
            {TV_SCREENS.map((screen, i) => (
              <button
                key={i}
                onClick={() => window.open(screen.path, "_blank")}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-98"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${screen.color}33` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${screen.color}15`, border: `1px solid ${screen.color}33` }}
                >
                  <Tv size={18} style={{ color: screen.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{screen.label}</p>
                  <p className="text-white/40 text-xs">{screen.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </button>
            ))}

            {/* QR Code section */}
            <div
              className="rounded-2xl p-4 mt-4 flex flex-col items-center gap-3"
              style={{ background: "rgba(64,224,128,0.05)", border: "1px solid rgba(64,224,128,0.2)" }}
            >
              <p className="text-green-300 font-bold text-sm">📱 QR Code para os Alunos</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://influxassist-2anfqga4.manus.space/events/register")}&bgcolor=021a06&color=40e080&margin=10`}
                alt="QR Code"
                className="rounded-xl"
                style={{ width: "160px", height: "160px" }}
              />
              <p className="text-white/40 text-xs text-center">
                influxassist-2anfqga4.manus.space/events/register
              </p>
            </div>
          </div>
        )}

        {/* Tab: Tips */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            {TIPS.map((section, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${section.color}22` }}
              >
                <p className="font-bold text-sm mb-3" style={{ color: section.color }}>
                  {section.category}
                </p>
                <ul className="space-y-2">
                  {section.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-white/30 mt-0.5 shrink-0">•</span>
                      <span className="text-white/70 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Ranking */}
        {activeTab === "stats" && (
          <div>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 size={24} className="text-green-400 animate-spin" />
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      background: i === 0 ? "rgba(212,175,55,0.12)" : i === 1 ? "rgba(192,192,192,0.08)" : i === 2 ? "rgba(205,127,50,0.08)" : "rgba(255,255,255,0.04)",
                      border: i < 3 ? `1px solid ${["#d4af37", "#c0c0c0", "#cd7f32"][i]}33` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="text-xl w-8 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{p.name || "Participante"}</p>
                      <p className="text-white/40 text-xs">{(p as any).studentBook || ""}</p>
                    </div>
                    <span className="text-yellow-400 font-black text-sm">{p.totalPoints ?? 0} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-white/30 text-sm">Nenhum participante ainda.</p>
                <p className="text-white/20 text-xs mt-1">O ranking aparece assim que os alunos começarem a jogar.</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <Button
            onClick={() => navigate("/events")}
            variant="outline"
            className="w-full h-11 rounded-xl text-white/50 border-white/10"
          >
            ← Voltar para o Hub do Evento
          </Button>
        </div>
      </div>
    </div>
  );
}
