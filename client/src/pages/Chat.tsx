import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function Chat() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({
        conversationId: conversationId || undefined,
        message: currentInput,
        objective: "career",
        level: "intermediate",
      });

      setConversationId(result.conversationId);
      const assistantMessage = {
        role: "assistant",
        content: result.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chat com Assistente</h1>
            <p className="text-sm text-muted-foreground">
              Aprenda usando a metodologia de Chunks e Equivalência
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        <Card className="flex-1 flex flex-col mb-4">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">Comece uma conversa!</p>
                  <p className="text-sm">
                    O assistente usará a metodologia de Chunks para ensinar
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Streamdown>{msg.content}</Streamdown>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem em inglês..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={loading}>
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Dica: O assistente fornecerá feedback sobre chunks (combinações de palavras) e equivalências em português
          </p>
        </div>
      </main>
    </div>
  );
}
