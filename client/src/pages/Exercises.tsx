import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface Exercise {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  chunk: string;
  explanation: string;
}

const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 1,
    question: "Complete a frase: 'I would like to...'",
    options: ["go to the beach", "going to the beach", "went to the beach", "goes to the beach"],
    correctAnswer: "go to the beach",
    chunk: "I would like to",
    explanation: "Este chunk é usado para expressar desejos de forma educada. Em português: 'Eu gostaria de...'",
  },
  {
    id: 2,
    question: "Qual é a equivalência de 'Could you help me?'",
    options: ["Você pode me ajudar?", "Você ajudou-me?", "Você vai me ajudar?", "Você me ajuda?"],
    correctAnswer: "Você pode me ajudar?",
    chunk: "Could you help me",
    explanation: "Este chunk é um pedido educado. A equivalência mais natural é 'Você pode me ajudar?'",
  },
];

export default function Exercises() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentExercise = SAMPLE_EXERCISES[currentExerciseIdx];
  const isCorrect = selectedAnswer === currentExercise.correctAnswer;

  const handleSubmit = () => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentExerciseIdx < SAMPLE_EXERCISES.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentExerciseIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const isLastExercise = currentExerciseIdx === SAMPLE_EXERCISES.length - 1;
  const allComplete = showResult && isLastExercise;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Exercícios Personalizados</h1>
            <p className="text-sm text-muted-foreground">
              Pratique chunks focados em seu objetivo
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className="text-lg font-bold text-primary">
              {currentExerciseIdx + 1}/{SAMPLE_EXERCISES.length}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {allComplete ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Parabéns!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Você completou todos os exercícios
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-2">Sua Pontuação</p>
                <p className="text-4xl font-bold text-primary">
                  {score}/{SAMPLE_EXERCISES.length}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleReset}
                  className="bg-primary hover:bg-primary/90"
                >
                  Refazer Exercícios
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/student/dashboard")}
                >
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {currentExercise.chunk}
                  </CardTitle>
                  <CardDescription>
                    Exercício {currentExerciseIdx + 1} de {SAMPLE_EXERCISES.length}
                  </CardDescription>
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {currentExercise.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentExercise.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option
                          ? showResult
                            ? isCorrect
                              ? "border-green-600 bg-green-50"
                              : "border-red-600 bg-red-50"
                            : "border-primary bg-blue-50"
                          : showResult && option === currentExercise.correctAnswer
                          ? "border-green-600 bg-green-50"
                          : "border-border hover:border-primary hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === option
                              ? "border-current"
                              : "border-border"
                          }`}
                        >
                          {selectedAnswer === option && showResult && (
                            isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div
                  className={`p-4 rounded-lg ${
                    isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`font-semibold mb-2 ${
                      isCorrect ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {isCorrect ? "✓ Correto!" : "✗ Incorreto"}
                  </p>
                  <p className="text-sm text-foreground mb-2">
                    {currentExercise.explanation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Resposta correta: <strong>{currentExercise.correctAnswer}</strong>
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {!showResult ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Verificar Resposta
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleNext}
                      disabled={isLastExercise}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isLastExercise ? "Concluído" : "Próximo Exercício"}
                    </Button>
                    {isLastExercise && (
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="flex-1"
                      >
                        Refazer
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
