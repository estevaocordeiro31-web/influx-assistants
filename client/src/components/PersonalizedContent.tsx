import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, TrendingUp, Flame } from "lucide-react";

export function PersonalizedContent() {
  const [activeTab, setActiveTab] = useState<"suggestions" | "chunks" | "progress">("suggestions");

  // Queries
  const suggestionsQuery = trpc.personalizedContent.getPersonalizedSuggestions.useQuery();
  const progressQuery = trpc.personalizedContent.getProgressStats.useQuery();
  const chunksQuery = trpc.personalizedContent.getChunksByLevel.useQuery({
    limit: 10,
  });

  if (suggestionsQuery.isLoading || progressQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const suggestions = suggestionsQuery.data;
  const progress = progressQuery.data;
  const chunks = chunksQuery.data;

  const getBookColor = (book: number) => {
    const colors = {
      1: "bg-lime-100 text-lime-900 border-lime-300",
      2: "bg-sky-100 text-sky-900 border-sky-300",
      3: "bg-purple-100 text-purple-900 border-purple-300",
      4: "bg-orange-100 text-orange-900 border-orange-300",
      5: "bg-red-100 text-red-900 border-red-300",
    };
    return colors[book as keyof typeof colors] || colors[1];
  };

  return (
    <div className="space-y-6">
      {/* Header com nível e progresso */}
      {progress && (
        <div className={`rounded-lg p-6 ${getBookColor(progress.book)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book {progress.book}</h2>
              <p className="text-sm opacity-75 capitalize">{progress.level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{progress.hoursLearned}h</div>
              <p className="text-sm opacity-75">horas aprendidas</p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Próximo marco</span>
              <span className="text-sm">{progress.nextMilestoneHours}h</span>
            </div>
            <div className="w-full bg-black/10 rounded-full h-2">
              <div
                className="bg-current h-2 rounded-full transition-all"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-75">{progress.nextMilestone}</p>
          </div>

          {/* Streak */}
          {progress.streakDays > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">{progress.streakDays} dias seguidos!</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["suggestions", "chunks", "progress"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "suggestions" && "Sugestões"}
            {tab === "chunks" && "Chunks"}
            {tab === "progress" && "Progresso"}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "suggestions" && suggestions && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sugestões para seu nível
          </h3>
          <div className="grid gap-3">
            {suggestions.suggestions.map((suggestion, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <p className="text-sm">{suggestion}</p>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">{suggestions.message}</p>
        </div>
      )}

      {activeTab === "chunks" && chunks && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Chunks do seu nível ({chunks.total})
          </h3>
          <div className="grid gap-3">
            {chunks.chunks.map((chunk) => (
              <Card key={chunk.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-blue-600">{chunk.englishChunk}</p>
                      <p className="text-sm text-gray-600">{chunk.portugueseEquivalent}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {chunk.nativeUsageFrequency.replace("_", " ")}
                    </Badge>
                  </div>
                  {chunk.example && (
                    <p className="text-sm italic text-gray-500">Ex: {chunk.example}</p>
                  )}
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {chunk.context.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "progress" && progress && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Seu Progresso</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Horas Aprendidas</p>
              <p className="text-3xl font-bold">{progress.hoursLearned}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Dias Seguidos</p>
              <p className="text-3xl font-bold">{progress.streakDays}</p>
            </Card>
            <Card className="p-4 col-span-2">
              <p className="text-sm text-gray-600 mb-2">Nível Atual</p>
              <p className="text-2xl font-bold capitalize">{progress.level}</p>
              <p className="text-sm text-gray-500 mt-2">Book {progress.book}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
