import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseAccessValidator } from "./CourseAccessValidator";
import { 
  FileText, Video, Headphones, BookOpen, Download, ExternalLink,
  Mic, PenTool, Globe, MessageSquare, Play, Clock, Star, Lock
} from "lucide-react";

interface Material {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "video" | "audio" | "link" | "interactive";
  category: string;
  duration?: string;
  level: string;
  isNew?: boolean;
  isPremium?: boolean;
  url?: string;
  thumbnail?: string;
}

const materials: Material[] = [
  { id: 1, title: "Verb Tenses Complete Guide", description: "Guia completo de todos os tempos verbais em inglês", type: "pdf", category: "grammar", level: "All Levels", isNew: true },
  { id: 2, title: "Phrasal Verbs Essentials", description: "Os 100 phrasal verbs mais usados no dia a dia", type: "pdf", category: "grammar", level: "Intermediate" },
  { id: 3, title: "Prepositions Made Easy", description: "Domine as preposições de uma vez por todas", type: "video", category: "grammar", duration: "25 min", level: "Beginner" },
  { id: 4, title: "Conditionals Workshop", description: "If clauses explicadas de forma simples", type: "video", category: "grammar", duration: "18 min", level: "Intermediate" },
  { id: 5, title: "Business English Vocabulary", description: "500+ palavras essenciais para o mundo corporativo", type: "pdf", category: "vocabulary", level: "Advanced", isPremium: true },
  { id: 6, title: "Travel English Pack", description: "Vocabulário completo para viagens internacionais", type: "pdf", category: "vocabulary", level: "Intermediate", isNew: true },
  { id: 7, title: "Idioms & Expressions", description: "Expressões idiomáticas mais usadas por nativos", type: "interactive", category: "vocabulary", level: "Upper-Intermediate" },
  { id: 8, title: "Slang Dictionary", description: "Gírias americanas e britânicas atualizadas", type: "pdf", category: "vocabulary", level: "Advanced" },
  { id: 9, title: "Podcast: Daily English", description: "Episódios diários para treinar listening", type: "audio", category: "listening", duration: "15 min/ep", level: "All Levels" },
  { id: 10, title: "TED Talks Curated", description: "Seleção de TED Talks com legendas e exercícios", type: "video", category: "listening", duration: "Varies", level: "Intermediate" },
  { id: 11, title: "News in Slow English", description: "Notícias narradas em velocidade reduzida", type: "audio", category: "listening", duration: "10 min/ep", level: "Beginner" },
  { id: 12, title: "Movie Clips Analysis", description: "Aprenda com cenas de filmes famosos", type: "video", category: "listening", duration: "8-12 min", level: "Upper-Intermediate", isNew: true },
  { id: 13, title: "Pronunciation Masterclass", description: "Domine a pronúncia americana", type: "video", category: "speaking", duration: "45 min", level: "All Levels" },
  { id: 14, title: "Connected Speech Guide", description: "Como falar inglês fluentemente como nativo", type: "video", category: "speaking", duration: "30 min", level: "Intermediate" },
  { id: 15, title: "Conversation Starters", description: "100 tópicos para praticar conversação", type: "pdf", category: "speaking", level: "Beginner" },
  { id: 16, title: "Accent Reduction", description: "Técnicas para reduzir sotaque brasileiro", type: "video", category: "speaking", duration: "35 min", level: "Advanced", isPremium: true },
  { id: 17, title: "Email Writing Templates", description: "Modelos de emails profissionais", type: "pdf", category: "writing", level: "Intermediate" },
  { id: 18, title: "Essay Structure Guide", description: "Como escrever redações em inglês", type: "pdf", category: "writing", level: "Advanced" },
  { id: 19, title: "Business Writing", description: "Escrita formal para ambiente corporativo", type: "interactive", category: "writing", level: "Advanced", isPremium: true },
  { id: 20, title: "American Culture 101", description: "Entenda a cultura americana", type: "video", category: "culture", duration: "40 min", level: "All Levels" },
  { id: 21, title: "British vs American English", description: "Diferenças entre inglês britânico e americano", type: "pdf", category: "culture", level: "Intermediate" },
  { id: 22, title: "Holidays & Traditions", description: "Feriados e tradições de países anglófonos", type: "video", category: "culture", duration: "25 min", level: "Beginner", isNew: true },
];

const categories = [
  { id: "all", label: "Todos", icon: BookOpen, color: "blue" },
  { id: "grammar", label: "Grammar", icon: PenTool, color: "green" },
  { id: "vocabulary", label: "Vocabulary", icon: MessageSquare, color: "purple" },
  { id: "listening", label: "Listening", icon: Headphones, color: "orange" },
  { id: "speaking", label: "Speaking", icon: Mic, color: "pink" },
  { id: "writing", label: "Writing", icon: FileText, color: "cyan" },
  { id: "culture", label: "Culture", icon: Globe, color: "yellow" },
];

export function MateriaisExtrasTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("materials");

  const filteredMaterials = materials.filter(m => {
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "audio": return <Headphones className="w-4 h-4" />;
      case "interactive": return <Play className="w-4 h-4" />;
      case "link": return <ExternalLink className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "video": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "audio": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "interactive": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "link": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getCategoryColor = (categoryId: string, isActive: boolean) => {
    const colors: Record<string, string> = {
      all: isActive ? "bg-blue-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      grammar: isActive ? "bg-green-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      vocabulary: isActive ? "bg-purple-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      listening: isActive ? "bg-orange-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      speaking: isActive ? "bg-pink-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      writing: isActive ? "bg-cyan-500 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
      culture: isActive ? "bg-yellow-500 text-slate-900" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
    };
    return colors[categoryId] || colors.all;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700 p-1">
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="courses">Cursos Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{materials.length}</p>
                <p className="text-xs text-slate-400">Materiais</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Video className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{materials.filter(m => m.type === "video").length}</p>
                <p className="text-xs text-slate-400">Vídeos</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{materials.filter(m => m.type === "pdf").length}</p>
                <p className="text-xs text-slate-400">PDFs</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{materials.filter(m => m.isNew).length}</p>
                <p className="text-xs text-slate-400">Novos</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap min-h-[44px] ${getCategoryColor(cat.id, isActive)} ${isActive ? 'shadow-lg' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 min-h-[48px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMaterials.map((material) => (
              <Card 
                key={material.id} 
                className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-200 ${material.isPremium ? 'relative overflow-hidden' : ''}`}
              >
                {material.isPremium && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    <Lock className="w-3 h-3 inline mr-1" />
                    PREMIUM
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(material.type)}`}>
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm truncate">{material.title}</h3>
                        {material.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{material.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {material.level}
                        </Badge>
                        {material.duration && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {material.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`min-h-[40px] min-w-[40px] ${material.isPremium ? 'border-yellow-500/50 text-yellow-400' : 'border-blue-500/50 text-blue-400'}`}
                      disabled={material.isPremium}
                    >
                      {material.type === "pdf" ? <Download className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Nenhum material encontrado</p>
                <p className="text-slate-500 text-sm">Tente ajustar os filtros ou a busca</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700 mb-4">
            <CardHeader>
              <CardTitle className="text-white">Cursos Extras Disponíveis</CardTitle>
              <CardDescription className="text-slate-400">
                Explore cursos especializados para complementar seu aprendizado
              </CardDescription>
            </CardHeader>
          </Card>
          <CourseAccessValidator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
