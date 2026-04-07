import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic, MicOff, Sparkles, BookOpen, History, Zap, Square, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isAudio?: boolean;
  audioUrl?: string;
  transcription?: string;
  pronunciationScore?: number;
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

  // Estados para gravação de áudio
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  // Iniciar gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer para mostrar tempo de gravação
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Gravação iniciada! Fale em inglês...");
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      toast.error("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  // Processar áudio gravado
  const processAudio = async (audioBlob: Blob) => {
    setAudioProcessing(true);
    
    // Criar URL do áudio para reprodução
    const audioUrl = URL.createObjectURL(audioBlob);

    // Adicionar mensagem do usuário com áudio
    const userMessage: Message = {
      role: "user",
      content: "🎤 Áudio enviado para avaliação de pronúncia...",
      timestamp: new Date(),
      isAudio: true,
      audioUrl,
    };
    setMessages(prev => [...prev, userMessage]);

    // Simular processamento no modo demo
    if (isDemo) {
      await simulateAudioProcessing(audioUrl);
      return;
    }

    // TODO: Integrar com backend real para transcrição e avaliação
    try {
      // Converter blob para base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Aqui você integraria com o backend real
        // const result = await pronunciationMutation.mutateAsync({ audio: base64Audio });
        
        // Por enquanto, simular resposta
        await simulateAudioProcessing(audioUrl);
      };
    } catch (error) {
      console.error("Erro ao processar áudio:", error);
      toast.error("Erro ao processar áudio");
      setAudioProcessing(false);
    }
  };

  // Simular processamento de áudio no modo demo
  const simulateAudioProcessing = async (audioUrl: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomChunk = DEMO_CHUNKS_BOOK5[Math.floor(Math.random() * DEMO_CHUNKS_BOOK5.length)];
    const score = Math.floor(Math.random() * 30) + 70; // Score entre 70-100

    const feedbackResponses = [
      {
        transcription: "I've been meaning to call you about the project",
        feedback: `Excellent pronunciation, ${studentData.name}! 🎯\n\n**Transcrição:** "I've been meaning to call you about the project"\n\n**Score de Pronúncia:** ${score}/100 ${score >= 85 ? '⭐' : ''}\n\n**Análise:**\n- ✅ **Clareza:** Muito boa! Suas palavras estão claras.\n- ✅ **Fluência:** Bom ritmo de fala.\n- ${score >= 85 ? '✅' : '⚠️'} **Entonação:** ${score >= 85 ? 'Natural e expressiva!' : 'Pode melhorar um pouco a entonação.'}\n\n**Chunk detectado:** "${randomChunk.chunk}"\n**Equivalência:** ${randomChunk.equivalent}\n\n**Dica:** ${score >= 85 ? 'Continue praticando assim! Você está no caminho certo.' : 'Tente enfatizar mais as palavras-chave do chunk.'} 💪`,
      },
      {
        transcription: "As far as I'm concerned, this is the best option",
        feedback: `Great job on your pronunciation! 🎤\n\n**Transcrição:** "As far as I'm concerned, this is the best option"\n\n**Score de Pronúncia:** ${score}/100 ${score >= 85 ? '⭐' : ''}\n\n**Análise Detalhada:**\n| Aspecto | Avaliação |\n|---------|----------|\n| Clareza | ${score >= 80 ? 'Excelente' : 'Boa'} |\n| Fluência | ${score >= 85 ? 'Muito natural' : 'Pode melhorar'} |\n| Entonação | ${score >= 90 ? 'Perfeita!' : 'Boa'} |\n\n**Chunk identificado:** "${randomChunk.chunk}"\n\n**Próximo passo:** Tente usar este chunk em uma frase diferente! 🚀`,
      },
      {
        transcription: "It goes without saying that we need to improve",
        feedback: `Nice effort, ${studentData.name}! 🌟\n\n**Transcrição:** "It goes without saying that we need to improve"\n\n**Score de Pronúncia:** ${score}/100\n\n**O que você fez bem:**\n- Pronúncia clara das palavras principais\n- Bom uso do chunk "${randomChunk.chunk}"\n\n**Áreas para melhorar:**\n- Conecte as palavras de forma mais natural\n- Pratique a entonação descendente no final\n\n**Exercício sugerido:**\nRepita 3 vezes: "${randomChunk.chunk}"\n\nLembre-se: A prática leva à perfeição! 🎯`,
      },
    ];

    const response = feedbackResponses[Math.floor(Math.random() * feedbackResponses.length)];

    // Atualizar a mensagem do usuário com a transcrição
    setMessages(prev => {
      const updated = [...prev];
      const lastUserMsg = updated.findLastIndex(m => m.role === "user" && m.isAudio);
      if (lastUserMsg !== -1) {
        updated[lastUserMsg] = {
          ...updated[lastUserMsg],
          content: `🎤 "${response.transcription}"`,
          transcription: response.transcription,
          pronunciationScore: score,
        };
      }
      return updated;
    });

    // Adicionar resposta do Fluxie
    const assistantMessage: Message = {
      role: "assistant",
      content: response.feedback,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setAudioProcessing(false);
    toast.success(`Pronúncia avaliada: ${score}/100`);
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                        className="justify-start border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500"
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

                {/* Dica de áudio */}
                <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 max-w-lg">
                  <p className="text-sm text-purple-300">
                    <Mic className="w-4 h-4 inline mr-2" />
                    <strong>Novo!</strong> Clique no microfone para praticar sua pronúncia. 
                    O Fluxie vai avaliar e dar feedback personalizado!
                  </p>
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
                          ? msg.isAudio 
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-br-md"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                          : "bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <Streamdown>{msg.content}</Streamdown>
                        </div>
                      ) : (
                        <div>
                          {msg.isAudio && (
                            <div className="flex items-center gap-2 mb-2">
                              <Mic className="w-4 h-4" />
                              <span className="text-xs opacity-75">Áudio</span>
                              {msg.pronunciationScore && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                  Score: {msg.pronunciationScore}/100
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          {msg.audioUrl && (
                            <audio 
                              src={msg.audioUrl} 
                              controls 
                              className="mt-2 w-full h-8 opacity-75"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Avatar do usuário */}
                    {msg.role === "user" && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-sm font-bold ${
                        msg.isAudio 
                          ? "bg-gradient-to-br from-purple-500 to-pink-600"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}>
                        {studentData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Indicador de digitação */}
                {(loading || audioProcessing) && (
                  <div className="flex gap-3 justify-start">
                    <img 
                      src="/fluxie-chat.png" 
                      alt="Fluxie" 
                      className="w-8 h-8 rounded-full border border-green-500/50 flex-shrink-0 mt-1 animate-pulse"
                    />
                    <div className="bg-slate-700/80 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-md border border-slate-600">
                      <div className="flex items-center gap-2">
                        {audioProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm text-slate-400">Analisando pronúncia...</span>
                          </>
                        ) : (
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
                        )}
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
          {/* Indicador de gravação */}
          {isRecording && (
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-3 animate-pulse">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">Gravando... {formatTime(recordingTime)}</span>
              <Button
                onClick={stopRecording}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Square className="w-4 h-4 mr-1" />
                Parar
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message in English..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading || isRecording || audioProcessing}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pr-12 h-12 rounded-xl focus:border-green-500 focus:ring-green-500/20"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim() || isRecording || audioProcessing}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12 w-12 rounded-xl shadow-lg shadow-green-500/20"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={loading || audioProcessing}
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-12 w-12 rounded-xl transition-all ${
                isRecording 
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "border-slate-600 bg-slate-800 text-slate-300 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-400"
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            💡 Digite ou <span className="text-purple-400">grave áudio</span> para praticar pronúncia com feedback do Fluxie
          </p>
        </div>
      </main>
    </div>
  );
}
