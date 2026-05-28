import { useState } from 'react';
import { Mic, MicOff, Volume2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { trpc } from '@/lib/trpc';

interface KaraokeAudioRecorderProps {
  songId: string;
  songTitle: string;
  expectedLyrics: string;
  participantId?: number;
  onAnalysisComplete?: (result: any) => void;
  onClose?: () => void;
}

export function KaraokeAudioRecorder({
  songId,
  songTitle,
  expectedLyrics,
  participantId,
  onAnalysisComplete,
  onClose,
}: KaraokeAudioRecorderProps) {
  const {
    isRecording,
    recordedUrl,
    error,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeMutation = trpc.pronunciationAnalysis.analyzePronunciation.useMutation();

  const handleAnalyze = async () => {
    if (!recordedUrl) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeMutation.mutateAsync({
        audioUrl: recordedUrl,
        songId,
        songTitle,
        expectedLyrics,
        participantId,
      });

      if (result.success && result.analysis) {
        setAnalysisResult(result.analysis);
        onAnalysisComplete?.(result.analysis);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    resetRecording();
    setAnalysisResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">🎤 Análise de Pronúncia</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!recordedUrl && !analysisResult && (
            <>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-300">Cante a música para avaliarmos sua pronúncia</p>
                <p className="text-xs text-gray-500">{songTitle}</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex justify-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 text-lg"
                  >
                    <Mic size={24} />
                    Começar
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 font-bold text-lg">{duration}s</span>
                    </div>
                    <Button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 text-lg"
                    >
                      <MicOff size={24} />
                      Parar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {recordedUrl && !analysisResult && (
            <>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-300">✅ Gravação concluída!</p>
              </div>

              <audio
                src={recordedUrl}
                controls
                className="w-full"
                style={{
                  filter: 'brightness(1.2)',
                }}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Gravar Novamente
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                >
                  {isAnalyzing ? 'Analisando...' : 'Analisar'}
                </Button>
              </div>
            </>
          )}

          {analysisResult && (
            <>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-300">📊 Resultado da Análise</p>
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-300">
                    {analysisResult.pronunciationScore}%
                  </div>
                  <div className="text-xs text-gray-400">Pronúncia</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-300">
                    {analysisResult.accuracy}%
                  </div>
                  <div className="text-xs text-gray-400">Precisão</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-300">
                    {analysisResult.fluency}%
                  </div>
                  <div className="text-xs text-gray-400">Fluência</div>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-300">
                    {analysisResult.completeness}%
                  </div>
                  <div className="text-xs text-gray-400">Cobertura</div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-4">
                <p className="text-white text-center font-semibold text-sm">
                  {analysisResult.feedback}
                </p>
              </div>

              {/* Transcription */}
              {analysisResult.transcription && (
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Transcrição:</p>
                  <p className="text-white text-sm italic">{analysisResult.transcription}</p>
                </div>
              )}

              <Button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold"
              >
                Tentar Novamente
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
