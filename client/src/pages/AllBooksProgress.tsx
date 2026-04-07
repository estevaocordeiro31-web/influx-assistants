import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, CheckCircle2, Clock, Lock, Star, 
  ChevronDown, ChevronUp, Award, Zap, Target
} from "lucide-react";

interface BookData {
  id: number;
  name: string;
  level: string;
  status: "completed" | "in_progress" | "locked";
  progress: number;
  totalUnits: number;
  completedUnits: number;
  chunksLearned: number;
  totalChunks: number;
  hoursSpent: number;
  completedAt?: string;
  units?: Array<{
    id: number;
    name: string;
    progress: number;
    chunksLearned: number;
  }>;
}

// Dados de todos os 12 livros inFlux
const allBooks: BookData[] = [
  // Junior Series
  { 
    id: 1, name: "Junior Starter A", level: "Kids", status: "completed", 
    progress: 100, totalUnits: 8, completedUnits: 8, chunksLearned: 45, totalChunks: 45, hoursSpent: 24,
    completedAt: "2023-03-15"
  },
  { 
    id: 2, name: "Junior Starter B", level: "Kids", status: "completed", 
    progress: 100, totalUnits: 8, completedUnits: 8, chunksLearned: 52, totalChunks: 52, hoursSpent: 28,
    completedAt: "2023-06-20"
  },
  { 
    id: 3, name: "Junior 1", level: "Kids", status: "completed", 
    progress: 100, totalUnits: 10, completedUnits: 10, chunksLearned: 68, totalChunks: 68, hoursSpent: 36,
    completedAt: "2023-09-10"
  },
  { 
    id: 4, name: "Junior 2", level: "Kids", status: "completed", 
    progress: 100, totalUnits: 10, completedUnits: 10, chunksLearned: 75, totalChunks: 75, hoursSpent: 40,
    completedAt: "2023-12-05"
  },
  { 
    id: 5, name: "Junior 3", level: "Kids", status: "completed", 
    progress: 100, totalUnits: 10, completedUnits: 10, chunksLearned: 82, totalChunks: 82, hoursSpent: 44,
    completedAt: "2024-03-18"
  },
  // Série Regular (CEFR)
  { 
    id: 6, name: "Book 1", level: "A1", status: "completed", 
    progress: 100, totalUnits: 12, completedUnits: 12, chunksLearned: 120, totalChunks: 120, hoursSpent: 60,
    completedAt: "2024-06-22"
  },
  { 
    id: 7, name: "Book 2", level: "A2", status: "completed", 
    progress: 100, totalUnits: 12, completedUnits: 12, chunksLearned: 135, totalChunks: 135, hoursSpent: 65,
    completedAt: "2024-09-15"
  },
  { 
    id: 8, name: "Book 3", level: "B1", status: "completed", 
    progress: 100, totalUnits: 12, completedUnits: 12, chunksLearned: 148, totalChunks: 148, hoursSpent: 70,
    completedAt: "2024-12-10"
  },
  { 
    id: 9, name: "Book 4", level: "B2", status: "completed", 
    progress: 100, totalUnits: 12, completedUnits: 12, chunksLearned: 156, totalChunks: 156, hoursSpent: 75,
    completedAt: "2025-03-20"
  },
  { 
    id: 10, name: "Book 5", level: "C1", status: "in_progress", 
    progress: 67, totalUnits: 12, completedUnits: 8, chunksLearned: 108, totalChunks: 162, hoursSpent: 52,
    units: [
      { id: 1, name: "Unit 1 - Friends and Acquaintances", progress: 100, chunksLearned: 13 },
      { id: 2, name: "Unit 2 - Friends and Acquaintances", progress: 100, chunksLearned: 6 },
      { id: 3, name: "Unit 3 - Family and Relationship", progress: 100, chunksLearned: 12 },
      { id: 4, name: "Unit 4 - Family and Relationship", progress: 100, chunksLearned: 5 },
      { id: 5, name: "Unit 5 - Shapes and Colors", progress: 100, chunksLearned: 15 },
      { id: 6, name: "Unit 6 - Shapes and Colors", progress: 100, chunksLearned: 12 },
      { id: 7, name: "Unit 7 - Health and Body", progress: 100, chunksLearned: 14 },
      { id: 8, name: "Unit 8 - Health and Body", progress: 75, chunksLearned: 10 },
      { id: 9, name: "Unit 9 - Travel and Tourism", progress: 0, chunksLearned: 0 },
      { id: 10, name: "Unit 10 - Travel and Tourism", progress: 0, chunksLearned: 0 },
      { id: 11, name: "Unit 11 - Business and Work", progress: 0, chunksLearned: 0 },
      { id: 12, name: "Unit 12 - Business and Work", progress: 0, chunksLearned: 0 },
    ]
  },
  // Cursos Avançados
  { 
    id: 11, name: "Conversação Avançada", level: "C1-C2", status: "locked", 
    progress: 0, totalUnits: 10, completedUnits: 0, chunksLearned: 0, totalChunks: 100, hoursSpent: 0
  },
  { 
    id: 12, name: "Business English", level: "B2-C1", status: "locked", 
    progress: 0, totalUnits: 10, completedUnits: 0, chunksLearned: 0, totalChunks: 120, hoursSpent: 0
  },
];

interface AllBooksProgressProps {
  studentId?: string;
}

export function AllBooksProgress({ studentId }: AllBooksProgressProps) {
  const [expandedBook, setExpandedBook] = useState<number | null>(10); // Book 5 expandido por padrão
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Calcular estatísticas totais
  const totalChunksLearned = allBooks.reduce((sum, book) => sum + book.chunksLearned, 0);
  const totalHoursSpent = allBooks.reduce((sum, book) => sum + book.hoursSpent, 0);
  const completedBooks = allBooks.filter(b => b.status === "completed").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in_progress": return <Clock className="w-5 h-5 text-yellow-400" />;
      case "locked": return <Lock className="w-5 h-5 text-slate-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 border-green-500/30";
      case "in_progress": return "bg-yellow-500/10 border-yellow-500/30";
      case "locked": return "bg-slate-700/30 border-slate-600/30 opacity-60";
      default: return "";
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "Kids": "bg-pink-500/20 text-pink-300 border-pink-500/30",
      "Beginner": "bg-green-500/20 text-green-300 border-green-500/30",
      "Elementary": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Pre-Intermediate": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Intermediate": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Upper-Intermediate": "bg-orange-500/20 text-orange-300 border-orange-500/30",
      "Advanced": "bg-red-500/20 text-red-300 border-red-500/30",
      "Proficient": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    };
    return colors[level] || "bg-slate-500/20 text-slate-300";
  };

  return (
    <div className="space-y-4">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{completedBooks}</p>
            <p className="text-xs text-slate-400">Livros Completos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalChunksLearned}</p>
            <p className="text-xs text-slate-400">Chunks Aprendidos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalHoursSpent}h</p>
            <p className="text-xs text-slate-400">Horas de Estudo</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Upper-Int</p>
            <p className="text-xs text-slate-400">Nível Atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Livro Atual em Destaque */}
      <Card className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-500/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Book 5 - Upper-Intermediate</CardTitle>
                <CardDescription className="text-yellow-300/70">
                  Livro atual • Unit 8 de 12
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-slate-900 font-bold">EM ANDAMENTO</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-300">Progresso Geral</span>
              <span className="text-sm font-bold text-yellow-400">67%</span>
            </div>
            <Progress value={67} className="h-3 bg-slate-700" />
          </div>
          <div className="flex gap-4 text-sm text-slate-400">
            <span>📚 8/12 units</span>
            <span>🧠 108 chunks</span>
            <span>⏱️ 52h estudadas</span>
          </div>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold min-h-[48px]">
            <Zap className="w-4 h-4 mr-2" />
            Continuar Unit 8
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Todos os Livros */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Todos os Livros ({allBooks.length})
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sua jornada completa de aprendizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {allBooks.map((book) => (
            <div key={book.id}>
              <button
                onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 ${getStatusColor(book.status)} ${
                  book.status !== "locked" ? "hover:bg-slate-700/50 cursor-pointer" : "cursor-not-allowed"
                }`}
                disabled={book.status === "locked"}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(book.status)}
                    <div className="text-left">
                      <span className="font-bold text-white">{book.name}</span>
                      <Badge variant="outline" className={`ml-2 text-xs ${getLevelColor(book.level)}`}>
                        {book.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {book.status !== "locked" && (
                      <>
                        <span className="text-sm text-slate-400">{book.progress}%</span>
                        {expandedBook === book.id ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </>
                    )}
                  </div>
                </div>
                {book.status !== "locked" && (
                  <Progress value={book.progress} className="h-2 bg-slate-700 mt-2" />
                )}
              </button>

              {/* Detalhes expandidos */}
              {expandedBook === book.id && book.status !== "locked" && (
                <div className="mt-2 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <p className="text-slate-400">Units</p>
                      <p className="text-white font-bold">{book.completedUnits}/{book.totalUnits}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <p className="text-slate-400">Chunks</p>
                      <p className="text-white font-bold">{book.chunksLearned}/{book.totalChunks}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <p className="text-slate-400">Horas</p>
                      <p className="text-white font-bold">{book.hoursSpent}h</p>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <p className="text-slate-400">Status</p>
                      <p className={`font-bold ${book.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>
                        {book.status === "completed" ? "Completo" : "Em Andamento"}
                      </p>
                    </div>
                  </div>

                  {/* Units do livro atual */}
                  {book.units && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400 font-semibold">Units:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {book.units.map((unit) => (
                          <div 
                            key={unit.id} 
                            className={`p-2 rounded border ${
                              unit.progress === 100 
                                ? "bg-green-500/10 border-green-500/30" 
                                : unit.progress > 0 
                                  ? "bg-yellow-500/10 border-yellow-500/30"
                                  : "bg-slate-700/30 border-slate-600/30"
                            }`}
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className={unit.progress === 0 ? "text-slate-500" : "text-white"}>
                                {unit.name}
                              </span>
                              <span className={`font-bold ${
                                unit.progress === 100 ? "text-green-400" : 
                                unit.progress > 0 ? "text-yellow-400" : "text-slate-500"
                              }`}>
                                {unit.progress}%
                              </span>
                            </div>
                            <Progress value={unit.progress} className="h-1 bg-slate-700 mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {book.completedAt && (
                    <p className="text-xs text-slate-500 text-center">
                      Concluído em {new Date(book.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
