import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Volume2, CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface Question {
  id: string;
  part: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  audioFile?: string;
  trap?: string;
  tip?: string;
}

interface ToeicExerciseProps {
  partId: string;
  questions: Question[];
  onComplete: (score: number, results: QuestionResult[]) => void;
}

interface QuestionResult {
  questionId: string;
  userAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  part1: [
    {
      id: 'p1-q1',
      part: 'Part 1',
      question: 'What is the man doing?',
      options: [
        'He is sitting at a table',
        'He is standing by the window',
        'He is walking in the park',
        'He is reading a book',
      ],
      correctAnswer: 0,
      explanation: 'The man in the photograph is sitting at a table with a laptop.',
      trap: 'Option 2 might sound similar to the recording but is incorrect.',
      tip: 'Look at the photograph first before listening to the answer choices.',
    },
    {
      id: 'p1-q2',
      part: 'Part 1',
      question: 'Where is the woman?',
      options: [
        'In an office',
        'In a meeting room',
        'In a coffee shop',
        'In a library',
      ],
      correctAnswer: 2,
      explanation: 'The woman is sitting in a coffee shop with a cup of coffee.',
      trap: 'The word "meeting" might be repeated in the recording but used incorrectly.',
      tip: 'Ask yourself: Who is in the photo? What is happening? Where was it taken?',
    },
  ],
  part2: [
    {
      id: 'p2-q1',
      part: 'Part 2',
      question: 'How long have you been working here?',
      options: [
        'About five years',
        'I work here every day',
        'Yes, I have',
        'The office is very nice',
      ],
      correctAnswer: 0,
      explanation: 'This is a direct answer to "How long have you been working here?"',
      trap: 'Option 2 uses a word from the question but does not answer it.',
      tip: 'Focus on the words that are easier to hear, not the stressed words.',
    },
    {
      id: 'p2-q2',
      part: 'Part 2',
      question: 'Where did you go on vacation?',
      options: [
        'I went to the beach',
        'Vacation is a good time',
        'I like to travel',
        'Yes, I did',
      ],
      correctAnswer: 0,
      explanation: 'This directly answers where the person went on vacation.',
      trap: 'Option 3 is related to the topic but does not answer the question.',
      tip: 'Answer the question as quickly as possible and prepare for the next one.',
    },
  ],
  part3: [
    {
      id: 'p3-q1',
      part: 'Part 3',
      question: 'What is the main topic of the conversation?',
      options: [
        'Planning a business meeting',
        'Discussing vacation plans',
        'Talking about a project deadline',
        'Arranging a dinner reservation',
      ],
      correctAnswer: 0,
      explanation: 'The speakers are discussing when to schedule a business meeting.',
      trap: 'The conversation mentions "Friday" but that is not the main topic.',
      tip: 'Try to guess what the conversation is about before listening.',
    },
  ],
};

export default function ToeicExercise({
  partId,
  questions: providedQuestions,
  onComplete,
}: ToeicExerciseProps) {
  const questions = providedQuestions.length > 0 ? providedQuestions : (SAMPLE_QUESTIONS[partId] || []);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isCorrect = currentAnswer === currentQuestion.correctAnswer;

  const handleSelectAnswer = (optionIndex: number) => {
    if (!isAnswered) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleSubmitAnswer = () => {
    setIsAnswered(true);
    setShowResult(true);

    const timeSpent = (Date.now() - startTime) / 1000;
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: currentAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: currentAnswer === currentQuestion.correctAnswer,
      timeSpent,
    };

    setResults([...results, result]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setShowResult(false);
      setStartTime(Date.now());
    } else {
      // Quiz completed
      const score = results.filter(r => r.isCorrect).length;
      onComplete((score / questions.length) * 100, results);
    }
  };

  const handleSkip = () => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = null;
      return newAnswers;
    });
    handleNext();
  };

  const progress = ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-slate-400">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">{currentQuestion.part}</h3>
          <p className="text-slate-300">{currentQuestion.question}</p>
        </div>

        {/* Audio Player */}
        {currentQuestion.audioFile && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-slate-300">Listen to the audio</span>
            </div>
            <audio
              controls
              className="w-full"
              controlsList="nodownload"
            >
              <source src={currentQuestion.audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                currentAnswer === index
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              } ${
                isAnswered && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-500/10'
                  : ''
              } ${
                isAnswered && index === currentAnswer && !isCorrect
                  ? 'border-red-500 bg-red-500/10'
                  : ''
              } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-slate-200">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                )}
                {isAnswered && index === currentAnswer && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showResult && (
          <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-slate-300 mb-3">{currentQuestion.explanation}</p>
            {currentQuestion.trap && (
              <div className="mb-2 p-2 bg-slate-700 rounded">
                <p className="text-sm text-slate-400">
                  <span className="font-bold text-yellow-400">⚠️ Trap:</span> {currentQuestion.trap}
                </p>
              </div>
            )}
            {currentQuestion.tip && (
              <div className="p-2 bg-slate-700 rounded">
                <p className="text-sm text-slate-400">
                  <span className="font-bold text-blue-400">💡 Tip:</span> {currentQuestion.tip}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isAnswered ? (
            <>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={currentAnswer === null}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                Submit Answer
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
