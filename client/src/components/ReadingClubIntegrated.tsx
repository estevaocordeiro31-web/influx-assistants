import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Zap, Play, Award } from "lucide-react";
import { BoogeymanExperience } from "./BoogeymanExperience";
import { BoogeymanPhotoGallery } from "./BoogeymanPhotoGallery";
import { ReadingClubFeed } from "./ReadingClubFeed";

export function ReadingClubIntegrated() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Hero Section com Material Gráfico */}
      <Card className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-green-500/30 overflow-hidden">
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/boogeyman-fluxie-hero.png"
              alt="Reading Club Boogeyman"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400 drop-shadow-lg">
              inFlux Reading Club
            </h1>
            <p className="text-lg text-slate-300">
              Explore histórias, aprenda expressões, ganhe influxcoin
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Badge className="bg-green-500 text-slate-900">📚 Leitura</Badge>
              <Badge className="bg-purple-500 text-white">🎭 Dramatização</Badge>
              <Badge className="bg-yellow-500 text-slate-900">💰 Recompensas</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900 text-slate-300"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger
            value="boogeyman"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900 text-slate-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Boogeyman</span>
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-slate-900 text-slate-300"
          >
            <Award className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ranking</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba: Feed */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <ReadingClubFeed />
        </TabsContent>

        {/* Aba: Boogeyman com Vídeos */}
        <TabsContent value="boogeyman" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Coluna Principal: Experiência Boogeyman + Galeria */}
            <div className="md:col-span-2 space-y-6">
              <BoogeymanExperience />
              <BoogeymanPhotoGallery />
            </div>

            {/* Coluna Lateral: Vídeos */}
            <div className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Vídeos
                  </CardTitle>
                  <CardDescription>Divulgação e eventos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vídeo Principal de Divulgação */}
                  <div className="space-y-2">
                    <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                      <video
                        controls
                        className="w-full h-full"
                        poster="/boogeyman-fluxie-hero.png"
                      >
                        <source src="/WhatsAppVideo2026-01-23at16.48.32.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeo.
                      </video>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100">
                        Lançamento do Reading Club
                      </h4>
                      <p className="text-sm text-slate-400">
                        Conheça a primeira atividade com "The Boogeyman"
                      </p>
                    </div>
                  </div>

                  {/* Placeholder para Mais Vídeos */}
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <h4 className="font-semibold text-slate-300 text-sm">
                      Próximos Vídeos
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Encontro Presencial #1",
                        "Dramatização do Boogeyman",
                        "Discussão com Alunos",
                      ].map((title, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-slate-800 rounded border border-slate-700 text-sm text-slate-400 hover:text-green-400 cursor-pointer transition"
                        >
                          <Play className="w-3 h-3 inline mr-2" />
                          {title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-slate-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Visualizações</span>
                      <span className="text-green-400 font-semibold">342</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Curtidas</span>
                      <span className="text-green-400 font-semibold">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Comentários</span>
                      <span className="text-green-400 font-semibold">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Box */}
              <Card className="bg-slate-800 border-purple-500/30">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/OwIgQozQmgnqPMOm.png" 
                        alt="Fluxie Thinking" 
                        className="w-10 h-10 object-contain"
                      />
                      <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10" />
                    </div>
                    <p className="text-sm text-slate-300">
                      <strong className="text-purple-400">💡 Dica do Fluxie:</strong> Assista aos vídeos para entender melhor a
                      atividade e ganhe <span className="text-green-400 font-bold">+2 influxcoin</span>!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Aba: Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4 mt-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400">🏆 Top Leitores</CardTitle>
              <CardDescription>Ranking de participação no Reading Club</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Maria Santos", coins: 145, badge: "🌟 Crítica Literária" },
                  { rank: 2, name: "João Silva", coins: 128, badge: "📚 Leitor Voraz" },
                  { rank: 3, name: "Ana Costa", coins: 112, badge: "🎭 Dramatizador" },
                  { rank: 4, name: "Pedro Oliveira", coins: 98, badge: "✍️ Escritor" },
                  { rank: 5, name: "Você", coins: 45, badge: "🌱 Iniciante" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-green-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.badge}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{user.coins}</p>
                      <p className="text-xs text-slate-400">influxcoin</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
