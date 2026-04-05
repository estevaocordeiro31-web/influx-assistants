import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CourseAccessValidatorProps {
  studentId?: number;
  onAccessChange?: (courseCode: string, hasAccess: boolean) => void;
}

interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  category: string;
  level: string;
  isPremium?: boolean;
  isNew?: boolean;
}

const availableCourses: Course[] = [
  {
    id: 1,
    code: "business-english",
    title: "Business English Masterclass",
    description: "Inglês para ambiente corporativo",
    category: "professional",
    level: "Advanced",
    isPremium: true,
  },
  {
    id: 2,
    code: "travel-english",
    title: "Travel English Essentials",
    description: "Vocabulário e frases para viagens",
    category: "travel",
    level: "Intermediate",
    isNew: true,
  },
  {
    id: 3,
    code: "medical-english",
    title: "Medical English for Professionals",
    description: "Inglês médico especializado",
    category: "professional",
    level: "Advanced",
    isPremium: true,
  },
  {
    id: 4,
    code: "conversational-english",
    title: "Conversational English Daily",
    description: "Conversação fluida do dia a dia",
    category: "conversation",
    level: "Intermediate",
  },
  {
    id: 5,
    code: "ielts-prep",
    title: "IELTS Preparation Course",
    description: "Preparação completa para IELTS",
    category: "exam",
    level: "Advanced",
    isPremium: true,
  },
  {
    id: 6,
    code: "movie-series-english",
    title: "Movie & Series English",
    description: "Aprenda com filmes e séries",
    category: "entertainment",
    level: "Intermediate",
    isNew: true,
  },
];

export function CourseAccessValidator({ studentId, onAccessChange }: CourseAccessValidatorProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Query para verificar acesso do aluno
  const { data: accessData, isLoading: accessLoading } = trpc.studentPersonalization.hasAccessToCourse.useQuery(
    { courseCode: "business-english" },
    { enabled: !!studentId }
  );

  const handleRequestAccess = async (courseCode: string) => {
    setIsLoading(true);
    try {
      // Simular requisição de acesso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSelectedCourses([...selectedCourses, courseCode]);
      onAccessChange?.(courseCode, true);
      
      // Toast de sucesso
      console.log(`Acesso solicitado para curso ${courseCode}`);
    } catch (error) {
      console.error("Erro ao solicitar acesso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAccess = (courseCode: string) => selectedCourses.includes(courseCode);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableCourses.map((course) => {
          const access = hasAccess(course.code);
          
          return (
            <Card
              key={course.id}
              className={`bg-slate-800/50 border-slate-700 transition-all duration-200 ${
                access ? "border-green-500/50" : "hover:border-slate-600"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base text-white truncate">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  {access && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  {course.isPremium && !access && (
                    <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs bg-slate-700/50"
                  >
                    {course.category}
                  </Badge>
                  {course.isNew && (
                    <Badge className="bg-green-500 text-white text-xs">
                      NOVO
                    </Badge>
                  )}
                  {course.isPremium && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 text-xs border-yellow-500/30">
                      PREMIUM
                    </Badge>
                  )}
                </div>

                {access ? (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    disabled
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Acesso Liberado
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                    onClick={() => handleRequestAccess(course.code)}
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {course.isPremium ? "Solicitar Acesso" : "Inscrever-se"}
                  </Button>
                )}

                {course.isPremium && !access && (
                  <div className="flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-300">
                      Curso premium. Solicite acesso para seu coordenador.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo de Acessos */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 mt-6">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Unlock className="w-4 h-4 text-blue-400" />
            Resumo de Acessos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {selectedCourses.length}
              </p>
              <p className="text-xs text-slate-400">Cursos Liberados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {availableCourses.length - selectedCourses.length}
              </p>
              <p className="text-xs text-slate-400">Disponíveis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {availableCourses.filter((c) => c.isPremium).length}
              </p>
              <p className="text-xs text-slate-400">Premium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {availableCourses.filter((c) => c.isNew).length}
              </p>
              <p className="text-xs text-slate-400">Novos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
