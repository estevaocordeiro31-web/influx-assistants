import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Globe, MessageCircle, Pencil, Star, Trophy, XCircle } from "lucide-react";

// Types for exercise content
interface DialogueLine {
  speaker: string;
  text: string;
  accent?: string;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface MatchingPair {
  expression: string;
  country: string;
  explanation: string;
}

interface FillBlank {
  text: string;
  answer: string;
  hint?: string;
}

interface StoryLine {
  speaker: string;
  text: string;
  accent?: string;
}

interface ExpressionComparison {
  meaning: string;
  usa: string;
  uk: string;
  australia: string;
}

// Exercise content types
interface DialogueContent {
  exerciseType: "dialogue_practice";
  character: string;
  country: string;
  flag: string;
  scenario: string;
  dialogue: DialogueLine[];
  culturalNote: string;
  accentTip: string;
  questions: Question[];
}

interface MatchingContent {
  exerciseType: "matching";
  instruction: string;
  pairs: MatchingPair[];
}

interface FillBlankContent {
  exerciseType: "fill_in_the_blank";
  instruction: string;
  sentences: FillBlank[];
}

interface StoryContent {
  exerciseType: "story_reading";
  title: string;
  characters: { name: string; country: string; flag: string; city: string }[];
  story: StoryLine[];
  comprehensionQuestions: Question[];
  expressionComparison: ExpressionComparison[];
}

type ExerciseContent = DialogueContent | MatchingContent | FillBlankContent | StoryContent;

// Character colors
const characterColors: Record<string, string> = {
  Lucas: "from-blue-600 to-blue-800",
  Emily: "from-red-600 to-red-800",
  Aiko: "from-yellow-600 to-amber-700",
};

const characterBg: Record<string, string> = {
  Lucas: "bg-blue-500/10 border-blue-500/30",
  Emily: "bg-red-500/10 border-red-500/30",
  Aiko: "bg-yellow-500/10 border-yellow-500/30",
};

// Lesson selector page
function LessonSelector({ bookId }: { bookId: number }) {
  const { data, isLoading } = trpc.extraExercises.getExercisesByBook.useQuery({ bookId });

  const lessonGroups = useMemo(() => {
    if (!data?.exercises) return {};
    const groups: Record<number, typeof data.exercises> = {};
    for (const ex of data.exercises) {
      if (!groups[ex.lessonNumber]) groups[ex.lessonNumber] = [];
      groups[ex.lessonNumber].push(ex);
    }
    return groups;
  }, [data]);

  const lessonNames: Record<number, string> = {
    1: "First Day of Class",
    2: "A Few Days Later - Professions",
    3: "At Break - Food & Drinks",
    4: "At the End of the Class",
    5: "Communicative - Stories",
  };

  const lessonIcons: Record<number, string> = {
    1: "👋",
    2: "💼",
    3: "🍔",
    4: "📚",
    5: "🌍",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student/home">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">📖 Book 1 - Extra Exercises</h1>
            <p className="text-slate-400 text-sm">Pratique com Lucas 🇺🇸, Emily 🇬🇧 e Aiko 🇦🇺</p>
          </div>
        </div>

        {/* Lesson Cards */}
        <div className="space-y-4">
          {Object.entries(lessonGroups).map(([lessonNum, exercises]) => (
            <Link key={lessonNum} href={`/student/extra-exercises/1/${lessonNum}`}>
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{lessonIcons[Number(lessonNum)] || "📝"}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                          Lesson {lessonNum}: {lessonNames[Number(lessonNum)] || `Lesson ${lessonNum}`}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {exercises.length} exercícios disponíveis
                        </p>
                        <div className="flex gap-2 mt-2">
                          {exercises.some(e => e.type === "communicative") && (
                            <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                              <MessageCircle className="w-3 h-3 mr-1" /> Diálogos
                            </Badge>
                          )}
                          {exercises.some(e => e.type === "grammar") && (
                            <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                              <Pencil className="w-3 h-3 mr-1" /> Grammar
                            </Badge>
                          )}
                          {exercises.some(e => e.type === "vocabulary") && (
                            <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                              <BookOpen className="w-3 h-3 mr-1" /> Vocabulary
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!data?.exercises || data.exercises.length === 0) && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400">Nenhum exercício disponível ainda</h3>
            <p className="text-slate-500 mt-2">Os exercícios serão adicionados em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Dialogue Exercise Component
function DialogueExercise({ content }: { content: DialogueContent }) {
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const score = useMemo(() => {
    if (!showResults) return 0;
    return content.questions.filter((q, i) => answers[i] === q.correctIndex).length;
  }, [showResults, answers, content.questions]);

  return (
    <div className="space-y-6">
      {/* Character & Scenario */}
      <div className={`p-4 rounded-lg border ${characterBg[content.character] || "bg-slate-700/50 border-slate-600"}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{content.flag}</span>
          <div>
            <h3 className="font-bold text-white">{content.character} - {content.country}</h3>
            <p className="text-sm text-slate-300">{content.scenario}</p>
          </div>
        </div>
      </div>

      {/* Dialogue */}
      <div className="space-y-3">
        {content.dialogue.map((line, i) => (
          <div key={i} className={`flex gap-3 ${line.speaker === content.character ? "justify-end" : ""}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              line.speaker === content.character
                ? `bg-gradient-to-r ${characterColors[content.character] || "from-green-600 to-green-800"} text-white`
                : "bg-slate-700/70 text-slate-200"
            }`}>
              <p className="text-xs font-semibold mb-1 opacity-70">{line.speaker}</p>
              <p className="text-sm">{line.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cultural Note */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-amber-400 text-sm mb-2">🌍 Cultural Note</h4>
        <p className="text-sm text-slate-300">{content.culturalNote}</p>
      </div>

      {/* Accent Tip */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-purple-400 text-sm mb-2">🗣️ Accent Tip</h4>
        <p className="text-sm text-slate-300">{content.accentTip}</p>
      </div>

      {/* Questions */}
      {!showQuestions ? (
        <Button onClick={() => setShowQuestions(true)} className="w-full bg-green-600 hover:bg-green-700">
          Responder Perguntas ({content.questions.length})
        </Button>
      ) : (
        <div className="space-y-4">
          <h4 className="font-bold text-green-400">📝 Comprehension Questions</h4>
          {content.questions.map((q, qi) => (
            <div key={qi} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="font-medium text-white mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = showResults && oi === q.correctIndex;
                  const isWrong = showResults && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, oi)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                        isCorrect
                          ? "bg-green-500/20 border-green-500 text-green-300"
                          : isWrong
                          ? "bg-red-500/20 border-red-500 text-red-300"
                          : isSelected
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        {isWrong && <XCircle className="w-4 h-4 text-red-400" />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
              {showResults && q.explanation && (
                <p className="mt-2 text-xs text-slate-400 italic">💡 {q.explanation}</p>
              )}
            </div>
          ))}

          {!showResults && Object.keys(answers).length === content.questions.length && (
            <Button onClick={() => setShowResults(true)} className="w-full bg-green-600 hover:bg-green-700">
              Ver Resultado
            </Button>
          )}

          {showResults && (
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">
                {score}/{content.questions.length} corretas!
              </p>
              <p className="text-sm text-slate-400">
                {score === content.questions.length ? "🎉 Perfeito!" : score >= content.questions.length / 2 ? "👍 Bom trabalho!" : "📚 Continue praticando!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Matching Exercise Component
function MatchingExercise({ content }: { content: MatchingContent }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">{content.instruction}</p>
      <div className="space-y-3">
        {content.pairs.map((pair, i) => (
          <div
            key={i}
            onClick={() => setRevealed(prev => ({ ...prev, [i]: true }))}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">"{pair.expression}"</p>
              {revealed[i] ? (
                <Badge className="bg-green-600">{pair.country}</Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400 border-slate-600">Clique para revelar</Badge>
              )}
            </div>
            {revealed[i] && (
              <p className="text-xs text-slate-400 mt-2 italic">💡 {pair.explanation}</p>
            )}
          </div>
        ))}
      </div>
      {Object.keys(revealed).length < content.pairs.length && (
        <Button
          variant="outline"
          onClick={() => {
            const all: Record<number, boolean> = {};
            content.pairs.forEach((_, i) => { all[i] = true; });
            setRevealed(all);
          }}
          className="w-full"
        >
          Revelar Todos
        </Button>
      )}
    </div>
  );
}

// Fill in the Blank Exercise Component
function FillBlankExercise({ content }: { content: FillBlankContent }) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const score = useMemo(() => {
    if (!showResults) return 0;
    return content.sentences.filter((s, i) =>
      (userAnswers[i] || "").trim().toLowerCase() === s.answer.toLowerCase()
    ).length;
  }, [showResults, userAnswers, content.sentences]);

  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">{content.instruction}</p>
      <div className="space-y-4">
        {content.sentences.map((sentence, i) => {
          const isCorrect = showResults && (userAnswers[i] || "").trim().toLowerCase() === sentence.answer.toLowerCase();
          const isWrong = showResults && !isCorrect;
          return (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-white text-sm mb-2">{i + 1}. {sentence.text}</p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={userAnswers[i] || ""}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                  disabled={showResults}
                  placeholder="Type your answer..."
                  className={`flex-1 bg-slate-700/50 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    isCorrect
                      ? "border-green-500 focus:ring-green-500"
                      : isWrong
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-blue-500"
                  }`}
                />
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
                {isWrong && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              </div>
              {sentence.hint && !showResults && (
                <p className="text-xs text-slate-500 mt-1">💡 {sentence.hint}</p>
              )}
              {isWrong && (
                <p className="text-xs text-green-400 mt-1">✅ Resposta correta: <strong>{sentence.answer}</strong></p>
              )}
            </div>
          );
        })}
      </div>

      {!showResults ? (
        <Button onClick={() => setShowResults(true)} className="w-full bg-green-600 hover:bg-green-700">
          Verificar Respostas
        </Button>
      ) : (
        <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">
            {score}/{content.sentences.length} corretas!
          </p>
        </div>
      )}
    </div>
  );
}

// Story Exercise Component
function StoryExercise({ content }: { content: StoryContent }) {
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="space-y-6">
      {/* Characters */}
      <div className="flex gap-4 justify-center">
        {content.characters.map((char) => (
          <div key={char.name} className="text-center">
            <span className="text-3xl">{char.flag}</span>
            <p className="text-xs text-slate-400 mt-1">{char.name}</p>
            <p className="text-xs text-slate-500">{char.city}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="space-y-3">
        {content.story.map((line, i) => {
          if (line.speaker === "narrator") {
            return (
              <div key={i} className="text-center py-2">
                <p className="text-sm text-slate-400 italic">{line.text}</p>
              </div>
            );
          }
          const isLucas = line.speaker === "Lucas";
          const isEmily = line.speaker === "Emily";
          const isAiko = line.speaker === "Aiko";
          return (
            <div key={i} className={`flex gap-3 ${isLucas ? "" : isEmily ? "justify-center" : "justify-end"}`}>
              <div className={`max-w-[75%] p-3 rounded-lg ${
                isLucas ? "bg-blue-600/20 border border-blue-500/30" :
                isEmily ? "bg-red-600/20 border border-red-500/30" :
                isAiko ? "bg-yellow-600/20 border border-yellow-500/30" :
                "bg-slate-700/50"
              }`}>
                <p className="text-xs font-semibold mb-1 opacity-70">
                  {line.speaker} {isLucas ? "🇺🇸" : isEmily ? "🇬🇧" : isAiko ? "🇦🇺" : ""}
                </p>
                <p className="text-sm text-slate-200">{line.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expression Comparison */}
      <Button
        variant="outline"
        onClick={() => setShowComparison(!showComparison)}
        className="w-full"
      >
        <Globe className="w-4 h-4 mr-2" />
        {showComparison ? "Esconder" : "Ver"} Comparação de Expressões
      </Button>

      {showComparison && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-2 text-slate-400">Significado</th>
                <th className="text-left p-2 text-blue-400">🇺🇸 USA</th>
                <th className="text-left p-2 text-red-400">🇬🇧 UK</th>
                <th className="text-left p-2 text-yellow-400">🇦🇺 Australia</th>
              </tr>
            </thead>
            <tbody>
              {content.expressionComparison.map((row, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="p-2 text-slate-300">{row.meaning}</td>
                  <td className="p-2 text-blue-300">{row.usa}</td>
                  <td className="p-2 text-red-300">{row.uk}</td>
                  <td className="p-2 text-yellow-300">{row.australia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Questions */}
      {!showQuestions ? (
        <Button onClick={() => setShowQuestions(true)} className="w-full bg-green-600 hover:bg-green-700">
          Responder Perguntas ({content.comprehensionQuestions.length})
        </Button>
      ) : (
        <div className="space-y-4">
          {content.comprehensionQuestions.map((q, qi) => (
            <div key={qi} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="font-medium text-white mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = showResults && oi === q.correctIndex;
                  const isWrong = showResults && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, oi)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                        isCorrect ? "bg-green-500/20 border-green-500 text-green-300" :
                        isWrong ? "bg-red-500/20 border-red-500 text-red-300" :
                        isSelected ? "bg-blue-500/20 border-blue-500 text-blue-300" :
                        "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!showResults && Object.keys(answers).length === content.comprehensionQuestions.length && (
            <Button onClick={() => setShowResults(true)} className="w-full bg-green-600 hover:bg-green-700">
              Ver Resultado
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Exercise renderer
function ExerciseRenderer({ exercise }: { exercise: { id: number; title: string; description: string | null; type: string; content: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  let parsedContent: ExerciseContent | null = null;
  try {
    parsedContent = JSON.parse(exercise.content);
  } catch {
    return null;
  }

  if (!parsedContent) return null;

  const typeColors: Record<string, string> = {
    communicative: "text-green-400 border-green-500/50",
    vocabulary: "text-purple-400 border-purple-500/50",
    grammar: "text-blue-400 border-blue-500/50",
    reading: "text-amber-400 border-amber-500/50",
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader
        className="cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`text-xs ${typeColors[exercise.type] || "text-slate-400 border-slate-500/50"}`}>
              {exercise.type}
            </Badge>
            <CardTitle className="text-base text-white">{exercise.title}</CardTitle>
          </div>
          <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        </div>
        {exercise.description && (
          <p className="text-sm text-slate-400 mt-1">{exercise.description}</p>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <div className="border-t border-slate-700 pt-4">
            {parsedContent.exerciseType === "dialogue_practice" && (
              <DialogueExercise content={parsedContent as DialogueContent} />
            )}
            {parsedContent.exerciseType === "matching" && (
              <MatchingExercise content={parsedContent as MatchingContent} />
            )}
            {parsedContent.exerciseType === "fill_in_the_blank" && (
              <FillBlankExercise content={parsedContent as FillBlankContent} />
            )}
            {parsedContent.exerciseType === "story_reading" && (
              <StoryExercise content={parsedContent as StoryContent} />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Lesson exercises page
function LessonExercises({ bookId, lessonNumber }: { bookId: number; lessonNumber: number }) {
  const { data, isLoading } = trpc.extraExercises.getExercisesByLesson.useQuery({
    bookId,
    lessonNumber,
  });

  const lessonNames: Record<number, string> = {
    1: "First Day of Class",
    2: "A Few Days Later - Professions",
    3: "At Break - Food & Drinks",
    4: "At the End of the Class",
    5: "Communicative - Stories",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/student/extra-exercises">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Lesson {lessonNumber}: {lessonNames[lessonNumber] || `Lesson ${lessonNumber}`}
            </h1>
            <p className="text-slate-400 text-sm">
              {data?.count || 0} exercícios disponíveis
            </p>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {data?.exercises?.map((exercise) => (
            <ExerciseRenderer key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {(!data?.exercises || data.exercises.length === 0) && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400">Nenhum exercício para esta lição</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// Main page component with routing
export default function ExtraExercisesPage() {
  const [, lessonParams] = useRoute("/student/extra-exercises/:bookId/:lessonNumber");

  if (lessonParams?.bookId && lessonParams?.lessonNumber) {
    return (
      <LessonExercises
        bookId={Number(lessonParams.bookId)}
        lessonNumber={Number(lessonParams.lessonNumber)}
      />
    );
  }

  return <LessonSelector bookId={1} />;
}
