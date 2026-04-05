import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { InfluxCoinsDisplay } from "@/components/events/EventUI";
import { FOOD_CHALLENGE_SYSTEM_PROMPT } from "@/data/stpatricks/speaking";
import { CHARACTER_IMAGES, CHARACTER_INFO } from "@/data/stpatricks/chunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Utensils, Send, Loader2, CheckCircle2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  character?: "lucas" | "emily" | "aiko";
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Welcome to The Shamrock Pub! 🍀 We're Lucas, Emily, and Aiko — your hosts for tonight! Are you ready to order some traditional Irish food? What would you like to start with?",
  character: "lucas",
};

const MIN_EXCHANGES = 5;

export default function FoodChallenge() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const participantId = parseInt(localStorage.getItem("event_participant_id") ?? "0");
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();
  const sendFoodMessage = trpc.culturalEvents.foodChallengeChat.useMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const allMessages = [...messages, userMsg].map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const result = await sendFoodMessage.mutateAsync({
        messages: allMessages,
      });

      // Detect which character is speaking from content
      const replyContent = typeof result.content === 'string' ? result.content : '';
      const char: "lucas" | "emily" | "aiko" = replyContent.toLowerCase().includes('lucas') ? 'lucas' : replyContent.toLowerCase().includes('aiko') ? 'aiko' : 'emily';
      setMessages(prev => [...prev, {
        role: "assistant",
        content: replyContent,
        character: char,
      }]);
      setExchangeCount(c => c + 1);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I didn't catch that! Could you repeat? 😊",
        character: "emily",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const score = Math.min(100, Math.round((exchangeCount / MIN_EXCHANGES) * 100));
    setSaving(true);
    try {
      await saveMission.mutateAsync({
        participantId,
        missionId: "food-challenge",
        score,
        completed: true,
      });
      setCompleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
        <div className="text-5xl mb-4">🍀</div>
        <h2 className="text-2xl font-black text-white mb-2">Food Challenge Completo!</h2>
        <p className="text-gray-300 text-sm text-center mb-4">
          Você completou {exchangeCount} trocas em inglês no restaurante irlandês!
        </p>
        <InfluxCoinsDisplay points={100} label="pontos ganhos" size="lg" />
        <Button onClick={() => navigate("/events/leaderboard")} className="mt-8 w-full max-w-xs h-12 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
          Ver Ranking Final 🏆
        </Button>
        <Button onClick={() => navigate("/events/hub")} variant="outline"
          className="mt-3 w-full max-w-xs h-12 rounded-xl border-gray-600 text-gray-300">
          Voltar ao Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate("/events/hub")} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Hub
          </button>
          <div className="flex items-center gap-2">
            <Utensils size={16} className="text-green-400" />
            <span className="text-white text-sm font-bold">The Shamrock Pub 🍀</span>
          </div>
          <span className="text-xs text-gray-400">{exchangeCount}/{MIN_EXCHANGES}</span>
        </div>

        {/* Characters */}
        <div className="flex justify-center gap-3 mt-1">
          {(["lucas", "emily", "aiko"] as const).map(c => (
            <div key={c} className="flex flex-col items-center gap-0.5">
              <img src={CHARACTER_IMAGES[c]} alt={CHARACTER_INFO[c].name}
                className="w-8 h-8 rounded-full object-cover border border-gray-600" />
              <span className="text-xs text-gray-400">{CHARACTER_INFO[c].name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "assistant" && msg.character && (
              <img src={CHARACTER_IMAGES[msg.character]} alt={msg.character}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 self-end border border-gray-700" />
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm`}
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg, #2d6a4f, #40916c)", color: "white" }
                : { background: "rgba(255,255,255,0.08)", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {msg.role === "assistant" && msg.character && (
                <span className="text-xs font-bold block mb-1 opacity-70">
                  {CHARACTER_INFO[msg.character].name} {CHARACTER_INFO[msg.character].flag}
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Loader2 size={14} className="text-green-400 animate-spin" />
            </div>
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="text-gray-400">...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Complete button */}
      {exchangeCount >= MIN_EXCHANGES && (
        <div className="px-4 pt-2">
          <Button onClick={handleComplete} disabled={saving}
            className="w-full h-10 rounded-xl font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #f4a923, #e8890c)" }}>
            <CheckCircle2 size={16} className="mr-2" />
            {saving ? "Salvando..." : "Concluir Missão ✓"}
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 flex gap-2 flex-shrink-0">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Order in English... 🍺"
          className="flex-1 bg-gray-800 border-gray-600 text-white rounded-xl"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading}
          className="h-10 w-10 rounded-xl p-0 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </div>
    </div>
  );
}
