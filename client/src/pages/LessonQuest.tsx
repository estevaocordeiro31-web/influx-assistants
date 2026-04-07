import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Music, 
  BookOpen, 
  Mic, 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle,
  Volume2,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Target
} from "lucide-react";
import { Link, useParams } from "wouter";

// Dados das lessons
const lessonsData = [
  {
    id: 1,
    title: "Friends and Acquaintances",
    unit: "Unit 1",
    theme: "Making Friends",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    chunks: [
      { expression: "get along with", meaning: "dar-se bem com", example: "I get along with my coworkers." },
      { expression: "look up to", meaning: "admirar", example: "I look up to my parents." },
      { expression: "count on", meaning: "contar com", example: "You can always count on me." },
      { expression: "run into", meaning: "encontrar por acaso", example: "I ran into an old friend." },
      { expression: "hang out with", meaning: "passar tempo com", example: "Let's hang out with friends." },
      { expression: "get to know", meaning: "conhecer melhor", example: "I want to get to know you." },
      { expression: "keep in touch", meaning: "manter contato", example: "Let's keep in touch!" },
      { expression: "fall out with", meaning: "brigar com", example: "I fell out with my brother." },
      { expression: "make up with", meaning: "fazer as pazes", example: "We made up after the fight." },
      { expression: "look down on", meaning: "desprezar", example: "Don't look down on others." },
      { expression: "put up with", meaning: "tolerar", example: "I can't put up with this noise." },
      { expression: "grow apart", meaning: "afastar-se", example: "We grew apart over the years." },
      { expression: "stick together", meaning: "permanecer unidos", example: "Friends stick together." }
    ],
    songTitle: "Making Friends",
    songStyle: "Pop/Indie"
  },
  {
    id: 2,
    title: "Friends and Acquaintances",
    unit: "Unit 1",
    theme: "Friends Forever",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    chunks: [],
    songTitle: "Friends Forever",
    songStyle: "Lo-fi/Chill"
  },
  {
    id: 3,
    title: "Family and Relationship",
    unit: "Unit 1",
    theme: "Family Ties",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    chunks: [
      { expression: "look after", meaning: "cuidar de", example: "She looks after her grandmother." },
      { expression: "bring up", meaning: "criar, educar", example: "My parents brought me up well." },
      { expression: "take after", meaning: "puxar a", example: "I take after my father." },
      { expression: "get on with", meaning: "dar-se bem com", example: "I get on with my siblings." },
      { expression: "look like", meaning: "parecer-se com", example: "You look like your mom." },
      { expression: "grow up", meaning: "crescer", example: "I grew up in Brazil." },
      { expression: "settle down", meaning: "estabelecer-se", example: "He wants to settle down." },
      { expression: "pass away", meaning: "falecer", example: "My grandfather passed away." },
      { expression: "belong to", meaning: "pertencer a", example: "This belongs to my family." },
      { expression: "faithful to", meaning: "fiel a", example: "Be faithful to your values." },
      { expression: "prejudiced against", meaning: "preconceituoso contra", example: "Don't be prejudiced against anyone." },
      { expression: "stare at", meaning: "olhar fixamente", example: "Don't stare at people." }
    ],
    songTitle: "Family Ties",
    songStyle: "Acoustic Pop"
  },
  {
    id: 4,
    title: "Family and Relationship",
    unit: "Unit 1",
    theme: "Generations",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    chunks: [
      { expression: "faithful to", meaning: "fiel a", example: "Be faithful to your family." },
      { expression: "unfaithful to", meaning: "infiel a", example: "He was unfaithful to his wife." }
    ],
    songTitle: "Generations",
    songStyle: "R&B/Soul"
  },
  {
    id: 5,
    title: "Shapes and Colors",
    unit: "Unit 2",
    theme: "Colors of My Day",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    chunks: [
      { expression: "straighten up", meaning: "arrumar, organizar", example: "Straighten up your room!" },
      { expression: "cross out", meaning: "riscar, eliminar", example: "Cross out the wrong answers." },
      { expression: "jot down", meaning: "anotar rapidamente", example: "Let me jot down your number." },
      { expression: "draw the line", meaning: "estabelecer limite", example: "I draw the line at lying." },
      { expression: "draw attention to", meaning: "chamar atenção para", example: "This draws attention to the issue." },
      { expression: "draw near", meaning: "aproximar-se", example: "Winter is drawing near." },
      { expression: "go around in circles", meaning: "ficar dando voltas", example: "Stop going around in circles!" },
      { expression: "be yellow", meaning: "ser covarde", example: "Don't be yellow, face it!" },
      { expression: "be green with envy", meaning: "morrer de inveja", example: "She was green with envy." },
      { expression: "out of the blue", meaning: "do nada", example: "He called out of the blue." },
      { expression: "inside out", meaning: "do avesso", example: "Your shirt is inside out." },
      { expression: "back to front", meaning: "de trás pra frente", example: "You're wearing it back to front." },
      { expression: "upside down", meaning: "de ponta cabeça", example: "The picture is upside down." },
      { expression: "right side up", meaning: "do lado certo", example: "Turn it right side up." },
      { expression: "red tape", meaning: "burocracia", example: "There's too much red tape." }
    ],
    songTitle: "Colors of My Day",
    songStyle: "Pop/Hip-hop"
  },
  {
    id: 6,
    title: "Shapes and Colors",
    unit: "Unit 2",
    theme: "Black and White",
    color: "from-slate-500 to-zinc-500",
    bgColor: "bg-slate-500/10",
    chunks: [
      { expression: "black eye", meaning: "olho roxo", example: "He got a black eye from the fight." },
      { expression: "in black and white", meaning: "por escrito", example: "I need it in black and white." },
      { expression: "in the red", meaning: "no vermelho", example: "The company is in the red." },
      { expression: "white lie", meaning: "mentira piedosa", example: "It was just a white lie." },
      { expression: "gray area", meaning: "zona indefinida", example: "This is a gray area." },
      { expression: "red carpet", meaning: "tapete vermelho", example: "They rolled out the red carpet." },
      { expression: "in the black", meaning: "no azul (lucro)", example: "We're finally in the black." },
      { expression: "red with anger", meaning: "vermelho de raiva", example: "He was red with anger." },
      { expression: "white as a sheet", meaning: "branco de susto", example: "She turned white as a sheet." },
      { expression: "a shade of", meaning: "um tom de", example: "It's a shade of blue." },
      { expression: "hue", meaning: "cor, matiz", example: "Every hue of the rainbow." },
      { expression: "lone wolf", meaning: "lobo solitário", example: "He's a lone wolf." }
    ],
    songTitle: "Black and White",
    songStyle: "Indie/Alternative"
  }
];

// Componente de Quiz
function QuizSection({ lesson, onComplete }: { lesson: typeof lessonsData[0], onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const chunks = lesson.chunks;
  if (chunks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Esta é uma lição comunicativa. Pratique as expressões da lição anterior!</p>
      </div>
    );
  }

  // Gerar questões dinamicamente
  const questions = chunks.slice(0, 5).map((chunk, idx) => {
    const wrongAnswers = chunks
      .filter((_, i) => i !== idx)
      .slice(0, 3)
      .map(c => c.meaning);
    
    const options = [chunk.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(chunk.meaning);
    
    return {
      question: `O que significa "${chunk.expression}"?`,
      options,
      correctAnswer: correctIndex,
      chunk: chunk.expression
    };
  });

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 20);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        onComplete(score + (correct ? 20 : 0));
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="text-center py-8">
        <div className={`text-6xl mb-4 ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
          {score >= 80 ? '🏆' : score >= 60 ? '⭐' : '💪'}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {score >= 80 ? 'Excelente!' : score >= 60 ? 'Muito bem!' : 'Continue praticando!'}
        </h3>
        <p className="text-3xl font-bold text-green-400 mb-4">{score} pontos</p>
        <Button onClick={() => {
          setCurrentQuestion(0);
          setScore(0);
          setShowResult(false);
          setSelectedAnswer(null);
          setIsCorrect(null);
        }} className="bg-green-500 hover:bg-green-600">
          <RotateCcw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Questão {currentQuestion + 1} de {questions.length}</span>
        <Badge className="bg-green-500/20 text-green-400">
          <Zap className="w-3 h-3 mr-1" />
          {score} pts
        </Badge>
      </div>
      
      <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="grid gap-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                className={`w-full justify-start p-4 h-auto text-left transition-all ${
                  selectedAnswer === idx
                    ? isCorrect
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : selectedAnswer !== null && idx === questions[currentQuestion].correctAnswer
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'hover:bg-slate-700/50'
                }`}
                onClick={() => selectedAnswer === null && handleAnswer(idx)}
                disabled={selectedAnswer !== null}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + idx)}.</span>
                {option}
                {selectedAnswer === idx && (
                  isCorrect 
                    ? <CheckCircle2 className="w-5 h-5 ml-auto text-green-400" />
                    : <XCircle className="w-5 h-5 ml-auto text-red-400" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Chunks
function ChunksSection({ lesson }: { lesson: typeof lessonsData[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const chunks = lesson.chunks;
  if (chunks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Esta é uma lição comunicativa. Revise os chunks da lição anterior!</p>
      </div>
    );
  }

  const currentChunk = chunks[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Chunk {currentIndex + 1} de {chunks.length}</span>
        <Badge className="bg-blue-500/20 text-blue-400">
          <BookOpen className="w-3 h-3 mr-1" />
          Flashcards
        </Badge>
      </div>

      <div 
        className={`relative h-64 cursor-pointer perspective-1000`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <Card className={`absolute inset-0 bg-gradient-to-br ${lesson.color} border-0 backface-hidden ${flipped ? 'invisible' : ''}`}>
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <h3 className="text-3xl font-bold text-white mb-2">{currentChunk.expression}</h3>
              <p className="text-white/60 text-sm">Clique para ver o significado</p>
            </CardContent>
          </Card>
          
          {/* Back */}
          <Card className={`absolute inset-0 bg-slate-800 border-slate-700 backface-hidden rotate-y-180 ${!flipped ? 'invisible' : ''}`}>
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-2xl font-semibold text-green-400 mb-4">{currentChunk.meaning}</p>
              <p className="text-slate-300 italic">"{currentChunk.example}"</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setFlipped(false);
            setCurrentIndex(Math.max(0, currentIndex - 1));
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFlipped(false);
            setCurrentIndex(Math.min(chunks.length - 1, currentIndex + 1));
          }}
          disabled={currentIndex === chunks.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente de Música
function MusicSection({ lesson }: { lesson: typeof lessonsData[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // URLs do CDN para os áudios das músicas
  const songUrls: Record<number, string> = {
    1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/iAQUYHOMNQLklfvE.wav',
    2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/IXeqGvmkgOlfxzEi.wav',
    3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/SYftIcCQRwyHfLtx.wav',
    4: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/zyPlWxotqDlcCQSv.wav',
    5: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/wtstBfpJkJNxHQym.wav',
    6: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/NciTVJqqVmUbvxws.wav'
  };
  const songPath = songUrls[lesson.id] || '';

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${lesson.color} flex items-center justify-center`}>
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{lesson.songTitle}</h3>
              <p className="text-slate-400">{lesson.songStyle}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className={`bg-gradient-to-r ${lesson.color}`}
              onClick={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause();
                  } else {
                    audioRef.current.play();
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
            >
              {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isPlaying ? 'Pausar' : 'Ouvir Música'}
            </Button>
          </div>

          <audio
            ref={audioRef}
            src={songPath}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Chunks na música:</h4>
            <div className="flex flex-wrap gap-2">
              {lesson.chunks.slice(0, 8).map((chunk, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {chunk.expression}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Gravação
function RecordSection({ lesson }: { lesson: typeof lessonsData[0] }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const chunks = lesson.chunks;
  if (chunks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Esta é uma lição comunicativa. Pratique a pronúncia dos chunks anteriores!</p>
      </div>
    );
  }

  const currentChunk = chunks[currentChunkIndex];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-slate-400">Pratique: {currentChunkIndex + 1} de {chunks.length}</span>
        <Badge className="bg-red-500/20 text-red-400">
          <Mic className="w-3 h-3 mr-1" />
          Pronúncia
        </Badge>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">{currentChunk.expression}</h3>
          <p className="text-slate-400 mb-6">{currentChunk.meaning}</p>

          <div className="flex justify-center gap-4 mb-6">
            {!isRecording ? (
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600"
                onClick={startRecording}
              >
                <Mic className="w-5 h-5 mr-2" />
                Gravar
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="border-red-500 text-red-400 animate-pulse"
                onClick={stopRecording}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                Parar
              </Button>
            )}
          </div>

          {audioUrl && (
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Sua gravação:</p>
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setAudioUrl(null);
            setCurrentChunkIndex(Math.max(0, currentChunkIndex - 1));
          }}
          disabled={currentChunkIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAudioUrl(null);
            setCurrentChunkIndex(Math.min(chunks.length - 1, currentChunkIndex + 1));
          }}
          disabled={currentChunkIndex === chunks.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Página principal
export default function LessonQuest() {
  const params = useParams();
  const lessonId = parseInt(params.id || "1");
  const lesson = lessonsData.find(l => l.id === lessonId) || lessonsData[0];
  
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(3);

  const steps = [
    { id: 'learn', icon: BookOpen, label: 'Aprender', description: 'Estude os chunks' },
    { id: 'listen', icon: Music, label: 'Ouvir', description: 'Ouça a música' },
    { id: 'practice', icon: Target, label: 'Praticar', description: 'Faça o quiz' },
    { id: 'speak', icon: Mic, label: 'Falar', description: 'Pratique pronúncia' }
  ];

  const handleQuizComplete = (score: number) => {
    setTotalPoints(prev => prev + score);
    if (!completedSteps.includes('practice')) {
      setCompletedSteps(prev => [...prev, 'practice']);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/lessons">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">Lesson {lesson.id}: {lesson.theme}</h1>
                <p className="text-sm text-slate-400">{lesson.unit} - {lesson.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-orange-500/20 text-orange-400">
                <Flame className="w-3 h-3 mr-1" />
                {streak} dias
              </Badge>
              <Badge className="bg-green-500/20 text-green-400">
                <Star className="w-3 h-3 mr-1" />
                {totalPoints} pts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container py-6">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isActive = idx === completedSteps.length;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? `bg-gradient-to-r ${lesson.color} text-white`
                      : 'bg-slate-700 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`text-sm font-medium ${isCompleted || isActive ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="learn" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="learn" className="data-[state=active]:bg-blue-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Aprender
            </TabsTrigger>
            <TabsTrigger value="listen" className="data-[state=active]:bg-purple-500/20">
              <Music className="w-4 h-4 mr-2" />
              Ouvir
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-green-500/20">
              <Target className="w-4 h-4 mr-2" />
              Praticar
            </TabsTrigger>
            <TabsTrigger value="speak" className="data-[state=active]:bg-red-500/20">
              <Mic className="w-4 h-4 mr-2" />
              Falar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn">
            <ChunksSection lesson={lesson} />
          </TabsContent>

          <TabsContent value="listen">
            <MusicSection lesson={lesson} />
          </TabsContent>

          <TabsContent value="practice">
            <QuizSection lesson={lesson} onComplete={handleQuizComplete} />
          </TabsContent>

          <TabsContent value="speak">
            <RecordSection lesson={lesson} />
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link href={`/lesson-quest/${Math.max(1, lessonId - 1)}`}>
            <Button variant="outline" disabled={lessonId <= 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Lesson Anterior
            </Button>
          </Link>
          <Link href={`/lesson-quest/${Math.min(6, lessonId + 1)}`}>
            <Button className={`bg-gradient-to-r ${lesson.color}`} disabled={lessonId >= 6}>
              Próxima Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
