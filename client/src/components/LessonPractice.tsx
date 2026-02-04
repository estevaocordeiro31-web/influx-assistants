import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Mic, Star, CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight, Zap, Target, Flame, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const lessonsData = [
  { id: 1, title: "Friends and Acquaintances", unit: "Unit 1", theme: "Making Friends", color: "from-blue-500 to-cyan-500",
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
    ]
  },
  { id: 2, title: "Friends and Acquaintances", unit: "Unit 1", theme: "Friends Forever", color: "from-purple-500 to-pink-500", chunks: [] },
  { id: 3, title: "Family and Relationship", unit: "Unit 1", theme: "Family Ties", color: "from-orange-500 to-red-500",
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
    ]
  },
  { id: 4, title: "Family and Relationship", unit: "Unit 1", theme: "Generations", color: "from-amber-500 to-orange-500",
    chunks: [
      { expression: "faithful to", meaning: "fiel a", example: "Be faithful to your family." },
      { expression: "unfaithful to", meaning: "infiel a", example: "He was unfaithful to his wife." }
    ]
  },
  { id: 5, title: "Shapes and Colors", unit: "Unit 2", theme: "Colors of My Day", color: "from-green-500 to-emerald-500",
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
    ]
  },
  { id: 6, title: "Shapes and Colors", unit: "Unit 2", theme: "Black and White", color: "from-slate-500 to-zinc-500",
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
    ]
  }
];

function QuizSection({ lesson, onComplete, isLoggedIn }: { lesson: typeof lessonsData[0], onComplete: (score: number) => void, isLoggedIn: boolean }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const saveQuizAttempt = trpc.gamification.saveQuizAttempt.useMutation();
  const generateFeedback = trpc.gamification.generateFeedback.useMutation();

  const chunks = lesson.chunks;
  if (chunks.length === 0) return <div className="text-center py-8"><p className="text-slate-400">Esta é uma lição comunicativa. Pratique as expressões da lição anterior!</p></div>;

  const questions = chunks.slice(0, 5).map((chunk, idx) => {
    const wrongAnswers = chunks.filter((_, i) => i !== idx).slice(0, 3).map(c => c.meaning);
    const options = [chunk.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
    return { question: `O que significa "${chunk.expression}"?`, options, correctAnswer: options.indexOf(chunk.meaning), chunk };
  });

  const handleAnswer = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    const pointsEarned = correct ? 20 : 0;
    if (correct) setScore(score + pointsEarned);

    const currentChunk = questions[currentQuestion].chunk;

    if (isLoggedIn) {
      try {
        await saveQuizAttempt.mutateAsync({ lessonId: lesson.id, chunkExpression: currentChunk.expression, userAnswer: questions[currentQuestion].options[answerIndex], correctAnswer: currentChunk.meaning, isCorrect: correct });
      } catch (error) { console.error("Erro ao salvar tentativa:", error); }

      if (!correct) {
        setIsLoadingFeedback(true);
        try {
          const result = await generateFeedback.mutateAsync({ chunkExpression: currentChunk.expression, correctMeaning: currentChunk.meaning, userAnswer: questions[currentQuestion].options[answerIndex] });
          setAiFeedback(typeof result.feedback === 'string' ? result.feedback : String(result.feedback));
        } catch { setAiFeedback(`A expressão "${currentChunk.expression}" significa "${currentChunk.meaning}". Continue praticando! 💪`); }
        finally { setIsLoadingFeedback(false); }
      }
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null); setIsCorrect(null); setAiFeedback(null); }
      else { setShowResult(true); onComplete(score + pointsEarned); }
    }, correct ? 1500 : 4000);
  };

  if (showResult) return (
    <div className="text-center py-6">
      <div className={`text-5xl mb-3 ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{score >= 80 ? '🏆' : score >= 60 ? '⭐' : '💪'}</div>
      <h3 className="text-xl font-bold text-white mb-2">{score >= 80 ? 'Excelente!' : score >= 60 ? 'Muito bem!' : 'Continue praticando!'}</h3>
      <p className="text-2xl font-bold text-green-400 mb-4">{score} pontos</p>
      <Button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResult(false); setSelectedAnswer(null); setIsCorrect(null); setAiFeedback(null); }} className="bg-green-500 hover:bg-green-600"><RotateCcw className="w-4 h-4 mr-2" /> Tentar Novamente</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">Questão {currentQuestion + 1} de {questions.length}</span>
        <Badge className="bg-green-500/20 text-green-400"><Zap className="w-3 h-3 mr-1" />{score} pts</Badge>
      </div>
      <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
      <div className="p-4 bg-slate-900/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">{questions[currentQuestion].question}</h3>
        <div className="grid gap-3">
          {questions[currentQuestion].options.map((option, idx) => (
            <Button key={idx} variant="outline" className={`w-full justify-start p-4 h-auto min-h-[52px] text-left text-sm ${selectedAnswer === idx ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400') : selectedAnswer !== null && idx === questions[currentQuestion].correctAnswer ? 'bg-green-500/20 border-green-500 text-green-400' : 'hover:bg-slate-700/50'}`} onClick={() => selectedAnswer === null && handleAnswer(idx)} disabled={selectedAnswer !== null}>
              <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>{option}
              {selectedAnswer === idx && (isCorrect ? <CheckCircle2 className="w-4 h-4 ml-auto text-green-400" /> : <XCircle className="w-4 h-4 ml-auto text-red-400" />)}
            </Button>
          ))}
        </div>
        {(isLoadingFeedback || aiFeedback) && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            {isLoadingFeedback ? <div className="flex items-center gap-2 text-blue-400"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Gerando explicação...</span></div> : <p className="text-sm text-blue-300">{aiFeedback}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardsSection({ lesson, isLoggedIn }: { lesson: typeof lessonsData[0], isLoggedIn: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const logFlashcard = trpc.gamification.logFlashcardPractice.useMutation();

  const chunks = lesson.chunks;
  if (chunks.length === 0) return <div className="text-center py-8"><p className="text-slate-400">Esta é uma lição comunicativa. Revise os chunks da lição anterior!</p></div>;

  const currentChunk = chunks[currentIndex];

  const handleFlip = async () => {
    if (!flipped && isLoggedIn) { try { await logFlashcard.mutateAsync({ lessonId: lesson.id, chunkExpression: currentChunk.expression }); } catch (error) { console.error("Erro:", error); } }
    setFlipped(!flipped);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">Chunk {currentIndex + 1} de {chunks.length}</span>
        <Badge className="bg-blue-500/20 text-blue-400"><BookOpen className="w-3 h-3 mr-1" />Flashcards</Badge>
      </div>
      <div className="cursor-pointer" onClick={handleFlip}>
        {!flipped ? (
          <div className={`p-8 rounded-xl bg-gradient-to-br ${lesson.color} text-center`}><h3 className="text-2xl font-bold text-white mb-2">{currentChunk.expression}</h3><p className="text-white/60 text-sm">Clique para ver o significado</p></div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-700 text-center"><p className="text-xl font-semibold text-green-400 mb-3">{currentChunk.meaning}</p><p className="text-slate-300 italic text-sm">"{currentChunk.example}"</p></div>
        )}
      </div>
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => { setFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }} disabled={currentIndex === 0}><ChevronLeft className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(chunks.length - 1, currentIndex + 1)); }} disabled={currentIndex === chunks.length - 1}><ChevronRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

function RecordSection({ lesson, isLoggedIn }: { lesson: typeof lessonsData[0], isLoggedIn: boolean }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const logPronunciation = trpc.gamification.logPronunciationPractice.useMutation();

  const chunks = lesson.chunks;
  if (chunks.length === 0) return <div className="text-center py-8"><p className="text-slate-400">Esta é uma lição comunicativa. Pratique a pronúncia dos chunks anteriores!</p></div>;

  const currentChunk = chunks[currentChunkIndex];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        if (isLoggedIn) { try { await logPronunciation.mutateAsync({ lessonId: lesson.id, chunkExpression: currentChunk.expression }); } catch (error) { console.error("Erro:", error); } }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error('Error accessing microphone:', err); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">Pratique: {currentChunkIndex + 1} de {chunks.length}</span>
        <Badge className="bg-red-500/20 text-red-400"><Mic className="w-3 h-3 mr-1" />Pronúncia</Badge>
      </div>
      <div className="p-6 bg-slate-900/50 rounded-lg text-center">
        <h3 className="text-xl font-bold text-white mb-1">{currentChunk.expression}</h3>
        <p className="text-slate-400 text-sm mb-4">{currentChunk.meaning}</p>
        <div className="flex justify-center gap-3 mb-4">
          {!isRecording ? <Button className="bg-red-500 hover:bg-red-600" onClick={startRecording}><Mic className="w-4 h-4 mr-2" />Gravar</Button> : <Button variant="outline" className="border-red-500 text-red-400 animate-pulse" onClick={stopRecording}><div className="w-2 h-2 bg-red-500 rounded-full mr-2" />Parar</Button>}
        </div>
        {audioUrl && <div className="p-3 bg-slate-800 rounded-lg"><p className="text-xs text-slate-400 mb-2">Sua gravação:</p><audio controls src={audioUrl} className="w-full h-8" /></div>}
      </div>
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => { setAudioUrl(null); setCurrentChunkIndex(Math.max(0, currentChunkIndex - 1)); }} disabled={currentChunkIndex === 0}><ChevronLeft className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => { setAudioUrl(null); setCurrentChunkIndex(Math.min(chunks.length - 1, currentChunkIndex + 1)); }} disabled={currentChunkIndex === chunks.length - 1}><ChevronRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

export function LessonPractice({ currentBookId = 5 }: { currentBookId?: number }) {
  const [selectedLesson, setSelectedLesson] = useState(lessonsData[0]);
  const [localPoints, setLocalPoints] = useState(0);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const { data: progressData } = trpc.gamification.getProgress.useQuery({}, { enabled: isLoggedIn });
  const { data: streakData } = trpc.gamification.getStreak.useQuery(undefined, { enabled: isLoggedIn });

  const totalPoints = progressData?.totalPoints || localPoints;
  const currentStreak = streakData?.currentStreak || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} /><span className="text-white font-bold">{currentStreak} dias</span></div>
          <div className="h-4 w-px bg-slate-600" />
          <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /><span className="text-white font-bold">{totalPoints} pts</span></div>
        </div>
        {!isLoggedIn && <span className="text-xs text-slate-400">Faça login para salvar seu progresso</span>}
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-lg"><Target className="w-5 h-5 text-green-400" />Praticar Lessons - Book {currentBookId}</CardTitle>
          <CardDescription className="text-slate-400">Escolha uma lesson para praticar os chunks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 touch-spacing">
            {lessonsData.map((lesson) => (
              <Button key={lesson.id} variant={selectedLesson.id === lesson.id ? "default" : "outline"} className={`h-auto py-3 px-3 min-h-[56px] ${selectedLesson.id === lesson.id ? `bg-gradient-to-r ${lesson.color} text-white border-0` : 'border-slate-600'}`} onClick={() => setSelectedLesson(lesson)}>
                <div className="text-center"><div className="font-bold text-sm">L{lesson.id}</div><div className="text-[10px] opacity-80">{lesson.chunks.length} chunks</div></div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-white text-lg">Lesson {selectedLesson.id}: {selectedLesson.theme}</CardTitle><CardDescription className="text-slate-400">{selectedLesson.unit} - {selectedLesson.title}</CardDescription></div>
            <Badge className="bg-green-500/20 text-green-400"><Star className="w-3 h-3 mr-1" />{totalPoints} pts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="flashcards" className="space-y-4">
            <TabsList className="grid grid-cols-3 bg-slate-900/50 h-auto p-1">
              <TabsTrigger value="flashcards" className="data-[state=active]:bg-blue-500/20 text-xs sm:text-sm py-3"><BookOpen className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Flashcards</span><span className="sm:hidden">Cards</span></TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-green-500/20 text-xs sm:text-sm py-3"><Target className="w-4 h-4 mr-1 sm:mr-2" />Quiz</TabsTrigger>
              <TabsTrigger value="speak" className="data-[state=active]:bg-red-500/20 text-xs sm:text-sm py-3"><Mic className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Pronúncia</span><span className="sm:hidden">Falar</span></TabsTrigger>
            </TabsList>
            <TabsContent value="flashcards"><FlashcardsSection lesson={selectedLesson} isLoggedIn={isLoggedIn} /></TabsContent>
            <TabsContent value="quiz"><QuizSection lesson={selectedLesson} onComplete={(score) => setLocalPoints(prev => prev + score)} isLoggedIn={isLoggedIn} /></TabsContent>
            <TabsContent value="speak"><RecordSection lesson={selectedLesson} isLoggedIn={isLoggedIn} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default LessonPractice;
