import { useState } from "react";
import { LessonPractice } from "@/components/LessonPractice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, TrendingUp, RotateCcw, Star, Flame, 
  Plane, FileText, CheckCircle2, Clock, Award, Zap, Target
} from "lucide-react";
import { useLocation } from "wouter";
import TipOfDayWidget from "@/components/TipOfDayWidget";
import RecommendedTipsSection from "@/components/RecommendedTipsSection";
import MyFavoriteTips from "@/components/MyFavoriteTips";
import BadgesDisplay from "@/components/BadgesDisplay";
import { ExclusiveMaterialsSection } from "@/components/ExclusiveMaterialsSection";
import { VacationPlus2Content } from "@/components/VacationPlus2Content";
import { AllBooksProgress } from "@/components/AllBooksProgress";
import { MateriaisExtrasTab } from "@/components/MateriaisExtrasTab";
import { trpc } from "@/lib/trpc";

interface MeuTutorTabProps {
  studentData: {
    currentBook: string;
    currentUnit: number;
    totalUnits: number;
    progressPercentage: number;
    totalChunksLearned: number;
    completedBooks: Array<{
      id: number;
      name: string;
      level: string;
      completedAt: string | null;
      hoursSpent: number;
      chunksLearned: number;
      progress: number;
    }>;
    recentChunks: Array<{
      text: string;
      meaning: string;
      context: string;
    }>;
  };
}

export function MeuTutorTab({ studentData }: MeuTutorTabProps) {
  const [, setLocation] = useLocation();
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState("books");

  // Buscar dicas do blog
  const { data: tipOfDayData, isLoading: tipLoading } = trpc.blogTips.getTipOfDay.useQuery();
  const { data: recommendedTipsData, isLoading: recommendedLoading } = trpc.blogTips.getRecommendedTips.useQuery({});

  const subTabs = [
    { id: "books", label: "Meus Livros", icon: TrendingUp, color: "green" },
    { id: "practice", label: "Praticar", icon: Target, color: "yellow" },
    { id: "vacation2", label: "Vacation 2", icon: Plane, color: "cyan" },
    { id: "review", label: "Revisão", icon: RotateCcw, color: "purple" },
    { id: "blog", label: "Blog", icon: BookOpen, color: "orange" },
    { id: "materials", label: "Materiais", icon: FileText, color: "pink" },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-navegação horizontal com scroll em mobile */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            const colorClasses: Record<string, string> = {
              green: isActive ? "bg-green-500 text-white shadow-green-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
              yellow: isActive ? "bg-yellow-500 text-slate-900 shadow-yellow-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
              cyan: isActive ? "bg-gradient-to-r from-cyan-500 via-green-500 to-purple-500 text-white shadow-cyan-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
              purple: isActive ? "bg-purple-500 text-white shadow-purple-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
              orange: isActive ? "bg-orange-500 text-white shadow-orange-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
              pink: isActive ? "bg-pink-500 text-white shadow-pink-500/50" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${colorClasses[tab.color]} ${isActive ? 'shadow-lg' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das sub-abas */}
      {activeSubTab === "books" && (
        <AllBooksProgress />
      )}

      {activeSubTab === "practice" && (
        <LessonPractice currentBookId={5} />
      )}

      {activeSubTab === "vacation2" && (
        <VacationPlus2Content />
      )}

      {activeSubTab === "review" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-400" />
              Chunks para Revisão
            </CardTitle>
            <CardDescription className="text-slate-400">
              Expressões que você precisa praticar novamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.recentChunks.map((chunk, index) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-bold">{chunk.text}</p>
                      <p className="text-green-400 text-sm">{chunk.meaning}</p>
                      <p className="text-slate-400 text-xs mt-1 italic">"{chunk.context}"</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-purple-400 border-purple-400">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold">
              <RotateCcw className="w-4 h-4 mr-2" />
              Ver Todos os Chunks para Revisão
            </Button>
          </CardContent>
        </Card>
      )}

      {activeSubTab === "blog" && (
        <div className="space-y-4">
          {/* Dica do Dia */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Dica do Dia
            </h3>
            <TipOfDayWidget 
              tip={tipOfDayData?.tip || undefined} 
              isLoading={tipLoading}
              onViewMore={setSelectedTip}
            />
          </div>

          {/* Dicas Recomendadas */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Dicas Recomendadas para Você
            </h3>
            <RecommendedTipsSection 
              tips={recommendedTipsData?.tips || []} 
              isLoading={recommendedLoading}
              onViewMore={setSelectedTip}
            />
          </div>

          {/* Meus Favoritos */}
          <MyFavoriteTips />

          {/* Minhas Conquistas */}
          <BadgesDisplay />

          {/* Link para Blog */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-6">
              <div className="text-center">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/miss-elie-uniform-avatar_17347370.jpg" alt="Miss Elie" loading="lazy" className="w-20 h-20 mx-auto mb-3 rounded-full object-cover border-2 border-orange-500/40" />
                <p className="text-slate-300 mb-4">Explore mais dicas do blog para complementar seus estudos</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Visitar Blog inFlux
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSubTab === "materials" && (
        <MateriaisExtrasTab />
      )}
    </div>
  );
}
