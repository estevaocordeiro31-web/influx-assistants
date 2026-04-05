import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";

interface BlogTip {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  url: string;
  date: string;
}

interface TipOfDayWidgetProps {
  tip?: BlogTip;
  isLoading?: boolean;
  onViewMore?: (tip: BlogTip) => void;
}

export default function TipOfDayWidget({ tip, isLoading, onViewMore }: TipOfDayWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/30 rounded-lg animate-pulse">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tip) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/OwIgQozQmgnqPMOm.png" 
                alt="Fluxie Thinking" 
                className="w-12 h-12 object-contain"
              />
              <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full -z-10" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                Dica do Dia
                <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
                  {tip.category}
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                {new Date(tip.date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h3 className="text-white font-semibold text-sm leading-tight mb-2">{tip.title}</h3>
          <p className={`text-slate-300 text-sm leading-relaxed ${!isExpanded && "line-clamp-2"}`}>
            {tip.description}
          </p>
        </div>

        {tip.keywords && tip.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tip.keywords.slice(0, 3).map((keyword, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              >
                #{keyword}
              </Badge>
            ))}
            {tip.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-400">
                +{tip.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            onClick={() => onViewMore?.(tip)}
          >
            <ChevronRight className="w-3 h-3 mr-1" />
            Ler Mais
          </Button>
          <Button
            size="sm"
            asChild
            className="flex-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
          >
            <a href={tip.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Blog
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
