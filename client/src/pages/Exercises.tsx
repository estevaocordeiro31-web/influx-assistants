import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Trophy, 
  RefreshCw,
  BookOpen,
  Target,
  Flame,
  Star,
  Shuffle,
  ArrowRight,
  Volume2,
  Lightbulb,
  GripVertical
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type ExerciseType = "fill_blank" | "multiple_choice" | "translation" | "ordering" | "matching" | "dictation";

interface Exercise {
  id: number;
  type: ExerciseType;
  chunk: string;
  equivalent: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  audioText?: string;
}

interface ChunkData {
  chunk: string;
  equivalent: string;
  context: string;
  examples: string[];
}

// Biblioteca de chunks por livro
const CHUNKS_BY_BOOK: Record<string, ChunkData[]> = {
  "Book 1": [
    { chunk: "How are you?", equivalent: "Como você está?", context: "Cumprimento básico", examples: ["How are you doing today?", "How are you feeling?"] },
    { chunk: "Nice to meet you", equivalent: "Prazer em conhecê-lo", context: "Apresentação", examples: ["Nice to meet you, John.", "It's nice to meet you too."] },
    { chunk: "What's your name?", equivalent: "Qual é o seu nome?", context: "Apresentação", examples: ["What's your name?", "My name is..."] },
    { chunk: "I'm from", equivalent: "Eu sou de", context: "Origem", examples: ["I'm from Brazil.", "Where are you from?"] },
    { chunk: "I like", equivalent: "Eu gosto de", context: "Preferências", examples: ["I like coffee.", "I like to travel."] },
    { chunk: "I don't like", equivalent: "Eu não gosto de", context: "Preferências negativas", examples: ["I don't like spicy food.", "I don't like waking up early."] },
  ],
  "Book 2": [
    { chunk: "I'm going to", equivalent: "Eu vou", context: "Planos futuros", examples: ["I'm going to travel next month.", "I'm going to study tonight."] },
    { chunk: "I have to", equivalent: "Eu tenho que", context: "Obrigação", examples: ["I have to work tomorrow.", "I have to finish this report."] },
    { chunk: "Would you like", equivalent: "Você gostaria de", context: "Oferta/convite", examples: ["Would you like some coffee?", "Would you like to join us?"] },
    { chunk: "Can I have", equivalent: "Posso ter/pegar", context: "Pedido", examples: ["Can I have the menu?", "Can I have a glass of water?"] },
    { chunk: "I used to", equivalent: "Eu costumava", context: "Hábitos passados", examples: ["I used to live in São Paulo.", "I used to play soccer."] },
    { chunk: "I need to", equivalent: "Eu preciso", context: "Necessidade", examples: ["I need to talk to you.", "I need to buy groceries."] },
  ],
  "Book 3": [
    { chunk: "I've been", equivalent: "Eu tenho estado", context: "Ações contínuas", examples: ["I've been working hard.", "I've been studying English."] },
    { chunk: "I should have", equivalent: "Eu deveria ter", context: "Arrependimento", examples: ["I should have called you.", "I should have studied more."] },
    { chunk: "It depends on", equivalent: "Depende de", context: "Condição", examples: ["It depends on the weather.", "It depends on my schedule."] },
    { chunk: "I'm supposed to", equivalent: "Eu deveria", context: "Expectativa", examples: ["I'm supposed to be there at 8.", "I'm supposed to finish today."] },
    { chunk: "As soon as", equivalent: "Assim que", context: "Tempo", examples: ["As soon as I arrive, I'll call you.", "As soon as possible."] },
    { chunk: "In case", equivalent: "Caso / No caso de", context: "Precaução", examples: ["In case of emergency.", "In case you need help."] },
  ],
  "Book 4": [
    { chunk: "I wish I could", equivalent: "Eu queria poder", context: "Desejo", examples: ["I wish I could travel more.", "I wish I could speak French."] },
    { chunk: "If I were you", equivalent: "Se eu fosse você", context: "Conselho", examples: ["If I were you, I'd accept the offer.", "If I were you, I'd talk to her."] },
    { chunk: "It's worth", equivalent: "Vale a pena", context: "Valor", examples: ["It's worth trying.", "It's worth the money."] },
    { chunk: "I can't help", equivalent: "Não consigo evitar", context: "Ação involuntária", examples: ["I can't help laughing.", "I can't help thinking about it."] },
    { chunk: "No matter what", equivalent: "Não importa o que", context: "Ênfase", examples: ["No matter what happens.", "No matter what you say."] },
    { chunk: "The more... the more", equivalent: "Quanto mais... mais", context: "Comparação progressiva", examples: ["The more you practice, the better you get.", "The more I learn, the more I want to know."] },
  ],
  "Book 5": [
    { chunk: "I've been meaning to", equivalent: "Eu tenho querido / Eu estava querendo", context: "Expressar intenção adiada", examples: ["I've been meaning to call you.", "I've been meaning to read that book."] },
    { chunk: "It goes without saying", equivalent: "É óbvio / Nem precisa dizer", context: "Enfatizar algo evidente", examples: ["It goes without saying that we appreciate your help.", "It goes without saying that safety comes first."] },
    { chunk: "As far as I'm concerned", equivalent: "Na minha opinião / Para mim", context: "Expressar opinião pessoal", examples: ["As far as I'm concerned, this is the best option.", "As far as I'm concerned, we should wait."] },
    { chunk: "I couldn't agree more", equivalent: "Concordo plenamente", context: "Concordância enfática", examples: ["I couldn't agree more with your decision.", "I couldn't agree more!"] },
    { chunk: "That being said", equivalent: "Dito isso / Mesmo assim", context: "Transição de ideias", examples: ["That being said, we still have work to do.", "That being said, I understand your point."] },
    { chunk: "For what it's worth", equivalent: "Pelo que vale / Na minha humilde opinião", context: "Opinião modesta", examples: ["For what it's worth, I think you made the right choice.", "For what it's worth, here's my advice."] },
    { chunk: "By all means", equivalent: "Com certeza / Fique à vontade", context: "Permissão enfática", examples: ["By all means, go ahead!", "By all means, take your time."] },
    { chunk: "On second thought", equivalent: "Pensando bem", context: "Mudar de ideia", examples: ["On second thought, let's go to the beach.", "On second thought, I'll stay home."] },
  ],
};

// Função para gerar exercícios dinâmicos baseados no livro
const generateExercisesForBook = (bookName: string): Exercise[] => {
  const chunks = CHUNKS_BY_BOOK[bookName] || CHUNKS_BY_BOOK["Book 5"];
  const exercises: Exercise[] = [];
  let id = 1;

  chunks.forEach((chunkData, index) => {
    // Exercício de preenchimento
    exercises.push({
      id: id++,
      type: "fill_blank",
      chunk: chunkData.chunk,
      equivalent: chunkData.equivalent,
      question: `Complete: '_____ ${chunkData.examples[0].replace(chunkData.chunk, "").trim()}'`,
      correctAnswer: chunkData.chunk,
      hint: chunkData.context,
      difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard",
      points: index < 2 ? 10 : index < 4 ? 15 : 25,
    });

    // Exercício de múltipla escolha
    const wrongOptions = chunks
      .filter(c => c.chunk !== chunkData.chunk)
      .slice(0, 3)
      .map(c => c.equivalent);
    
    exercises.push({
      id: id++,
      type: "multiple_choice",
      chunk: chunkData.chunk,
      equivalent: chunkData.equivalent,
      question: `O que significa "${chunkData.chunk}"?`,
      options: [chunkData.equivalent, ...wrongOptions].sort(() => Math.random() - 0.5),
      correctAnswer: chunkData.equivalent,
      difficulty: "easy",
      points: 10,
    });

    // Exercício de tradução
    exercises.push({
      id: id++,
      type: "translation",
      chunk: chunkData.chunk,
      equivalent: chunkData.equivalent,
      question: `Traduza para inglês usando o chunk apropriado: "${chunkData.equivalent}"`,
      correctAnswer: chunkData.chunk,
      hint: `Dica: ${chunkData.context}`,
      difficulty: "hard",
      points: 25,
    });

    // Exercício de ordenação (para alguns chunks)
    if (index % 2 === 0) {
      const words = chunkData.chunk.split(" ");
      if (words.length >= 3) {
        exercises.push({
          id: id++,
          type: "ordering",
          chunk: chunkData.chunk,
          equivalent: chunkData.equivalent,
          question: "Ordene as palavras para formar o chunk correto:",
          options: [...words].sort(() => Math.random() - 0.5),
          correctAnswer: words,
          difficulty: "medium",
          points: 20,
        });
      }
    }

    // Exercício de matching (a cada 3 chunks)
    if (index % 3 === 0 && index + 2 < chunks.length) {
      const matchChunks = chunks.slice(index, index + 3);
      exercises.push({
        id: id++,
        type: "matching",
        chunk: matchChunks.map(c => c.chunk).join("|"),
        equivalent: matchChunks.map(c => c.equivalent).join("|"),
        question: "Conecte os chunks às suas equivalências:",
        options: matchChunks.map(c => c.chunk),
        correctAnswer: matchChunks.map(c => c.equivalent),
        difficulty: "medium",
        points: 30,
      });
    }

    // Exercício de ditado
    if (index % 2 === 1) {
      exercises.push({
        id: id++,
        type: "dictation",
        chunk: chunkData.chunk,
        equivalent: chunkData.equivalent,
        question: "Ouça e escreva o chunk que você ouvir:",
        correctAnswer: chunkData.chunk,
        audioText: chunkData.chunk,
        difficulty: "hard",
        points: 30,
      });
    }
  });

  // Embaralhar exercícios
  return exercises.sort(() => Math.random() - 0.5).slice(0, 12);
};

export default function Exercises() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState("Book 5");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>({});
  const [selectedChunk, setSelectedChunk] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const isDemo = location.startsWith("/demo");

  // Gerar exercícios quando o livro mudar
  useEffect(() => {
    const newExercises = generateExercisesForBook(selectedBook);
    setExercises(newExercises);
    resetExercises();
  }, [selectedBook]);

  const currentExercise = exercises[currentExerciseIndex];
  const progress = exercises.length > 0 ? (completed.length / exercises.length) * 100 : 0;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    } else {
      toast.error("Seu navegador não suporta síntese de voz");
    }
  };

  const checkAnswer = () => {
    if (!currentExercise) return;

    let correct = false;

    switch (currentExercise.type) {
      case "fill_blank":
      case "dictation":
        correct = userAnswer.toLowerCase().trim() === (currentExercise.correctAnswer as string).toLowerCase().trim();
        break;
      
      case "multiple_choice":
        correct = selectedOption === currentExercise.correctAnswer;
        break;
      
      case "translation":
        const answerLower = userAnswer.toLowerCase().trim();
        const chunkLower = currentExercise.chunk.toLowerCase();
        // Aceitar se contém as primeiras palavras do chunk
        const firstWords = chunkLower.split(" ").slice(0, 3).join(" ");
        correct = answerLower.includes(firstWords) || answerLower === chunkLower;
        break;
      
      case "ordering":
        correct = orderedWords.join(" ").toLowerCase() === (currentExercise.correctAnswer as string[]).join(" ").toLowerCase();
        break;
      
      case "matching":
        const correctPairs = currentExercise.options!.reduce((acc, chunk, idx) => {
          acc[chunk] = (currentExercise.correctAnswer as string[])[idx];
          return acc;
        }, {} as Record<string, string>);
        correct = JSON.stringify(matchingPairs) === JSON.stringify(correctPairs);
        break;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const bonusPoints = streak >= 3 ? Math.floor(currentExercise.points * 0.5) : 0;
      setScore(prev => prev + currentExercise.points + bonusPoints);
      setStreak(prev => prev + 1);
      setCompleted(prev => [...prev, currentExercise.id]);
      toast.success(`+${currentExercise.points + bonusPoints} pontos!`, {
        description: streak >= 3 ? "Bônus de sequência!" : undefined,
      });
    } else {
      setStreak(0);
      toast.error("Tente novamente!");
    }
  };

  const nextExercise = () => {
    setShowResult(false);
    setUserAnswer("");
    setSelectedOption(null);
    setOrderedWords([]);
    setMatchingPairs({});
    setSelectedChunk(null);
    setShowHint(false);
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const retryExercise = () => {
    setShowResult(false);
    setUserAnswer("");
    setSelectedOption(null);
    setOrderedWords([]);
    setMatchingPairs({});
    setSelectedChunk(null);
  };

  const resetExercises = () => {
    setCurrentExerciseIndex(0);
    setUserAnswer("");
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setCompleted([]);
    setOrderedWords([]);
    setMatchingPairs({});
    setSelectedChunk(null);
    setShowHint(false);
  };

  const handleWordClick = (word: string) => {
    if (orderedWords.includes(word)) {
      setOrderedWords(prev => prev.filter(w => w !== word));
    } else {
      setOrderedWords(prev => [...prev, word]);
    }
  };

  const handleMatchingClick = (item: string, isChunk: boolean) => {
    if (isChunk) {
      setSelectedChunk(item);
    } else if (selectedChunk) {
      setMatchingPairs(prev => ({ ...prev, [selectedChunk]: item }));
      setSelectedChunk(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getTypeLabel = (type: ExerciseType) => {
    switch (type) {
      case "fill_blank": return "Preencha";
      case "multiple_choice": return "Múltipla Escolha";
      case "translation": return "Tradução";
      case "ordering": return "Ordenação";
      case "matching": return "Conexão";
      case "dictation": return "Ditado";
      default: return type;
    }
  };

  const getTypeIcon = (type: ExerciseType) => {
    switch (type) {
      case "fill_blank": return "✏️";
      case "multiple_choice": return "🔘";
      case "translation": return "🌐";
      case "ordering": return "🔢";
      case "matching": return "🔗";
      case "dictation": return "🎧";
      default: return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(isDemo ? "/demo" : "/student/home")}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Exercícios de Chunks
            </h1>
            <p className="text-sm text-slate-400">{selectedBook} • Pratique seus chunks</p>
          </div>

          <div className="flex items-center gap-3">
            {streak >= 3 && (
              <div className="flex items-center gap-1 bg-orange-500/20 px-3 py-1.5 rounded-full animate-pulse">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400 font-bold">{streak}x</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-bold">{score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Seletor de Livro */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(CHUNKS_BY_BOOK).map((book) => (
            <Button
              key={book}
              variant={selectedBook === book ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBook(book)}
              className={selectedBook === book 
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" 
                : "border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              }
            >
              <BookOpen className="w-4 h-4 mr-1" />
              {book}
            </Button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Exercício {currentExerciseIndex + 1} de {exercises.length}</span>
            <span className="text-sm text-slate-400">{completed.length} completos</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        {completed.length === exercises.length && exercises.length > 0 ? (
          <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Parabéns! 🎉</h2>
              <p className="text-slate-300 mb-4">Você completou todos os exercícios do {selectedBook}!</p>
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{score}</p>
                  <p className="text-sm text-slate-400">Pontos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{completed.length}</p>
                  <p className="text-sm text-slate-400">Corretos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-400">{streak}</p>
                  <p className="text-sm text-slate-400">Sequência Máx</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetExercises} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Praticar Novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const books = Object.keys(CHUNKS_BY_BOOK);
                    const currentIndex = books.indexOf(selectedBook);
                    if (currentIndex < books.length - 1) {
                      setSelectedBook(books[currentIndex + 1]);
                    }
                  }}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  Próximo Livro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : currentExercise && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(currentExercise.type)}</span>
                  <Badge className={getDifficultyColor(currentExercise.difficulty)}>
                    {currentExercise.difficulty === "easy" ? "Fácil" : currentExercise.difficulty === "medium" ? "Médio" : "Difícil"}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">{getTypeLabel(currentExercise.type)}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {currentExercise.hint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">{currentExercise.points} pts</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Chunk Info */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CHUNK</p>
                <p className="text-lg font-bold text-green-400">"{currentExercise.chunk}"</p>
                <p className="text-sm text-slate-400">Equivalência: {currentExercise.equivalent}</p>
              </div>

              {/* Hint */}
              {showHint && currentExercise.hint && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm text-yellow-300">{currentExercise.hint}</p>
                </div>
              )}

              {/* Question */}
              <div>
                <p className="text-white text-lg mb-4">{currentExercise.question}</p>

                {/* Dictation - Audio Button */}
                {currentExercise.type === "dictation" && currentExercise.audioText && (
                  <Button
                    onClick={() => speakText(currentExercise.audioText!)}
                    className="mb-4 bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Ouvir Áudio
                  </Button>
                )}

                {/* Fill Blank / Translation / Dictation Input */}
                {(currentExercise.type === "fill_blank" || currentExercise.type === "translation" || currentExercise.type === "dictation") && (
                  <Input
                    placeholder="Digite sua resposta..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !showResult && checkAnswer()}
                    disabled={showResult}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 h-12"
                  />
                )}

                {/* Multiple Choice Options */}
                {currentExercise.type === "multiple_choice" && currentExercise.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentExercise.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => !showResult && setSelectedOption(option)}
                        disabled={showResult}
                        className={`h-auto py-3 px-4 text-left justify-start ${
                          selectedOption === option
                            ? showResult
                              ? option === currentExercise.correctAnswer
                                ? "bg-green-500/20 border-green-500 text-green-400"
                                : "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-blue-500/20 border-blue-500 text-blue-400"
                            : showResult && option === currentExercise.correctAnswer
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : "border-slate-600 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <span className="mr-2 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Ordering Exercise */}
                {currentExercise.type === "ordering" && currentExercise.options && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.options.map((word, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => !showResult && handleWordClick(word)}
                          disabled={showResult || orderedWords.includes(word)}
                          className={`${
                            orderedWords.includes(word)
                              ? "opacity-50"
                              : "border-slate-600 text-slate-300 hover:border-green-500 hover:text-green-400"
                          }`}
                        >
                          <GripVertical className="w-3 h-3 mr-1" />
                          {word}
                        </Button>
                      ))}
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 min-h-[60px]">
                      <p className="text-xs text-slate-500 mb-2">Sua resposta:</p>
                      <div className="flex flex-wrap gap-2">
                        {orderedWords.map((word, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-green-500/20 text-green-400 cursor-pointer"
                            onClick={() => !showResult && handleWordClick(word)}
                          >
                            {word}
                          </Badge>
                        ))}
                        {orderedWords.length === 0 && (
                          <span className="text-slate-500 text-sm">Clique nas palavras acima para ordenar</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Matching Exercise */}
                {currentExercise.type === "matching" && currentExercise.options && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 uppercase">Chunks</p>
                      {currentExercise.options.map((chunk, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => !showResult && handleMatchingClick(chunk, true)}
                          disabled={showResult || !!matchingPairs[chunk]}
                          className={`w-full justify-start ${
                            selectedChunk === chunk
                              ? "border-blue-500 text-blue-400"
                              : matchingPairs[chunk]
                                ? "opacity-50"
                                : "border-slate-600 text-slate-300"
                          }`}
                        >
                          {chunk}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 uppercase">Equivalências</p>
                      {(currentExercise.correctAnswer as string[]).sort(() => Math.random() - 0.5).map((equiv, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => !showResult && handleMatchingClick(equiv, false)}
                          disabled={showResult || Object.values(matchingPairs).includes(equiv)}
                          className={`w-full justify-start text-left ${
                            Object.values(matchingPairs).includes(equiv)
                              ? "opacity-50"
                              : "border-slate-600 text-slate-300"
                          }`}
                        >
                          {equiv}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className={`p-4 rounded-xl ${isCorrect ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">Correto!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-bold">Incorreto</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-slate-300">
                      Resposta correta: <span className="text-green-400 font-medium">
                        {Array.isArray(currentExercise.correctAnswer) 
                          ? currentExercise.correctAnswer.join(" ") 
                          : currentExercise.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showResult ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={
                      (currentExercise.type === "fill_blank" || currentExercise.type === "translation" || currentExercise.type === "dictation") && !userAnswer.trim() ||
                      currentExercise.type === "multiple_choice" && !selectedOption ||
                      currentExercise.type === "ordering" && orderedWords.length !== currentExercise.options?.length ||
                      currentExercise.type === "matching" && Object.keys(matchingPairs).length !== currentExercise.options?.length
                    }
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Resposta
                  </Button>
                ) : (
                  <>
                    {!isCorrect && (
                      <Button
                        onClick={retryExercise}
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:text-white h-12"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                      </Button>
                    )}
                    <Button
                      onClick={nextExercise}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white h-12"
                    >
                      Próximo Exercício
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{exercises.length}</p>
              <p className="text-xs text-slate-400">Exercícios</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{completed.length}</p>
              <p className="text-xs text-slate-400">Completos</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-xs text-slate-400">Sequência</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
