import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Award, Zap, Volume2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PronunciationAnalysis {
  id: number;
  songId: string;
  songTitle?: string;
  transcription: string;
  pronunciationScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  feedback: string;
  createdAt: Date;
}

export default function PronunciationHistory() {
  const [, navigate] = useLocation();
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [analyses, setAnalyses] = useState<PronunciationAnalysis[]>([]);
  const [averageScore, setAverageScore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get participant ID from localStorage or URL
  useEffect(() => {
    const storedId = localStorage.getItem('valentinesParticipantId');
    if (storedId) {
      setParticipantId(parseInt(storedId));
    }
  }, []);

  // Fetch analysis history
  const historyQuery = trpc.pronunciationAnalysis.getAnalysisHistory.useQuery(
    { participantId: participantId || 0 },
    { enabled: !!participantId }
  );

  // Fetch average scores
  const averageQuery = trpc.pronunciationAnalysis.getAverageScore.useQuery(
    { participantId: participantId || 0 },
    { enabled: !!participantId }
  );

  useEffect(() => {
    if (historyQuery.data) {
      setAnalyses(historyQuery.data as PronunciationAnalysis[]);
    }
    if (averageQuery.data) {
      setAverageScore(averageQuery.data);
    }
    setIsLoading(historyQuery.isLoading || averageQuery.isLoading);
  }, [historyQuery.data, historyQuery.isLoading, averageQuery.data, averageQuery.isLoading]);

  // Prepare chart data
  const chartData = analyses.map((a, idx) => ({
    name: `Música ${idx + 1}`,
    pronunciation: a.pronunciationScore,
    accuracy: a.accuracy,
    fluency: a.fluency,
    completeness: a.completeness,
  }));

  const scoreDistribution = [
    { range: '0-20', count: analyses.filter(a => a.pronunciationScore < 20).length },
    { range: '20-40', count: analyses.filter(a => a.pronunciationScore >= 20 && a.pronunciationScore < 40).length },
    { range: '40-60', count: analyses.filter(a => a.pronunciationScore >= 40 && a.pronunciationScore < 60).length },
    { range: '60-80', count: analyses.filter(a => a.pronunciationScore >= 60 && a.pronunciationScore < 80).length },
    { range: '80-100', count: analyses.filter(a => a.pronunciationScore >= 80).length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-pink-300 hover:text-pink-200 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">📊 Histórico de Pronúncia</h1>
              <p className="text-gray-400 text-sm">{analyses.length} análises realizadas</p>
            </div>
          </div>
        </div>

        {/* Average Scores Cards */}
        {averageScore && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-blue-400" />
                <span className="text-sm text-gray-300">Pronúncia Média</span>
              </div>
              <div className="text-3xl font-bold text-blue-300">
                {Math.round(averageScore.avgPronunciation || 0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-purple-400" />
                <span className="text-sm text-gray-300">Precisão Média</span>
              </div>
              <div className="text-3xl font-bold text-purple-300">
                {Math.round(averageScore.avgAccuracy || 0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={20} className="text-green-400" />
                <span className="text-sm text-gray-300">Fluência Média</span>
              </div>
              <div className="text-3xl font-bold text-green-300">
                {Math.round(averageScore.avgFluency || 0)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-orange-400" />
                <span className="text-sm text-gray-300">Cobertura Média</span>
              </div>
              <div className="text-3xl font-bold text-orange-300">
                {Math.round(averageScore.avgCompleteness || 0)}%
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Line Chart - Progression */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📈 Progresso de Pronúncia</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,10,30,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pronunciation"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: '#ec4899', r: 4 }}
                    name="Pronúncia"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Score Distribution */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Distribuição de Pontuação</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,10,30,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#a855f7" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detailed List */}
        {analyses.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">🎵 Análises Detalhadas</h2>
            <div className="space-y-4">
              {analyses.map((analysis, idx) => (
                <div
                  key={analysis.id}
                  className="bg-black/30 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">Análise #{idx + 1}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(analysis.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400">
                        {analysis.pronunciationScore}%
                      </div>
                      <p className="text-xs text-gray-400">Pronúncia</p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-purple-500/20 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Precisão</p>
                      <p className="font-semibold text-purple-300">{analysis.accuracy}%</p>
                    </div>
                    <div className="bg-green-500/20 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Fluência</p>
                      <p className="font-semibold text-green-300">{analysis.fluency}%</p>
                    </div>
                    <div className="bg-orange-500/20 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Cobertura</p>
                      <p className="font-semibold text-orange-300">{analysis.completeness}%</p>
                    </div>
                  </div>

                  {/* Feedback */}
                  <p className="text-sm text-gray-300 italic">{analysis.feedback}</p>

                  {/* Transcription */}
                  {analysis.transcription && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-gray-500 mb-1">Transcrição:</p>
                      <p className="text-sm text-gray-400">{analysis.transcription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🎤</div>
            <p className="text-gray-400">Nenhuma análise de pronúncia realizada ainda.</p>
            <p className="text-sm text-gray-500 mt-2">Comece a cantar no karaokê e analise sua pronúncia!</p>
          </div>
        )}
      </div>
    </div>
  );
}
