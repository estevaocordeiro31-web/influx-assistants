import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function Chat() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header com Fluxie */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/demo")}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          {/* Avatar do Fluxie */}
          <div className="relative">
            <img 
              src="/fluxie-chat.png" 
              alt="Fluxie" 
              className="w-12 h-12 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Fluxie
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                AI Tutor
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Seu assistente pessoal de inglês
            </p>
          </div>
        </div>
      </header>

      {/* Área de mensagens */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img 
                  src="/fluxie-chat.png" 
                  alt="Fluxie" 
                  className="w-32 h-32 mb-6 drop-shadow-2xl"
                />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Hey! I'm Fluxie! 👋
                </h2>
                <p className="text-slate-400 mb-4 max-w-md">
                  Sou seu tutor pessoal de inglês. Vou te ajudar a aprender usando 
                  <span className="text-green-400 font-semibold"> chunks </span> 
                  e 
                  <span className="text-blue-400 font-semibold"> equivalências</span>!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => setInput("How do I introduce myself in a business meeting?")}
                  >
                    💼 Business English
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => setInput("What are common phrases for traveling?")}
                  >
                    ✈️ Travel English
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => setInput("Teach me everyday expressions")}
                  >
                    🗣️ Daily Conversation
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar do Fluxie para mensagens do assistente */}
                    {msg.role === "assistant" && (
                      <img 
                        src="/fluxie-chat.png" 
                        alt="Fluxie" 
                        className="w-8 h-8 rounded-full border border-green-500/50 flex-shrink-0 mt-1"
                      />
                    )}
                    
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                          : "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <Streamdown>{msg.content}</Streamdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                    
                    {/* Avatar do usuário */}
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 text-white text-sm font-bold">
                        {user?.name?.charAt(0) || "E"}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Indicador de digitação */}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <img 
                      src="/fluxie-chat.png" 
                      alt="Fluxie" 
                      className="w-8 h-8 rounded-full border border-green-500/50 flex-shrink-0 mt-1 animate-pulse"
                    />
                    <div className="bg-slate-700/80 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-600">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Input de mensagem */}
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message in English..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pr-12 h-12 rounded-xl focus:border-green-500 focus:ring-green-500/20"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12 w-12 rounded-xl shadow-lg shadow-green-500/20"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={loading}
              className="h-12 w-12 rounded-xl border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            💡 Fluxie ensina usando <span className="text-green-400">chunks</span> (combinações de palavras) e <span className="text-blue-400">equivalências</span> em português
          </p>
        </div>
      </main>
    </div>
  );
}
