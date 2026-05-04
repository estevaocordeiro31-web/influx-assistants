import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { KARAOKE_SONGS, KARAOKE_CELEBRATION_IMAGES, DECADE_INFO, type KaraokeSong } from '@/data/valentines/karaoke';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Play, Pause, Trophy, Star, Heart, ChevronRight, Volume2, CheckCircle, XCircle, Sparkles } from 'lucide-react';

// Shuffle array helper
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Normalize answer for comparison
const normalizeAnswer = (str: string) => str.toLowerCase().trim().replace(/[''`´]/g, "'").replace(/[^a-z0-9\s']/g, '');

type GameState = 'menu' | 'decade-select' | 'playing' | 'checking' | 'result' | 'final';

export default function ValentinesKaraoke() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [currentSongs, setCurrentSongs] = useState<KaraokeSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [celebrationChar, setCelebrationChar] = useState<'lucas' | 'emily' | 'aiko'>('lucas');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [roundScores, setRoundScores] = useState<{ song: KaraokeSong; correct: boolean; points: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = currentSongs[currentIndex];

  // Fetch preview URL from Deezer via our backend
  const fetchPreview = async (deezerId: number) => {
    setAudioLoading(true);
    try {
      const response = await fetch(`https://api.deezer.com/track/${deezerId}`);
      const data = await response.json();
      if (data.preview) {
        setAudioUrl(data.preview);
      }
    } catch (err) {
      console.error('Error fetching preview:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  // Start a round with selected decade
  const startRound = (decade: string) => {
    const songs = KARAOKE_SONGS.filter(s => s.decade === decade);
    const shuffled = shuffle(songs).slice(0, 5); // 5 songs per round
    setCurrentSongs(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setRoundScores([]);
    setSelectedDecade(decade);
    setGameState('playing');
    setAnswer('');
    setShowResult(null);
    setAttempts(0);
    fetchPreview(shuffled[0].deezerId);
  };

  // Play/pause audio
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Check answer
  const checkAnswer = () => {
    if (!currentSong || !answer.trim()) return;
    const normalized = normalizeAnswer(answer);
    const isCorrect = currentSong.acceptedAnswers.some(a => {
      const normalizedAccepted = normalizeAnswer(a);
      return normalized.includes(normalizedAccepted) || normalizedAccepted.includes(normalized);
    });

    if (isCorrect) {
      const points = attempts === 0 ? 100 : attempts === 1 ? 50 : 25;
      setScore(prev => prev + points);
      setShowResult('correct');
      setRoundScores(prev => [...prev, { song: currentSong, correct: true, points }]);
      // Random celebration character
      const chars: ('lucas' | 'emily' | 'aiko')[] = ['lucas', 'emily', 'aiko'];
      setCelebrationChar(chars[Math.floor(Math.random() * 3)]);
      setGameState('checking');
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // 3 attempts used, show answer
        setShowResult('wrong');
        setRoundScores(prev => [...prev, { song: currentSong, correct: false, points: 0 }]);
        setCelebrationChar('lucas');
        setGameState('checking');
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        setShowResult('wrong');
        setTimeout(() => setShowResult(null), 1500);
      }
    }
  };

  // Next song
  const nextSong = () => {
    if (currentIndex + 1 >= currentSongs.length) {
      setGameState('final');
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setAnswer('');
      setShowResult(null);
      setAttempts(0);
      setGameState('playing');
      fetchPreview(currentSongs[nextIdx].deezerId);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio element when URL changes
  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      setIsPlaying(false);
    }
  }, [audioUrl]);

  // === MENU ===
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.2,
              }}
            >
              {['🎵', '🎶', '🎤', '💜', '🎸', '🎹'][i % 6]}
            </div>
          ))}
        </div>

        <div className="relative z-10 p-4 max-w-lg mx-auto">
          {/* Header */}
          <button onClick={() => navigate('/events/valentines')} className="flex items-center gap-2 text-pink-300 hover:text-pink-200 mb-6">
            <ArrowLeft size={20} /> Voltar
          </button>

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-4">
              <Music size={16} className="text-purple-300" />
              <span className="text-sm text-purple-200">Valentine's Karaoke Night</span>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🎤 Qual é a Música?
            </h1>
            <p className="text-gray-300 text-lg">
              Ouça o trecho e adivinhe a música romântica!
            </p>
          </div>

          {/* Karaoke scene image */}
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <img
              src={KARAOKE_CELEBRATION_IMAGES.lucas}
              alt="Karaoke Night"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm text-gray-200">
                Lucas, Emily e Aiko te desafiam numa noite de karaokê!
              </p>
            </div>
          </div>

          {/* How to play */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Como Jogar</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Volume2 size={16} className="text-pink-400" />
                </div>
                <p className="text-gray-300 text-sm">Ouça o trecho de 30 segundos da música</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Music size={16} className="text-purple-400" />
                </div>
                <p className="text-gray-300 text-sm">Digite o nome da música ou artista</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-cyan-400" />
                </div>
                <p className="text-gray-300 text-sm">Clique em "Checar" para ver a continuação da música!</p>
              </div>
            </div>
          </div>

          {/* Start button */}
          <Button
            onClick={() => setGameState('decade-select')}
            className="w-full py-6 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl shadow-lg shadow-purple-500/30"
          >
            <Play size={20} className="mr-2" /> Começar Karaokê
          </Button>
        </div>
      </div>
    );
  }

  // === DECADE SELECT ===
  if (gameState === 'decade-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4">
        <div className="max-w-lg mx-auto">
          <button onClick={() => setGameState('menu')} className="flex items-center gap-2 text-pink-300 hover:text-pink-200 mb-6">
            <ArrowLeft size={20} /> Voltar
          </button>

          <h2 className="text-2xl font-bold text-center mb-2">Escolha a Década</h2>
          <p className="text-gray-400 text-center mb-8">Cada década tem 5 músicas românticas para adivinhar!</p>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(DECADE_INFO).map(([decade, info]) => (
              <button
                key={decade}
                onClick={() => startRound(decade)}
                className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${info.gradient} hover:scale-105 transition-all duration-300 shadow-lg`}
              >
                <div className="text-4xl mb-2">{info.emoji}</div>
                <div className="text-2xl font-bold">{info.label}</div>
                <div className="text-sm opacity-80 mt-1">6 hits</div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">🎵</div>
              </button>
            ))}
          </div>

          {/* All decades challenge */}
          <button
            onClick={() => {
              const allSongs = shuffle(KARAOKE_SONGS).slice(0, 8);
              setCurrentSongs(allSongs);
              setCurrentIndex(0);
              setScore(0);
              setRoundScores([]);
              setSelectedDecade('mix');
              setGameState('playing');
              setAnswer('');
              setShowResult(null);
              setAttempts(0);
              fetchPreview(allSongs[0].deezerId);
            }}
            className="w-full mt-6 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="text-yellow-400" />
              <span className="text-lg font-semibold">Mix de Todas as Décadas</span>
              <Sparkles size={20} className="text-yellow-400" />
            </div>
            <p className="text-sm text-gray-400 mt-1">8 músicas aleatórias de todas as eras!</p>
          </button>
        </div>
      </div>
    );
  }

  // === PLAYING ===
  if (gameState === 'playing' && currentSong) {
    const decadeInfo = selectedDecade === 'mix' ? { label: 'Mix', emoji: '🎵', gradient: 'from-pink-600 to-purple-600' } : DECADE_INFO[selectedDecade as keyof typeof DECADE_INFO];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4">
        <div className="max-w-lg mx-auto">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setGameState('decade-select')} className="text-pink-300 hover:text-pink-200">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{currentIndex + 1}/{currentSongs.length}</span>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / currentSongs.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={16} />
              <span className="font-bold">{score}</span>
            </div>
          </div>

          {/* Decade badge */}
          <div className="text-center mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${decadeInfo.gradient} text-sm font-semibold`}>
              {decadeInfo.emoji} {decadeInfo.label}
            </span>
          </div>

          {/* Audio player */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/30 mb-3">
                {audioLoading ? (
                  <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <button onClick={toggleAudio} className="w-full h-full flex items-center justify-center">
                    {isPlaying ? <Pause size={32} className="text-pink-300" /> : <Play size={32} className="text-pink-300 ml-1" />}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {audioLoading ? 'Carregando áudio...' : isPlaying ? '🎵 Tocando...' : 'Toque para ouvir o trecho'}
              </p>
            </div>

            {/* Waveform animation */}
            {isPlaying && (
              <div className="flex items-end justify-center gap-1 h-8 mb-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.5s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Lyrics hint */}
            <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-purple-300 mb-1">💡 Dica da letra:</p>
              <p className="text-gray-200 italic">{currentSong.lyricsHint}</p>
            </div>
          </div>

          {/* Answer input */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Nome da música ou artista..."
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 text-lg"
              />
              {showResult === 'wrong' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-red-400 animate-pulse">
                  <XCircle size={20} />
                  <span className="text-sm">Tente de novo!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Tentativa {attempts + 1}/3</span>
              {attempts > 0 && <span className="text-yellow-400">• Menos pontos a cada tentativa</span>}
            </div>

            <Button
              onClick={checkAnswer}
              disabled={!answer.trim()}
              className="w-full py-4 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={20} className="mr-2" /> Checar Resposta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // === CHECKING (Result for current song) ===
  if (gameState === 'checking' && currentSong) {
    const isCorrect = showResult === 'correct';

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4 overflow-hidden relative">
        {/* Confetti effect for correct */}
        {isCorrect && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              >
                {['🎵', '🎶', '💜', '⭐', '🎤', '✨', '💖'][i % 7]}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-lg mx-auto relative z-10">
          {/* Result header */}
          <div className="text-center mb-6 pt-4">
            {isCorrect ? (
              <>
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-green-400 mb-1">Acertou!</h2>
                <p className="text-yellow-400 font-semibold">+{roundScores[roundScores.length - 1]?.points || 100} pontos</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">😢</div>
                <h2 className="text-2xl font-bold text-red-400 mb-1">Não foi dessa vez...</h2>
                <p className="text-gray-400">A resposta era:</p>
              </>
            )}
          </div>

          {/* Song reveal */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={currentSong.albumCover}
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{currentSong.title}</h3>
                <p className="text-pink-300">{currentSong.artist}</p>
                <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full">{currentSong.decade}</span>
              </div>
            </div>

            {/* Lyrics continuation */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-400/20 mb-4">
              <p className="text-sm text-purple-300 mb-2">🎶 Continuação da música:</p>
              <p className="text-gray-200 italic whitespace-pre-line leading-relaxed">{currentSong.lyricsContinuation}</p>
            </div>

            {/* Fun fact */}
            <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
              <p className="text-sm text-yellow-300">💡 {currentSong.funFact}</p>
            </div>
          </div>

          {/* Celebration image */}
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <img
              src={KARAOKE_CELEBRATION_IMAGES[celebrationChar]}
              alt="Celebration"
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <p className="text-sm font-semibold text-white">
                {isCorrect
                  ? celebrationChar === 'lucas' ? '🇺🇸 Lucas: "Awesome! You nailed it!"'
                    : celebrationChar === 'emily' ? '🇬🇧 Emily: "Brilliant! Well done!"'
                    : '🇦🇺 Aiko: "Legend! That was spot on!"'
                  : '🎤 "Don\'t worry, next one is yours!"'}
              </p>
            </div>
          </div>

          {/* Next button */}
          <Button
            onClick={nextSong}
            className="w-full py-4 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl"
          >
            {currentIndex + 1 >= currentSongs.length ? (
              <><Trophy size={20} className="mr-2" /> Ver Resultado Final</>
            ) : (
              <><ChevronRight size={20} className="mr-2" /> Próxima Música</>
            )}
          </Button>
        </div>

        {/* CSS for confetti animation */}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // === FINAL RESULTS ===
  if (gameState === 'final') {
    const maxScore = currentSongs.length * 100;
    const percentage = Math.round((score / maxScore) * 100);
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : percentage > 0 ? 1 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white p-4">
        <div className="max-w-lg mx-auto">
          {/* Trophy header */}
          <div className="text-center mb-8 pt-6">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Karaokê Completo!
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star key={i} size={32} className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
              ))}
            </div>
            <p className="text-2xl font-bold text-white">{score} / {maxScore} pontos</p>
            <p className="text-gray-400 mt-1">{roundScores.filter(r => r.correct).length}/{currentSongs.length} músicas corretas</p>
          </div>

          {/* Song results */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-200">Resultado por Música</h3>
            <div className="space-y-3">
              {roundScores.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-black/20 rounded-xl p-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {r.correct ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.song.title}</p>
                    <p className="text-xs text-gray-400">{r.song.artist}</p>
                  </div>
                  {r.correct && <span className="text-yellow-400 text-sm font-bold">+{r.points}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setGameState('decade-select')}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl"
            >
              <Music size={20} className="mr-2" /> Jogar Outra Década
            </Button>
            <Button
              onClick={() => navigate('/events/valentines')}
              variant="outline"
              className="w-full py-4 border-white/20 text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft size={20} className="mr-2" /> Voltar ao Valentine's
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
