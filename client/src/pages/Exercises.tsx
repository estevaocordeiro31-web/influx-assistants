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
  Star
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

type ExerciseType = "fill_blank" | "multiple_choice" | "translation";

interface Exercise {
  id: number;
  type: ExerciseType;
  chunk: string;
  equivalent: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

const DEMO_EXERCISES: Exercise[] = [
  {
    id: 1,
    type: "fill_blank",
    chunk: "I've been meaning to",
    equivalent: "Eu tenho querido / Eu estava querendo",
    question: "Complete: '_____ call you all week, but I've been so busy.'",
    correctAnswer: "I've been meaning to",
    hint: "Expressa uma intenção que foi adiada",
    difficulty: "medium",
    points: 15,
  },
  {
    id: 2,
    type: "multiple_choice",
    chunk: "It goes without saying",
    equivalent: "É óbvio / Nem precisa dizer",
    question: "What does 'It goes without saying' mean?",
    options: [
      "É óbvio / Nem precisa dizer",
      "Vai sem falar",
      "Não diga nada",
      "Continue andando"
    ],
    correctAnswer: "É óbvio / Nem precisa dizer",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 3,
    type: "translation",
    chunk: "As far as I'm concerned",
    equivalent: "Na minha opinião / Para mim",
    question: "Traduza para inglês: 'Na minha opinião, este é o melhor restaurante.'",
    correctAnswer: "As far as I'm concerned",
    hint: "Use o chunk para expressar opinião pessoal",
    difficulty: "hard",
    points: 25,
  },
  {
    id: 4,
    type: "fill_blank",
    chunk: "I couldn't agree more",
    equivalent: "Concordo plenamente",
    question: "A: 'This movie is amazing!' B: '_____!'",
    correctAnswer: "I couldn't agree more",
    hint: "Expressa concordância enfática",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 5,
    type: "multiple_choice",
    chunk: "That being said",
    equivalent: "Dito isso / Mesmo assim",
    question: "When do you use 'That being said'?",
    options: [
      "Para fazer uma transição de ideias",
      "Para cumprimentar alguém",
      "Para pedir desculpas",
      "Para fazer uma pergunta"
    ],
    correctAnswer: "Para fazer uma transição de ideias",
    difficulty: "medium",
    points: 15,
  },
  {
    id: 6,
    type: "fill_blank",
    chunk: "I'm looking forward to",
    equivalent: "Estou ansioso por / Mal posso esperar",
    question: "Complete: '_____ meeting you next week!'",
    correctAnswer: "I'm looking forward to",
    hint: "Expressa expectativa positiva",
    difficulty: "easy",
    points: 10,
  },
];

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

  const isDemo = location.startsWith("/demo");
  const exercises = DEMO_EXERCISES;
  const currentExercise = exercises[currentExerciseIndex];
  const progress = (completed.length / exercises.length) * 100;

  const checkAnswer = () => {
    if (!currentExercise) return;

    let correct = false;
    const answer = currentExercise.type === "multiple_choice" ? selectedOption : userAnswer;

    if (currentExercise.type === "fill_blank") {
      correct = answer?.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    } else if (currentExercise.type === "multiple_choice") {
      correct = answer === currentExercise.correctAnswer;
    } else if (currentExercise.type === "translation") {
      const answerLower = answer?.toLowerCase() || "";
      const chunkWords = currentExercise.chunk.toLowerCase().split(" ").slice(0, 3).join(" ");
      correct = answerLower.includes(chunkWords);
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
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const retryExercise = () => {
    setShowResult(false);
    setUserAnswer("");
    setSelectedOption(null);
  };

  const resetExercises = () => {
    setCurrentExerciseIndex(0);
    setUserAnswer("");
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setCompleted([]);
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
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Exercícios de Chunks
            </h1>
            <p className="text-sm text-slate-400">Book 5 • Pratique seus chunks</p>
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Exercício {currentExerciseIndex + 1} de {exercises.length}</span>
            <span className="text-sm text-slate-400">{completed.length} completos</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        {completed.length === exercises.length ? (
          <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Parabéns! 🎉</h2>
              <p className="text-slate-300 mb-4">Você completou todos os exercícios!</p>
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{score}</p>
                  <p className="text-sm text-slate-400">Pontos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{completed.length}</p>
                  <p className="text-sm text-slate-400">Corretos</p>
                </div>
              </div>
              <Button onClick={resetExercises} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Praticar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : currentExercise && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(currentExercise.difficulty)}>
                    {currentExercise.difficulty === "easy" ? "Fácil" : currentExercise.difficulty === "medium" ? "Médio" : "Difícil"}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-400">{getTypeLabel(currentExercise.type)}</Badge>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">{currentExercise.points} pts</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Chunk</p>
                <p className="text-lg font-bold text-green-400">"{currentExercise.chunk}"</p>
                <p className="text-sm text-slate-400 mt-1">
                  <span className="text-blue-400">Equivalência:</span> {currentExercise.equivalent}
                </p>
              </div>

              <div>
                <p className="text-white text-lg mb-4">{currentExercise.question}</p>

                {currentExercise.type === "fill_blank" && (
                  <Input
                    placeholder="Digite sua resposta..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showResult}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 h-12"
                    onKeyPress={(e) => e.key === "Enter" && !showResult && checkAnswer()}
                  />
                )}

                {currentExercise.type === "multiple_choice" && currentExercise.options && (
                  <div className="grid grid-cols-1 gap-2">
                    {currentExercise.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !showResult && setSelectedOption(option)}
                        disabled={showResult}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          showResult
                            ? option === currentExercise.correctAnswer
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : selectedOption === option
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-slate-700/50 border-slate-600 text-slate-400"
                            : selectedOption === option
                            ? "bg-blue-500/20 border-blue-500 text-blue-400"
                            : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentExercise.type === "translation" && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Type your translation in English..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={showResult}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 h-12"
                      onKeyPress={(e) => e.key === "Enter" && !showResult && checkAnswer()}
                    />
                    {currentExercise.hint && !showResult && (
                      <p className="text-xs text-slate-500">💡 Dica: {currentExercise.hint}</p>
                    )}
                  </div>
                )}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg border ${isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-green-400">Correto!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="font-bold text-red-400">Incorreto</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-500">Resposta correta:</span>{" "}
                      <span className="text-green-400 font-medium">{currentExercise.correctAnswer}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {!showResult ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={(currentExercise.type === "multiple_choice" && !selectedOption) || (currentExercise.type !== "multiple_choice" && !userAnswer.trim())}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12"
                  >
                    Verificar Resposta
                  </Button>
                ) : (
                  <>
                    {!isCorrect && (
                      <Button onClick={retryExercise} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 h-12">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                      </Button>
                    )}
                    <Button onClick={nextExercise} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12">
                      {currentExerciseIndex < exercises.length - 1 ? "Próximo Exercício" : "Ver Resultados"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
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
