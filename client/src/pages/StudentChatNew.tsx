/**
 * StudentChatNew — Conversational interface with animated Elie
 * Uses Tutor's chat.sendMessage + tts.speak routers.
 * Age-adaptive tone and UI.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ElieCompanion, type ElieState } from "@/components/tutor/ElieCompanion";
import { AgeAdaptiveProvider, useAgeAdaptive } from "@/contexts/AgeAdaptiveContext";
import { Streamdown } from "streamdown";
import {
  Send,
  ChevronLeft,
  Volume2,
  VolumeX,
  Loader2,
  Play,
} from "lucide-react";
import "@/styles/tutor-theme.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioUrl?: string | null;
}

function StudentChatInner() {
  const config = useAgeAdaptive();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elieState, setElieState] = useState<ElieState>("greeting");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const ttsMutation = trpc.tts.speak.useMutation();

  const studentName = localStorage.getItem("imaind_student_name") || "";
  const isDark = config.ageGroup === "teen";

  // Welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content:
        config.ageGroup === "child"
          ? `Oi${studentName ? `, ${studentName}` : ""}! 🌟 Pode me perguntar qualquer coisa sobre ingles! Estou aqui pra te ajudar! 💙`
          : config.ageGroup === "teen"
          ? `E ai${studentName ? `, ${studentName}` : ""}! Manda a duvida ai que eu te ajudo. 🔥`
          : `Ola${studentName ? `, ${studentName}` : ""}! Estou aqui para ajudar com qualquer duvida sobre seu curso, gramatica, pronuncia ou dicas de estudo.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
    setTimeout(() => setElieState("idle"), 2000);
  }, [studentName, config.ageGroup]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setElieState("thinking");

    try {
      const response = await chatMutation.mutateAsync({
        message: content.trim(),
        conversationId,
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      setElieState("talking");

      let audioUrl: string | null = null;
      if (voiceEnabled && response.message) {
        try {
          const ttsResponse = await ttsMutation.mutateAsync({
            text: response.message.slice(0, 500),
            character: "emily",
          });
          audioUrl = ttsResponse.audioUrl;
        } catch {
          // TTS failure is non-critical
        }
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        audioUrl,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Return to idle after "talking"
      setTimeout(() => setElieState("idle"), 3000);
    } catch {
      setElieState("idle");
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: config.ageGroup === "child"
            ? "Opa, tive um probleminha! Tenta de novo? 😅"
            : "Desculpa, tive um erro. Pode tentar novamente?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading, chatMutation, ttsMutation, conversationId, voiceEnabled, config.ageGroup]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Quick prompts
  const quickPrompts =
    config.ageGroup === "child"
      ? ["Me ensina uma palavra nova! 🌈", "Quero praticar! 🎮", "Ajuda com licao de casa 📖"]
      : config.ageGroup === "teen"
      ? ["Duvida de gramatica", "Quero praticar conversacao", "Me ajuda com o homework"]
      : ["Duvida sobre gramatica", "Praticar conversacao", "Dicas de estudo", "Sobre meu nivel"];

  return (
    <div
      className={`tutor-app ${isDark ? "dark" : ""}`}
      data-age={config.ageGroup}
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: isDark
          ? "linear-gradient(180deg, #0c1222 0%, #111827 100%)"
          : "var(--tutor-bg)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: "1px solid var(--tutor-border)",
          background: "var(--tutor-surface)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <button
          className="tutor-btn tutor-btn-ghost"
          style={{ padding: 6 }}
          onClick={() => navigate("/student/dashboard")}
        >
          <ChevronLeft size={20} style={{ color: "var(--tutor-text-secondary)" }} />
        </button>

        <ElieCompanion state={elieState} size="mini" />

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "var(--tutor-text-sm)", fontWeight: 600, color: "var(--tutor-text)" }}>
            Elie
          </p>
          <p style={{ fontSize: "0.6875rem", color: "var(--tutor-text-muted)" }}>
            {isLoading ? "Pensando..." : elieState === "talking" ? "Falando..." : "Online"}
          </p>
        </div>

        <button
          className="tutor-btn tutor-btn-ghost"
          style={{ padding: 6 }}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
        >
          {voiceEnabled ? (
            <Volume2 size={18} style={{ color: "var(--imaind-blue)" }} />
          ) : (
            <VolumeX size={18} style={{ color: "var(--tutor-text-muted)" }} />
          )}
        </button>
      </header>

      {/* Messages */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              gap: 8,
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{ flexShrink: 0, marginBottom: 4 }}>
                <ElieCompanion
                  state={msg.id === messages[messages.length - 1]?.id && elieState === "talking" ? "talking" : "idle"}
                  size="mini"
                />
              </div>
            )}

            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius:
                  msg.role === "user"
                    ? "var(--tutor-radius-lg) var(--tutor-radius-lg) 4px var(--tutor-radius-lg)"
                    : "var(--tutor-radius-lg) var(--tutor-radius-lg) var(--tutor-radius-lg) 4px",
                background:
                  msg.role === "user"
                    ? "var(--imaind-blue)"
                    : "var(--tutor-surface)",
                color: msg.role === "user" ? "white" : "var(--tutor-text)",
                border: msg.role === "assistant" ? "1px solid var(--tutor-border)" : "none",
                fontSize: "var(--tutor-text-sm)",
                lineHeight: 1.6,
              }}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none" style={{ fontSize: "inherit" }}>
                  <Streamdown>{msg.content}</Streamdown>
                </div>
              ) : (
                <p style={{ margin: 0 }}>{msg.content}</p>
              )}

              {/* Audio button */}
              {msg.role === "assistant" && msg.audioUrl && msg.id !== "welcome" && (
                <button
                  onClick={() => {
                    const audio = new Audio(msg.audioUrl!);
                    audio.play();
                  }}
                  style={{
                    marginTop: 8,
                    padding: "4px 8px",
                    borderRadius: "var(--tutor-radius-full)",
                    background: "rgba(26,111,219,0.08)",
                    border: "none",
                    fontSize: "0.6875rem",
                    color: "var(--imaind-blue)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Play size={12} /> Ouvir
                </button>
              )}

              <p
                style={{
                  fontSize: "0.625rem",
                  color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "var(--tutor-text-muted)",
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <ElieCompanion state="thinking" size="mini" />
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--tutor-radius-lg) var(--tutor-radius-lg) var(--tutor-radius-lg) 4px",
                background: "var(--tutor-surface)",
                border: "1px solid var(--tutor-border)",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--tutor-text-muted)",
                    animation: `elie-dots 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Quick prompts (only when no messages besides welcome) */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: "0 16px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              className="tutor-chip"
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              style={{ fontSize: "0.8125rem" }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <footer
        style={{
          padding: "12px 16px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--tutor-border)",
          background: "var(--tutor-surface)",
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          className="tutor-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            config.ageGroup === "child"
              ? "Manda sua duvida! ✨"
              : "Digite sua mensagem..."
          }
          disabled={isLoading}
          style={{ flex: 1, padding: "10px 14px" }}
        />
        <button
          className="tutor-btn tutor-btn-primary"
          onClick={() => sendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--tutor-radius-lg)",
            opacity: !inputValue.trim() || isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </footer>
    </div>
  );
}

export default function StudentChatNew() {
  const age = Number(localStorage.getItem("imaind_student_age")) || undefined;
  return (
    <AgeAdaptiveProvider age={age}>
      <StudentChatInner />
    </AgeAdaptiveProvider>
  );
}
