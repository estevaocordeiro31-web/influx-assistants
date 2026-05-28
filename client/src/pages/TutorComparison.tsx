import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Volume2, BarChart3, TrendingUp, Award } from 'lucide-react';

interface ComparisonMetrics {
  studentScore: number;
  tutorScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  intonation: number;
  rhythm: number;
}

export default function TutorComparison() {
  const [, navigate] = useLocation();
  const [songId, setSongId] = useState<string | null>(null);
  const [studentAudioUrl, setStudentAudioUrl] = useState<string | null>(null);
  const [tutorAudioUrl, setTutorAudioUrl] = useState<string | null>(null);
  const [isPlayingStudent, setIsPlayingStudent] = useState(false);
  const [isPlayingTutor, setIsPlayingTutor] = useState(false);
  const [metrics, setMetrics] = useState<ComparisonMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get comparison data
  const comparisonQuery = trpc.pronunciationAnalysis.getTutorComparison.useQuery(
    { songId: songId || '' },
    { enabled: !!songId }
  );

  useEffect(() => {
    if (comparisonQuery.data) {
      setMetrics(comparisonQuery.data as ComparisonMetrics);
      setIsLoading(false);
    }
  }, [comparisonQuery.data, comparisonQuery.isLoading]);

  const getScoreDifference = (student: number, tutor: number) => {
    return student - tutor;
  };

  const getDifferenceColor = (difference: number) => {
    if (difference >= 0) return 'text-green-400';
    return 'text-red-400';
  };

  const getDifferenceLabel = (difference: number) => {
    if (difference > 0) return `+${difference}%`;
    return `${difference}%`;
  };

  if (!songId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎤</div>
          <p className="text-gray-400 mb-6">Selecione uma música para comparar com o tutor</p>
          <Button
            onClick={() => navigate('/events/valentines/karaoke')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          >
            Voltar ao Karaokê
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-pink-300 hover:text-pink-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">🎯 Comparação com Tutor</h1>
            <p className="text-gray-400 text-sm">Veja como sua pronúncia se compara com o tutor</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando comparação...</p>
          </div>
        ) : metrics ? (
          <>
            {/* Audio Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Student Audio */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Volume2 size={20} className="text-blue-400" />
                  Sua Pronúncia
                </h2>
                {studentAudioUrl ? (
                  <div className="space-y-4">
                    <audio
                      src={studentAudioUrl}
                      onPlay={() => setIsPlayingStudent(true)}
                      onPause={() => setIsPlayingStudent(false)}
                      className="w-full"
                      controls
                    />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        {metrics.studentScore}%
                      </div>
                      <p className="text-sm text-gray-400">Sua Pronúncia</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhuma gravação disponível</p>
                  </div>
                )}
              </div>

              {/* Tutor Audio */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Volume2 size={20} className="text-green-400" />
                  Pronúncia do Tutor
                </h2>
                {tutorAudioUrl ? (
                  <div className="space-y-4">
                    <audio
                      src={tutorAudioUrl}
                      onPlay={() => setIsPlayingTutor(true)}
                      onPause={() => setIsPlayingTutor(false)}
                      className="w-full"
                      controls
                    />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        {metrics.tutorScore}%
                      </div>
                      <p className="text-sm text-gray-400">Referência</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhuma gravação de tutor disponível</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-400" />
                Análise Detalhada
              </h2>

              <div className="space-y-4">
                {/* Accuracy */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-purple-400" />
                    <div>
                      <p className="font-semibold">Precisão</p>
                      <p className="text-sm text-gray-400">Clareza das palavras</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-300">
                      {metrics.accuracy}%
                    </div>
                    <p className={`text-sm ${getDifferenceColor(getScoreDifference(metrics.accuracy, metrics.tutorScore))}`}>
                      {getDifferenceLabel(getScoreDifference(metrics.accuracy, metrics.tutorScore))}
                    </p>
                  </div>
                </div>

                {/* Fluency */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-green-400" />
                    <div>
                      <p className="font-semibold">Fluência</p>
                      <p className="text-sm text-gray-400">Naturalidade da fala</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-300">
                      {metrics.fluency}%
                    </div>
                    <p className={`text-sm ${getDifferenceColor(getScoreDifference(metrics.fluency, metrics.tutorScore))}`}>
                      {getDifferenceLabel(getScoreDifference(metrics.fluency, metrics.tutorScore))}
                    </p>
                  </div>
                </div>

                {/* Completeness */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-orange-400" />
                    <div>
                      <p className="font-semibold">Cobertura</p>
                      <p className="text-sm text-gray-400">Quantidade de palavras</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-300">
                      {metrics.completeness}%
                    </div>
                    <p className={`text-sm ${getDifferenceColor(getScoreDifference(metrics.completeness, metrics.tutorScore))}`}>
                      {getDifferenceLabel(getScoreDifference(metrics.completeness, metrics.tutorScore))}
                    </p>
                  </div>
                </div>

                {/* Intonation */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-blue-400" />
                    <div>
                      <p className="font-semibold">Entonação</p>
                      <p className="text-sm text-gray-400">Variação de tom</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-300">
                      {metrics.intonation}%
                    </div>
                    <p className={`text-sm ${getDifferenceColor(getScoreDifference(metrics.intonation, metrics.tutorScore))}`}>
                      {getDifferenceLabel(getScoreDifference(metrics.intonation, metrics.tutorScore))}
                    </p>
                  </div>
                </div>

                {/* Rhythm */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-pink-400" />
                    <div>
                      <p className="font-semibold">Ritmo</p>
                      <p className="text-sm text-gray-400">Velocidade e cadência</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-pink-300">
                      {metrics.rhythm}%
                    </div>
                    <p className={`text-sm ${getDifferenceColor(getScoreDifference(metrics.rhythm, metrics.tutorScore))}`}>
                      {getDifferenceLabel(getScoreDifference(metrics.rhythm, metrics.tutorScore))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">💡 Dicas de Melhoria</h2>
              <ul className="space-y-2 text-sm text-gray-200">
                {metrics.accuracy < 80 && (
                  <li>• Trabalhe na clareza das palavras - pronuncie cada sílaba com cuidado</li>
                )}
                {metrics.fluency < 80 && (
                  <li>• Pratique a naturalidade - não pausar entre as palavras</li>
                )}
                {metrics.intonation < 75 && (
                  <li>• Varie o tom da voz - não fale de forma monótona</li>
                )}
                {metrics.rhythm < 75 && (
                  <li>• Mantenha um ritmo constante - acompanhe a música</li>
                )}
                {metrics.accuracy >= 80 && metrics.fluency >= 80 && (
                  <li>✨ Excelente! Continue praticando para manter a qualidade</li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/events/valentines/karaoke')}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
              >
                Voltar ao Karaokê
              </Button>
              <Button
                onClick={() => navigate('/events/valentines/pronunciation-history')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
              >
                Ver Histórico
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma comparação disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
