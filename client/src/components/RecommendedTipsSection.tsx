import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlogTip {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  url: string;
  date: string;
}

interface RecommendedTipsSectionProps {
  tips: BlogTip[];
  isLoading?: boolean;
  onViewMore?: (tip: BlogTip) => void;
}

export default function RecommendedTipsSection({
  tips,
  isLoading,
  onViewMore,
}: RecommendedTipsSectionProps) {
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Dicas Recomendadas para Você
          </CardTitle>
          <CardDescription className="text-slate-400">
            Baseado em suas dificuldades recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tips || tips.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Dicas Recomendadas para Você
          </CardTitle>
          <CardDescription className="text-slate-400">
            Baseado em suas dificuldades recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm text-center py-8">
            Nenhuma dica recomendada no momento. Continue praticando para receber sugestões personalizadas!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Dicas Recomendadas para Você
        </CardTitle>
        <CardDescription className="text-slate-400">
          Baseado em suas dificuldades recentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="space-y-3 pr-4">
            {tips.map((tip, idx) => (
              <div
                key={tip.id}
                className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-purple-400">#{idx + 1}</span>
                      <Badge
                        variant="outline"
                        className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                      >
                        {tip.category}
                      </Badge>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {tip.title}
                    </h4>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-2">{tip.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {tip.keywords.slice(0, 2).map((keyword, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs bg-slate-700/50 text-slate-300"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      onClick={() => onViewMore?.(tip)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    >
                      <a href={tip.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
