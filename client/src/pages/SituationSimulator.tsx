import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Send, Mic, MicOff, Sparkles, BookOpen, 
  RefreshCw, Target, Lightbulb, MessageCircle, Volume2,
  ChevronRight, Star, Trophy, Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { SimulationReport } from "@/components/SimulationReport";
import { AudioRecorder } from "@/components/AudioRecorder";
import { 
  SITUATIONS, 
  SITUATION_CATEGORIES, 
  getSituationsByCategory,
  getSituationsByBookLevel,
  getRandomSituation,
  type Situation 
} from "../../../shared/situations";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isNpc?: boolean;
  npcName?: string;
}

interface SimulationState {
  isActive: boolean;
  situation: Situation | null;
  currentDialogueIndex: number;
  score: number;
  chunksUsed: string[];
  feedback: string[];
  startTime: Date | null;
  endTime: Date | null;
  showReport: boolean;
}

export default function SituationSimulator() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<SimulationState>({
    isActive: false,
    situation: null,
    currentDialogueIndex: 0,
    score: 0,
    chunksUsed: [],
    feedback: [],
    startTime: null,
    endTime: null,
    showReport: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dados do aluno
  const studentData = {
    name: user?.name || "Aluno",
    currentBook: 5,
  };

  // Situações filtradas por livro do aluno
  const availableSituations = getSituationsByBookLevel(studentData.currentBook);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Iniciar simulação
  const startSimulation = (situation: Situation) => {
    setSimulation({
      isActive: true,
      situation,
      currentDialogueIndex: 0,
      score: 0,
      chunksUsed: [],
      feedback: [],
      startTime: new Date(),
      endTime: null,
      showReport: false,
    });

    // Mensagem de contexto
    const contextMessage: Message = {
      role: "system",
      content: `🎭 **${situation.title}**\n\n${situation.scenario}\n\n**Objetivos:**\n${situation.objectives.map(o => `• ${o}`).join('\n')}\n\n**Chunks úteis para esta situação:**\n${situation.keyChunks.slice(0, 3).map(c => `• "${c.chunk}" = ${c.equivalent}`).join('\n')}`,
      timestamp: new Date(),
    };

    // Primeira fala do NPC
    const npcMessage: Message = {
      role: "assistant",
      content: situation.dialogueStarters[0].npc,
      timestamp: new Date(),
      isNpc: true,
      npcName: getNpcName(situation.category),
    };

    setMessages([contextMessage, npcMessage]);
    setSelectedCategory(null);
  };

  // Nome do NPC baseado na categoria
  const getNpcName = (category: string): string => {
    const names: Record<string, string> = {
      travel: "Airport Agent",
      work: "Interviewer",
      social: "Sarah",
      daily: "Local Resident",
      emergency: "Doctor",
      shopping: "Store Clerk",
      food: "Waiter",
      health: "Pharmacist",
    };
    return names[category] || "Character";
  };

  // Processar áudio gravado
  const handleAudioReady = async (audioBlob: Blob, transcript?: string) => {
    if (!simulation.situation) return;
    
    // Usar a transcrição como texto da mensagem
    const messageText = transcript || "[Resposta em áudio]";
    setInput(messageText);
    
    // Simular envio da mensagem com o texto transcrito
    setTimeout(() => {
      handleSendMessage();
    }, 100);
    
    toast.success("🎙️ Áudio processado com sucesso!");
  };

  // Enviar resposta do usuário
  const handleSendMessage = async () => {
    if (!input.trim() || loading || !simulation.situation) return;

    const userMessage: Message = { 
      role: "user", 
      content: input, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Verificar se usou algum chunk da situação
    const usedChunks = simulation.situation.keyChunks.filter(c => 
      input.toLowerCase().includes(c.chunk.toLowerCase())
    );

    if (usedChunks.length > 0) {
      setSimulation(prev => ({
        ...prev,
        score: prev.score + (usedChunks.length * 10),
        chunksUsed: [...prev.chunksUsed, ...usedChunks.map(c => c.chunk)],
      }));
      toast.success(`🎯 Chunk usado: "${usedChunks[0].chunk}" (+10 pontos)`);
    }

    // Simular resposta do NPC
    await new Promise(resolve => setTimeout(resolve, 1500));

    const situation = simulation.situation;
    const nextIndex = simulation.currentDialogueIndex + 1;

    // Gerar resposta contextual
    let npcResponse: string;
    let feedbackMessage: string | null = null;

    if (nextIndex < situation.dialogueStarters.length) {
      // Próxima fala do diálogo
      npcResponse = situation.dialogueStarters[nextIndex].npc;
      setSimulation(prev => ({
        ...prev,
        currentDialogueIndex: nextIndex,
      }));
    } else {
      // Fim do diálogo - gerar feedback
      const totalScore = simulation.score + (usedChunks.length * 10);
      const chunksUsedCount = simulation.chunksUsed.length + usedChunks.length;
      
      npcResponse = generateFinalResponse(situation, input);
      feedbackMessage = generateFeedback(totalScore, chunksUsedCount, situation);
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: npcResponse,
      timestamp: new Date(),
      isNpc: true,
      npcName: getNpcName(situation.category),
    };
    setMessages(prev => [...prev, assistantMessage]);

    // Adicionar feedback se for fim do diálogo
    if (feedbackMessage) {
      setTimeout(() => {
        const feedbackMsg: Message = {
          role: "system",
          content: feedbackMessage!,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, feedbackMsg]);
        
        // Mostrar relatório de desempenho após 2 segundos
        setTimeout(() => {
          showPerformanceReport();
        }, 2000);
      }, 1000);
    }

    setLoading(false);
  };

  // Gerar resposta final contextual
  const generateFinalResponse = (situation: Situation, userInput: string): string => {
    const responses: Record<string, string[]> = {
      travel: [
        "Perfect! Here's your boarding pass. Your gate is B12. Have a safe flight!",
        "Excellent! Your room is ready. Here's your key card. Enjoy your stay!",
        "Great choice! I'll have that ready for you in about 15 minutes.",
      ],
      work: [
        "Thank you for your time today. We'll be in touch within the next week.",
        "Excellent presentation! The board will review your proposal and get back to you.",
        "Great points. Let's schedule a follow-up meeting to discuss the details.",
      ],
      social: [
        "It was so nice meeting you! Let's definitely grab coffee sometime.",
        "I had a great time chatting with you. Here's my number!",
        "We should totally hang out again. I'll add you on social media!",
      ],
      food: [
        "Excellent choice! I'll put that order in right away.",
        "Your food will be ready shortly. Can I get you anything else?",
        "Here's your check. Thank you for dining with us!",
      ],
      shopping: [
        "That looks great on you! Would you like me to ring that up?",
        "I'll hold this at the register for you. Take your time!",
        "Your total comes to $45.99. Cash or card?",
      ],
      health: [
        "Take this twice a day with food. You should feel better in a few days.",
        "If symptoms persist, please see a doctor. Get well soon!",
        "Here's your prescription. The pharmacy is just around the corner.",
      ],
      emergency: [
        "We'll run some tests to be sure. Try to rest and stay hydrated.",
        "The good news is it's nothing serious. Here's what you should do...",
        "I'm prescribing some medication. Follow up with your doctor next week.",
      ],
      daily: [
        "You're welcome! It's just a 5-minute walk from here. You can't miss it!",
        "No problem at all. Have a great day!",
        "Sure thing! Let me know if you need anything else.",
      ],
    };

    const categoryResponses = responses[situation.category] || responses.daily;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  // Gerar feedback final
  const generateFeedback = (score: number, chunksUsed: number, situation: Situation): string => {
    const rating = score >= 30 ? "⭐⭐⭐" : score >= 20 ? "⭐⭐" : "⭐";
    const performance = score >= 30 ? "Excelente" : score >= 20 ? "Muito bom" : "Bom";

    return `## 🎉 Simulação Concluída!\n\n**Situação:** ${situation.title}\n**Desempenho:** ${performance} ${rating}\n**Pontuação:** ${score} pontos\n**Chunks utilizados:** ${chunksUsed}\n\n### 💡 Dicas para melhorar:\n${situation.keyChunks.slice(0, 2).map(c => `• Use "${c.chunk}" quando quiser ${c.usage.toLowerCase()}`).join('\n')}\n\n### 📚 Vocabulário aprendido:\n${situation.vocabulary.slice(0, 3).map(v => `• **${v.word}** = ${v.translation}`).join('\n')}\n\n${situation.culturalTips ? `### 🌍 Dica cultural:\n${situation.culturalTips[0]}` : ''}\n\n---\n\n**Quer praticar mais?** Clique em "Nova Simulação" para tentar outra situação!`;
  };

  // Resetar simulação
  const resetSimulation = () => {
    setSimulation({
      isActive: false,
      situation: null,
      currentDialogueIndex: 0,
      score: 0,
      chunksUsed: [],
      feedback: [],
      startTime: null,
      endTime: null,
      showReport: false,
    });
    setMessages([]);
    setShowHints(false);
  };

  // Mostrar relatório de desempenho
  const showPerformanceReport = () => {
    setSimulation(prev => ({
      ...prev,
      endTime: new Date(),
      showReport: true,
    }));
  };

  // Tentar novamente a mesma simulação
  const tryAgain = () => {
    if (simulation.situation) {
      startSimulation(simulation.situation);
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Renderizar seleção de categoria
  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <img 
          src="/miss-elie-uniform-teaching.png" 
          alt="Fluxie" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-white mb-2">
          Simulador de Situações Reais
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Pratique inglês em situações do dia a dia! Escolha uma categoria 
          e converse como se estivesse realmente lá.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SITUATION_CATEGORIES.map(category => (
          <Button
            key={category.id}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-green-500/50"
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="text-3xl">{category.icon}</span>
            <span className="text-sm text-slate-300">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Quick Start */}
      <div className="text-center">
        <Button
          onClick={() => startSimulation(getRandomSituation(studentData.currentBook))}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Situação Aleatória
        </Button>
      </div>
    </div>
  );

  // Renderizar lista de situações
  const renderSituationList = () => {
    const situations = selectedCategory 
      ? getSituationsByCategory(selectedCategory as Situation['category'])
      : availableSituations;

    const categoryInfo = SITUATION_CATEGORIES.find(c => c.id === selectedCategory);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">{categoryInfo?.icon}</span>
            {categoryInfo?.label}
          </h3>
        </div>

        <div className="grid gap-3">
          {situations.map(situation => (
            <Card 
              key={situation.id}
              className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 cursor-pointer transition-all"
              onClick={() => startSimulation(situation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{situation.icon}</span>
                      <h4 className="font-semibold text-white">{situation.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          situation.difficulty === 'beginner' ? 'border-green-500 text-green-400' :
                          situation.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-400' :
                          'border-red-500 text-red-400'
                        }`}
                      >
                        {situation.difficulty === 'beginner' ? 'Iniciante' :
                         situation.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{situation.descriptionPt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <BookOpen className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        Books {situation.bookLevel.join(', ')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar simulação ativa
  const renderActiveSimulation = () => {
    const situation = simulation.situation!;

    return (
      <div className="flex flex-col h-full">
        {/* Header da simulação */}
        <div className="bg-slate-800/80 border-b border-slate-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSimulation}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>{situation.icon}</span>
                {situation.title}
              </h3>
              <p className="text-xs text-slate-400">{situation.context}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Trophy className="w-3 h-3 mr-1" />
              {simulation.score} pts
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className={showHints ? "text-yellow-400" : "text-slate-400"}
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hints panel */}
        {showHints && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-3">
            <p className="text-xs text-yellow-400 font-semibold mb-2">💡 Chunks úteis:</p>
            <div className="flex flex-wrap gap-2">
              {situation.keyChunks.map((chunk, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prev => prev + (prev ? ' ' : '') + chunk.chunk)}
                  className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded hover:bg-yellow-500/30 transition-colors"
                >
                  {chunk.chunk}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : 
                msg.role === "system" ? "justify-center" : "justify-start"
              }`}
            >
              {msg.role === "system" ? (
                <div className="max-w-lg bg-slate-700/50 border border-slate-600 rounded-xl p-4">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                </div>
              ) : msg.role === "assistant" ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {msg.npcName?.charAt(0) || "N"}
                  </div>
                  <div className="max-w-[70%]">
                    <p className="text-xs text-slate-500 mb-1">{msg.npcName}</p>
                    <div className="bg-slate-700/80 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-600">
                      <p>{msg.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(msg.content)}
                        className="mt-2 h-6 text-xs text-slate-400 hover:text-white p-0"
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Ouvir
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="max-w-[70%] bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-3 rounded-2xl rounded-br-md">
                  <p>{msg.content}</p>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="bg-slate-700/80 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-600">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Sugestões de resposta */}
          {!loading && simulation.currentDialogueIndex < situation.dialogueStarters.length && (
            <div className="flex flex-wrap gap-2 justify-end">
              {situation.dialogueStarters[simulation.currentDialogueIndex].suggestedResponses.map((response, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(response)}
                  className="text-xs bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600 max-w-[200px] text-left"
                >
                  {response.length > 50 ? response.substring(0, 50) + '...' : response}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/50">
          {/* Toggle entre texto e áudio */}
          <div className="flex justify-center gap-2 mb-3">
            <Button
              variant={inputMode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('text')}
              className={inputMode === 'text' ? 'bg-green-500 hover:bg-green-600' : 'border-slate-600'}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Digitar
            </Button>
            <Button
              variant={inputMode === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('audio')}
              className={inputMode === 'audio' ? 'bg-red-500 hover:bg-red-600' : 'border-slate-600'}
            >
              <Mic className="w-4 h-4 mr-2" />
              Gravar Voz
            </Button>
          </div>

          {inputMode === 'text' ? (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Type your response in English..."
                className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <AudioRecorder
              onAudioReady={handleAudioReady}
              disabled={loading}
              placeholder="🎙️ Pressione para gravar sua resposta em inglês"
              showTranscript={true}
            />
          )}
          <p className="text-xs text-slate-500 mt-2 text-center">
            💡 Use os chunks sugeridos para ganhar pontos extras!
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student/home")}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Simulador de Situações
              </h1>
              <p className="text-xs text-slate-400">
                Pratique inglês em cenários reais
              </p>
            </div>
          </div>

          {simulation.isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="ml-auto border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Nova Simulação
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 h-[calc(100vh-64px)]">
        <Card className="h-full bg-slate-800/50 border-slate-700 overflow-hidden">
          <CardContent className="p-0 h-full">
            {simulation.showReport && simulation.situation && simulation.startTime && simulation.endTime ? (
              <div className="p-6 overflow-y-auto h-full">
                <SimulationReport
                  situation={simulation.situation}
                  score={simulation.score}
                  chunksUsed={simulation.chunksUsed}
                  totalMessages={messages.filter(m => m.role === 'user').length}
                  startTime={simulation.startTime}
                  endTime={simulation.endTime}
                  onNewSimulation={resetSimulation}
                  onTryAgain={tryAgain}
                />
              </div>
            ) : simulation.isActive ? (
              renderActiveSimulation()
            ) : selectedCategory ? (
              <div className="p-6 overflow-y-auto h-full">
                {renderSituationList()}
              </div>
            ) : (
              <div className="p-6 overflow-y-auto h-full">
                {renderCategorySelection()}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
