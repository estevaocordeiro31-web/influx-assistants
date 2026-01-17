import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic, Sparkles, BookOpen, History, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Dados de demonstração do aluno Book 5
const DEMO_STUDENT = {
  name: "Estevão",
  level: "advanced",
  currentBook: "Book 5",
  currentUnit: "Unit 8",
  objective: "career",
  chunksLearned: 1847,
};

// Chunks de demonstração para Book 5
const DEMO_CHUNKS_BOOK5 = [
  { chunk: "I've been meaning to", equivalent: "Eu tenho querido / Eu estava querendo", context: "Expressar intenção adiada" },
  { chunk: "It goes without saying", equivalent: "É óbvio / Nem precisa dizer", context: "Enfatizar algo evidente" },
  { chunk: "As far as I'm concerned", equivalent: "Na minha opinião / Para mim", context: "Expressar opinião pessoal" },
  { chunk: "I couldn't agree more", equivalent: "Concordo plenamente", context: "Concordância enfática" },
  { chunk: "That being said", equivalent: "Dito isso / Mesmo assim", context: "Transição de ideias" },
];

// Sugestões de tópicos por objetivo
const TOPIC_SUGGESTIONS = {
  career: [
    { icon: "💼", label: "Reunião de negócios", prompt: "How do I lead a business meeting in English?" },
    { icon: "📊", label: "Apresentação", prompt: "Teach me phrases for giving a professional presentation" },
    { icon: "🤝", label: "Negociação", prompt: "What are key phrases for negotiating in English?" },
    { icon: "📧", label: "Email profissional", prompt: "Help me write professional emails in English" },
  ],
  travel: [
    { icon: "✈️", label: "Aeroporto", prompt: "What phrases do I need at the airport?" },
    { icon: "🏨", label: "Hotel", prompt: "Teach me hotel check-in vocabulary" },
    { icon: "🍽️", label: "Restaurante", prompt: "How do I order food at a restaurant?" },
    { icon: "🚕", label: "Transporte", prompt: "What phrases do I need for transportation?" },
  ],
  studies: [
    { icon: "📚", label: "Vocabulário acadêmico", prompt: "Teach me academic vocabulary" },
    { icon: "✍️", label: "Redação", prompt: "Help me improve my essay writing" },
    { icon: "🎓", label: "Entrevista", prompt: "Prepare me for a university interview" },
    { icon: "📖", label: "Leitura", prompt: "How do I improve my reading comprehension?" },
  ],
};

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDemo = location.startsWith("/demo");
  const studentData = isDemo ? DEMO_STUDENT : { 
    name: user?.name || "Aluno", 
    level: "intermediate",
    currentBook: "Book 3",
    currentUnit: "Unit 5",
    objective: "career",
    chunksLearned: 450,
  };

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Se for demo, simular resposta
    if (isDemo) {
      await simulateDemoResponse(currentInput);
      return;
    }

    try {
      const result = await sendMessageMutation.mutateAsync({
        conversationId: conversationId || undefined,
        message: currentInput,
        objective: studentData.objective,
        level: studentData.level,
      });

      setConversationId(result.conversationId);
      const assistantMessage: Message = {
        role: "assistant",
        content: result.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  // Simular resposta para modo demo
  const simulateDemoResponse = async (userInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomChunk = DEMO_CHUNKS_BOOK5[Math.floor(Math.random() * DEMO_CHUNKS_BOOK5.length)];
    
    const responses = [
      `Great question, ${studentData.name}! 🎯\n\nLet me teach you a powerful chunk for this:\n\n**CHUNK:** "${randomChunk.chunk}"\n**EQUIVALÊNCIA:** ${randomChunk.equivalent}\n**CONTEXTO:** ${randomChunk.context}\n\n**EXEMPLO:**\n> "${randomChunk.chunk} talk to you about this project."\n> "${randomChunk.equivalent} falar com você sobre este projeto."\n\nThis is a very natural expression used by native speakers. Try using it in your next conversation! 💪`,
      
      `Excellent! Let's work on that, ${studentData.name}! 📚\n\nHere's a chunk that will help you sound more natural:\n\n**CHUNK:** "${randomChunk.chunk}"\n**EQUIVALÊNCIA:** ${randomChunk.equivalent}\n\n**QUANDO USAR:**\n${randomChunk.context}\n\n**PRÁTICA:**\nTry completing this sentence:\n"${randomChunk.chunk} ____________"\n\nRemember: Chunks are the secret to fluency! Native speakers think in chunks, not individual words. 🌟`,
      
      `Perfect timing for this question! 🚀\n\nAs a Book 5 student, you're ready for more sophisticated expressions:\n\n**CHUNK:** "${randomChunk.chunk}"\n**EQUIVALÊNCIA:** ${randomChunk.equivalent}\n\n**NÍVEL:** Avançado (Book 5)\n**USO:** ${randomChunk.context}\n\n**DICA PRO:**\nThis chunk is commonly used in professional settings. It shows confidence and fluency!\n\nWant me to give you more examples or practice exercises? 📝`,
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const assistantMessage: Message = {
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleTopicClick = (prompt: string) => {
    setInput(prompt);
  };

  const suggestions = TOPIC_SUGGESTIONS[studentData.objective as keyof typeof TOPIC_SUGGESTIONS] || TOPIC_SUGGESTIONS.career;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header com Fluxie */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(isDemo ? "/demo" : "/student/dashboard")}
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
              {studentData.currentBook} • {studentData.currentUnit}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <History className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1 bg-slate-700/50 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300 font-medium">{studentData.chunksLearned}</span>
            </div>
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
                  Hey, {studentData.name}! 👋
                </h2>
                <p className="text-slate-400 mb-2 max-w-md">
                  Sou seu tutor pessoal de inglês. Vou te ajudar a aprender usando 
                  <span className="text-green-400 font-semibold"> chunks </span> 
                  e 
                  <span className="text-blue-400 font-semibold"> equivalências</span>!
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Você está no {studentData.currentBook} - {studentData.currentUnit}
                </p>
                
                {/* Sugestões de tópicos */}
                <div className="w-full max-w-lg">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
                    Sugestões para você
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((topic, idx) => (
                      <Button 
                        key={idx}
                        variant="outline" 
                        size="sm"
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white justify-start h-auto py-3 px-4"
                        onClick={() => handleTopicClick(topic.prompt)}
                      >
                        <span className="text-lg mr-2">{topic.icon}</span>
                        <span className="text-left">{topic.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chunks recentes */}
                <div className="mt-6 w-full max-w-lg">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
                    Chunks do seu nível
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {DEMO_CHUNKS_BOOK5.slice(0, 3).map((chunk, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(`Teach me how to use "${chunk.chunk}"`)}
                        className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm hover:from-green-500/20 hover:to-blue-500/20 transition-all"
                      >
                        {chunk.chunk}
                      </button>
                    ))}
                  </div>
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
                        {studentData.name.charAt(0)}
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
              onClick={() => toast.info("Gravação de áudio em breve!")}
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
