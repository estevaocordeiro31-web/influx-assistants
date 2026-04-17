import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ExternalLink, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function BlogTips() {
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  // Obter dica do dia
  const { data: tipOfDay } = trpc.blogTips.getTipOfDay.useQuery();

  // Obter todas as dicas
  const { data: allTips } = trpc.blogTips.getAllTips.useQuery();

  // Obter dicas recomendadas
  const { data: recommendedTips } = trpc.blogTips.getRecommendedTips.useQuery(
    { difficulties: difficulties.length > 0 ? difficulties : undefined },
    { enabled: difficulties.length > 0 }
  );

  // Enviar notificação
  const sendNotification = trpc.blogTips.sendTipNotification.useMutation();

  const handleSendNotification = async (tipId: string) => {
    await sendNotification.mutateAsync({
      tipId,
      message: "Dica enviada com sucesso!",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)', fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }} className="text-white">Dicas do Blog inFlux</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Aprenda com dicas diarias do blog e recomendacoes personalizadas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dica do Dia */}
            {tipOfDay?.tip && (
              <Card className="overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,75,0.15)', backdropFilter: 'blur(20px)', borderRadius: 20 }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(106,191,75,0.1), rgba(77,168,255,0.05))', padding: 20 }}>
                  <Badge className="bg-green-500/30 text-green-300 border-green-500/50 mb-2">
                    Dica do Dia
                  </Badge>
                  <h2 className="text-2xl font-bold text-white">{tipOfDay.tip.title}</h2>
                </div>
                <CardContent className="pt-6">
                  <p className="text-slate-300 mb-4">{tipOfDay.tip.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tipOfDay.tip.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="border-slate-600 text-slate-300">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(tipOfDay.tip.url, "_blank")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ler Artigo Completo
                    </Button>
                    <Button
                      onClick={() => handleSendNotification(tipOfDay.tip.id)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dicas Recomendadas */}
            {recommendedTips && recommendedTips.tips.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Recomendado para Você</h3>
                <div className="space-y-4">
                  {recommendedTips.tips.map((tip) => (
                    <Card
                      key={tip.id}
                      className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTip(tip)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="bg-orange-500/30 text-orange-300 border-orange-500/50 mb-2">
                              {tip.category}
                            </Badge>
                            <CardTitle className="text-white">{tip.title}</CardTitle>
                            <CardDescription className="text-slate-400">{tip.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-3">{tip.description}</p>
                        <Button
                          onClick={() => window.open(tip.url, "_blank")}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Ler Mais
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Todas as Dicas */}
            {allTips && allTips.tips.length > 0 && !recommendedTips?.tips.length && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Todas as Dicas</h3>
                <div className="space-y-4">
                  {allTips.tips.slice(0, 5).map((tip) => (
                    <Card
                      key={tip.id}
                      className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTip(tip)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50 mb-2">
                              {tip.category}
                            </Badge>
                            <CardTitle className="text-white text-lg">{tip.title}</CardTitle>
                            <CardDescription className="text-slate-400">{tip.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm">{tip.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dica Selecionada */}
            {selectedTip && (
              <Card className="bg-slate-800/50 border-slate-700 sticky top-4">
                <CardHeader>
                  <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50 mb-2 w-fit">
                    {selectedTip.category}
                  </Badge>
                  <CardTitle className="text-white">{selectedTip.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{selectedTip.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTip.keywords.map((keyword: string) => (
                      <Badge key={keyword} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={() => window.open(selectedTip.url, "_blank")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Artigo
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Categorias */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Chunks", "Phrasal Verbs", "Vocabulário", "Pronúncia", "Gramática"].map((category) => (
                  <Button
                    key={category}
                    onClick={() => setDifficulties([category])}
                    variant={difficulties.includes(category) ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
