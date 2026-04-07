import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Globe, MessageSquare, Sparkles } from "lucide-react";
import { ChunkCard } from "./ChunkCard";
import { CulturalFactCard } from "./CulturalFactCard";
import { ALL_CHUNKS, ALL_CULTURAL_FACTS } from "@/data/vacation-plus-2-expanded";

interface LessonExpandedContentProps {
  lessonId: number;
  lessonTitle: string;
}

export function LessonExpandedContent({ lessonId, lessonTitle }: LessonExpandedContentProps) {
  const [activeTab, setActiveTab] = useState("chunks");
  
  const chunks = ALL_CHUNKS[lessonId as keyof typeof ALL_CHUNKS] || [];
  const culturalFacts = ALL_CULTURAL_FACTS[lessonId as keyof typeof ALL_CULTURAL_FACTS] || [];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger 
            value="chunks" 
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chunks
          </TabsTrigger>
          <TabsTrigger 
            value="cultural" 
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Globe className="h-4 w-4 mr-2" />
            Curiosidades
          </TabsTrigger>
          <TabsTrigger 
            value="real-language" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Real Language
          </TabsTrigger>
        </TabsList>

        {/* Tab: Chunks */}
        <TabsContent value="chunks" className="mt-4">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-400" />
                <span className="text-white">Expressões da Lição</span>
                <Badge variant="outline" className="text-green-400 border-green-400/50 ml-auto">
                  {chunks.length} chunks
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-400">
                Clique nos cards para ver exemplos em US, UK e AU English. Use os botões de áudio para ouvir a pronúncia!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chunks.map((chunk) => (
                  <ChunkCard key={chunk.id} chunk={chunk} lessonId={lessonId} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Curiosidades Culturais */}
        <TabsContent value="cultural" className="mt-4">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span className="text-white">Curiosidades Culturais</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400/50 ml-auto">
                  {culturalFacts.length} fatos
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-400">
                Descubra fatos interessantes sobre Nova York, Londres e Sydney relacionados ao tema da lição!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {culturalFacts.map((fact) => (
                  <CulturalFactCard key={fact.id} fact={fact} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Real Language */}
        <TabsContent value="real-language" className="mt-4">
          <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    Real Language
                  </CardTitle>
                  <p className="text-sm text-purple-300">
                    O inglês que você realmente vai ouvir nas ruas!
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connected Speech Section */}
              <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  🗣️ Connected Speech
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  Na fala rápida, as palavras se conectam e mudam de som. Veja como os nativos realmente falam:
                </p>
                <div className="space-y-2">
                  {chunks.slice(0, 3).map((chunk) => (
                    chunk.connectedSpeech && (
                      <div key={chunk.id} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                        <span className="text-white font-medium">{chunk.expression}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-green-400 font-mono text-sm">{chunk.connectedSpeech.split("→")[1]}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Diferenças US vs UK vs AU */}
              <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  🌍 Diferenças Regionais
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  A mesma ideia, três formas diferentes de expressar:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-blue-400 font-medium">Americano</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Mais informal e direto</li>
                      <li>• Usa muitas gírias</li>
                      <li>• "Gonna", "wanna", "gotta"</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇬🇧</span>
                      <span className="text-red-400 font-medium">Britânico</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Mais formal e educado</li>
                      <li>• Understatement</li>
                      <li>• "Rather", "quite", "lovely"</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇦🇺</span>
                      <span className="text-yellow-400 font-medium">Australiano</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Super informal e amigável</li>
                      <li>• Abreviações em tudo</li>
                      <li>• "Mate", "reckon", "heaps"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dica do Dia */}
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
                  💡 Dica de Ouro
                </h4>
                <p className="text-sm text-slate-300">
                  <strong className="text-green-400">Brasileiros pensam como americanos!</strong> Nossa forma de expressar emoções e usar linguagem informal é muito parecida com o inglês americano. Você já tem a mentalidade certa - agora é só aprender as palavras!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
