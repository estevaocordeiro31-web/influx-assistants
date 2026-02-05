import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, Star, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { VideoQuiz as VideoQuizType, QuizQuestion } from '@/data/vacation-plus-2-quizzes';
import confetti from 'canvas-confetti';

interface VideoQuizProps {
  quiz: VideoQuizType;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export function VideoQuiz({ quiz, onComplete, onClose }: VideoQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number; isCorrect: boolean }[]>([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedIndex: index,
      isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      
      // Trigger confetti if passed
      if (passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Save to localStorage
      const quizResults = JSON.parse(localStorage.getItem('vp2-quiz-results') || '{}');
      quizResults[quiz.videoId] = {
        score,
        passed,
        completedAt: new Date().toISOString(),
        answers
      };
      localStorage.setItem('vp2-quiz-results', JSON.stringify(quizResults));
      
      onComplete(score, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setShowResults(false);
    setAnswers([]);
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50 hover:bg-primary/5';
    }
    
    if (index === currentQuestion.correctIndex) {
      return 'border-green-500 bg-green-500/20 text-green-400';
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctIndex) {
      return 'border-red-500 bg-red-500/20 text-red-400';
    }
    
    return 'border-border opacity-50';
  };

  const getTypeColor = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'chunk': return 'bg-purple-500/20 text-purple-400';
      case 'comprehension': return 'bg-blue-500/20 text-blue-400';
      case 'culture': return 'bg-orange-500/20 text-orange-400';
      case 'grammar': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeLabel = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'chunk': return 'Expressão';
      case 'comprehension': return 'Compreensão';
      case 'culture': return 'Cultura';
      case 'grammar': return 'Gramática';
      default: return type;
    }
  };

  if (showResults) {
    return (
      <Card className="p-6 bg-card border-border max-w-lg mx-auto">
        <div className="text-center space-y-6">
          {/* Result Icon */}
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
            passed ? 'bg-green-500/20' : 'bg-orange-500/20'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-green-400" />
            ) : (
              <RotateCcw className="w-12 h-12 text-orange-400" />
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {passed ? '🎉 Parabéns!' : '💪 Quase lá!'}
            </h3>
            <p className="text-muted-foreground">
              {passed 
                ? 'Você completou o quiz com sucesso!' 
                : 'Continue praticando para melhorar!'}
            </p>
          </div>

          {/* Score */}
          <div className="bg-background/50 rounded-xl p-6">
            <div className="text-5xl font-bold mb-2" style={{
              color: passed ? '#22c55e' : '#f97316'
            }}>
              {score}%
            </div>
            <p className="text-sm text-muted-foreground">
              {correctAnswers} de {quiz.questions.length} corretas
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mínimo para passar: {quiz.passingScore}%
            </p>
          </div>

          {/* Reward */}
          {passed && (
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">+{quiz.reward} influxcoins</span>
              <Sparkles className="w-5 h-5" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!passed && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleRetry}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
            <Button 
              className={`flex-1 ${passed ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={onClose}
            >
              {passed ? 'Continuar' : 'Fechar'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className={getTypeColor(currentQuestion.type)}>
            {getTypeLabel(currentQuestion.type)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
        <p className="text-sm text-muted-foreground">{currentQuestion.questionPt}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${getOptionStyle(index)}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {isAnswered && index === currentQuestion.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
              {isAnswered && selectedAnswer === index && index !== currentQuestion.correctIndex && (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`p-4 rounded-lg mb-6 ${
          selectedAnswer === currentQuestion.correctIndex 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-orange-500/10 border border-orange-500/30'
        }`}>
          <p className="text-sm font-medium mb-1">
            {selectedAnswer === currentQuestion.correctIndex ? '✓ Correto!' : '✗ Incorreto'}
          </p>
          <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          <p className="text-xs text-muted-foreground mt-1 italic">{currentQuestion.explanationPt}</p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <Button 
          className="w-full" 
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <>
              Próxima Pergunta
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Ver Resultado
              <Star className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
