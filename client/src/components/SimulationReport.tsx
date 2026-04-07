import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, Target, Lightbulb, BookOpen, 
  TrendingUp, Award, CheckCircle, XCircle, 
  RefreshCw, Share2, Download, ChevronRight
} from "lucide-react";
import { type Situation } from "../../../shared/situations";

interface SimulationReportProps {
  situation: Situation;
  score: number;
  chunksUsed: string[];
  totalMessages: number;
  startTime: Date;
  endTime: Date;
  onNewSimulation: () => void;
  onTryAgain: () => void;
  onShare?: () => void;
}

interface PerformanceMetric {
  label: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  description: string;
}

export function SimulationReport({
  situation,
  score,
  chunksUsed,
  totalMessages,
  startTime,
  endTime,
  onNewSimulation,
  onTryAgain,
  onShare,
}: SimulationReportProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Calcular métricas
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = duration % 60;
  
  const totalChunks = situation.keyChunks.length;
  const chunksUsedCount = chunksUsed.length;
  const chunkPercentage = Math.round((chunksUsedCount / totalChunks) * 100);
  
  const totalDialogues = situation.dialogueStarters.length;
  const dialogueCompletion = Math.min(100, Math.round((totalMessages / (totalDialogues * 2)) * 100));
  
  // Calcular pontuação geral (0-100)
  const overallScore = Math.min(100, Math.round(
    (score * 0.4) + // Pontos por chunks (40%)
    (chunkPercentage * 0.3) + // Uso de chunks (30%)
    (dialogueCompletion * 0.3) // Completude do diálogo (30%)
  ));

  // Determinar nível de desempenho
  const getPerformanceLevel = (score: number): { level: string; color: string; emoji: string; message: string } => {
    if (score >= 90) return { level: "Mestre", color: "text-yellow-400", emoji: "🏆", message: "Incrível! Você dominou esta situação!" };
    if (score >= 75) return { level: "Avançado", color: "text-green-400", emoji: "⭐", message: "Excelente! Continue assim!" };
    if (score >= 60) return { level: "Intermediário", color: "text-blue-400", emoji: "👍", message: "Muito bom! Você está progredindo!" };
    if (score >= 40) return { level: "Em Progresso", color: "text-orange-400", emoji: "📈", message: "Bom começo! Pratique mais para melhorar." };
    return { level: "Iniciante", color: "text-slate-400", emoji: "🌱", message: "Continue praticando! Cada tentativa conta." };
  };

  const performance = getPerformanceLevel(overallScore);

  // Métricas de desempenho
  const metrics: PerformanceMetric[] = [
    {
      label: "Pontuação",
      value: score,
      maxValue: totalChunks * 10 + 20,
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      description: "Pontos ganhos por usar chunks corretamente",
    },
    {
      label: "Chunks Usados",
      value: chunksUsedCount,
      maxValue: totalChunks,
      icon: <Target className="w-5 h-5 text-green-400" />,
      description: "Expressões-chave utilizadas na conversa",
    },
    {
      label: "Diálogo",
      value: dialogueCompletion,
      maxValue: 100,
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      description: "Porcentagem do diálogo completada",
    },
  ];

  // Chunks usados vs não usados
  const unusedChunks = situation.keyChunks.filter(c => !chunksUsed.includes(c.chunk));

  // Sugestões de melhoria
  const getSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    if (chunksUsedCount < totalChunks / 2) {
      suggestions.push("Tente usar mais chunks da situação para ganhar mais pontos");
    }
    if (duration < 60) {
      suggestions.push("Leve mais tempo para elaborar suas respostas");
    }
    if (unusedChunks.length > 0) {
      suggestions.push(`Pratique usar: "${unusedChunks[0].chunk}"`);
    }
    if (overallScore < 60) {
      suggestions.push("Revise o vocabulário antes de tentar novamente");
    }
    
    return suggestions.length > 0 ? suggestions : ["Continue praticando para manter seu nível!"];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com pontuação geral */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10" />
        <CardContent className="relative p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{performance.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Simulação Concluída!
            </h2>
            <p className={`text-xl font-semibold ${performance.color} mb-2`}>
              Nível: {performance.level}
            </p>
            <p className="text-slate-400 mb-6">{performance.message}</p>
            
            {/* Pontuação circular */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${overallScore * 3.52} 352`}
                  className={performance.color.replace('text-', 'text-')}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{overallScore}</span>
              </div>
            </div>
            
            {/* Info da situação */}
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {situation.title}
              </span>
              <span>•</span>
              <span>{durationMinutes}:{durationSeconds.toString().padStart(2, '0')}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {situation.difficulty === 'beginner' ? 'Básico' : 
                 situation.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {metric.icon}
                <span className="text-sm font-medium text-slate-300">{metric.label}</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                <span className="text-sm text-slate-500">/ {metric.maxValue}</span>
              </div>
              <Progress 
                value={(metric.value / metric.maxValue) * 100} 
                className="h-2"
              />
              <p className="text-xs text-slate-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chunks utilizados */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Chunks Utilizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chunks usados */}
            {chunksUsed.length > 0 && (
              <div>
                <p className="text-sm text-slate-400 mb-2">✅ Você usou:</p>
                <div className="flex flex-wrap gap-2">
                  {chunksUsed.map((chunk, i) => (
                    <Badge key={i} className="bg-green-500/20 text-green-400 border-green-500/30">
                      {chunk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chunks não usados */}
            {unusedChunks.length > 0 && (
              <div>
                <p className="text-sm text-slate-400 mb-2">💡 Tente usar na próxima vez:</p>
                <div className="flex flex-wrap gap-2">
                  {unusedChunks.map((chunk, i) => (
                    <div key={i} className="group">
                      <Badge 
                        variant="outline" 
                        className="text-slate-400 border-slate-600 cursor-help"
                        title={chunk.equivalent}
                      >
                        {chunk.chunk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de melhoria */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Sugestões para Melhorar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {getSuggestions().map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vocabulário aprendido */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Vocabulário da Situação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {situation.vocabulary.map((vocab, i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{vocab.word}</span>
                  <span className="text-sm text-slate-400">{vocab.translation}</span>
                </div>
                <p className="text-xs text-slate-500 italic">"{vocab.example}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dica cultural (se houver) */}
      {situation.culturalTips && situation.culturalTips.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h4 className="font-medium text-white mb-1">Dica Cultural</h4>
                <p className="text-sm text-slate-300">{situation.culturalTips[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onTryAgain}
          variant="outline"
          className="flex-1 border-slate-600 hover:bg-slate-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
        <Button 
          onClick={onNewSimulation}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Nova Simulação
        </Button>
      </div>

      {/* Badges desbloqueados (se houver) */}
      {overallScore >= 75 && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">🎉 Badge Desbloqueado!</h4>
                <p className="text-sm text-slate-300">
                  {situation.category === 'travel' ? 'Viajante Experiente' :
                   situation.category === 'work' ? 'Profissional de Negócios' :
                   situation.category === 'food' ? 'Gourmet Internacional' :
                   'Comunicador Habilidoso'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
