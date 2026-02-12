import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ProgressTrackerProps {
  category?: "professional" | "traveller" | "general";
  title?: string;
  showDetails?: boolean;
}

export function ProgressTracker({
  category = "professional",
  title = "Seu Progresso",
  showDetails = true,
}: ProgressTrackerProps) {
  const { data: categoryProgress, isLoading } =
    trpc.progressTracker.getCategoryProgress.useQuery(
      { category },
      { refetchInterval: 30000 } // Atualizar a cada 30 segundos
    );

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categoryProgress) {
    return null;
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "professional":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "traveller":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "general":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case "professional":
        return "💼";
      case "traveller":
        return "✈️";
      case "general":
        return "📚";
      default:
        return "📖";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <span>{getCategoryEmoji(category)}</span>
              {title}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {categoryProgress.completedTopics} de{" "}
              {categoryProgress.totalTopics} módulos concluídos
            </CardDescription>
          </div>
          <Badge className={getCategoryColor(category)}>
            {categoryProgress.completionPercentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de Progresso Principal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300 font-medium">Conclusão</span>
            <span className="text-slate-400">
              {categoryProgress.completedTopics}/{categoryProgress.totalTopics}
            </span>
          </div>
          <Progress
            value={categoryProgress.completionPercentage}
            className="h-3 bg-slate-700"
          />
        </div>

        {/* Estatísticas */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Progresso Médio</span>
              </div>
              <p className="text-lg font-bold text-white">
                {categoryProgress.averageProgress}%
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Tempo Total</span>
              </div>
              <p className="text-lg font-bold text-white">
                  {Math.round(categoryProgress.totalTimeSpentMinutes / 60)}h{" "}
                {categoryProgress.totalTimeSpentMinutes % 60}m
              </p>
            </div>
          </div>
        )}

        {/* Lista de Tópicos */}
        {showDetails && categoryProgress.topics.length > 0 && (
          <div className="space-y-2 border-t border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-slate-300">Tópicos</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categoryProgress.topics.map((topic) => (
                <div
                  key={topic.topicId}
                  className="flex items-center justify-between bg-slate-700/30 rounded p-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {topic.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-300 truncate">
                      {topic.topicName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                    {topic.progressPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando vazio */}
        {categoryProgress.totalTopics === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">Nenhum módulo iniciado ainda</p>
            <p className="text-xs mt-1">Comece a estudar para ver seu progresso</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Componente de Resumo Geral de Progresso
 */
export function ProgressSummary() {
  const { data: summary, isLoading } =
    trpc.progressTracker.getProgressSummary.useQuery(undefined, {
      refetchInterval: 30000,
    });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700 rounded-lg h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const categories = [
    { key: "professional" as const, label: "Profissional", emoji: "💼" },
    { key: "traveller" as const, label: "Viajante", emoji: "✈️" },
    { key: "general" as const, label: "Geral", emoji: "📚" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const stats = summary.byCategory[cat.key];
        return (
          <Card key={cat.key} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <span>{cat.emoji}</span>
                {cat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Conclusão</span>
                  <span className="text-slate-300 font-semibold">
                    {stats.completionPercentage}%
                  </span>
                </div>
                <Progress
                  value={stats.completionPercentage}
                  className="h-2 bg-slate-700"
                />
              </div>
              <div className="text-xs text-slate-400">
                <p>
                  {stats.completed} de {stats.total} módulos
                </p>
                <p className="mt-1">
                  {Math.round(stats.totalTimeSpent / 60)}h de estudo
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
