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