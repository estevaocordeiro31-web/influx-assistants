import { useLocation } from 'wouter';
import { useState, useRef, useEffect, useMemo } from 'react';
import { KARAOKE_SONGS, KARAOKE_CELEBRATION_IMAGES, DECADE_INFO, type KaraokeSong } from '@/data/valentines/karaoke';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Play, Pause, Trophy, Star, Heart, Volume2, CheckCircle, XCircle, Sparkles, Crown } from 'lucide-react';
import { useValentinesScore } from '@/hooks/useValentinesScore';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const normalizeAnswer = (str: string) => str.toLowerCase().trim().replace(/[''`´]/g, "'").replace(/[^a-z0-9\s']/g, '');

type GameState = 'waiting' | 'decade-select' | 'playing' | 'checking' | 'result' | 'final';
type PlayerRole = 'player1' | 'player2';

interface PlayerState {
  name: string;
  score: number;
  answer: string;
  showResult: 'correct' | 'wrong' | null;
  attempts: number;
  isReady: boolean;
}

export default function ValentinesKaraokeMultiplayer() {
  const [, navigate] = useLocation();
  const { saveScore } = useValentinesScore();
  
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [currentSongs, setCurrentSongs] = useState<KaraokeSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [player1, setPlayer1] = useState<PlayerState>({
    name: '',
    score: 0,
    answer: '',
    showResult: null,
    attempts: 0,
    isReady: false,
  });
  
  const [player2, setPlayer2] = useState<PlayerState>({
    name: '',
    score: 0,
    answer: '',
    showResult: null,
    attempts: 0,
    isReady: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [celebrationChar, setCelebrationChar] = useState<'lucas' | 'emily' | 'aiko'>('lucas');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = currentSongs[currentIndex];

  // Fetch preview from Deezer
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

  // Start game with both players ready
  const startGame = () => {
    if (player1.isReady && player2.isReady && player1.name && player2.name) {
      setGameState('decade-select');
    }
  };

  // Select decade and start playing
  const selectDecade = (decade: string) => {
    setSelectedDecade(decade);
    const songs = KARAOKE_SONGS.filter(s => s.decade === decade);
    const shuffled = shuffle(songs).slice(0, 8);
    setCurrentSongs(shuffled);
    setCurrentIndex(0);
    setGameState('playing');
    if (shuffled.length > 0) {
      fetchPreview(shuffled[0].deezerId);
    }
  };

  // Handle player answer submission
  const handleSubmit = (playerRole: PlayerRole) => {
    const player = playerRole === 'player1' ? player1 : player2;
    const setPlayer = playerRole === 'player1' ? setPlayer1 : setPlayer2;

    if (!currentSong || !player.answer) return;

    const correct = normalizeAnswer(player.answer) === normalizeAnswer(currentSong.artist) ||
                   normalizeAnswer(player.answer) === normalizeAnswer(currentSong.title) ||
                   currentSong.acceptedAnswers?.some(ans => normalizeAnswer(player.answer) === normalizeAnswer(ans));

    if (correct) {
      const points = 50 - (player.attempts * 10);
      setPlayer(prev => ({
        ...prev,
        score: prev.score + Math.max(points, 10),
        showResult: 'correct',
        answer: '',
      }));
      setCelebrationChar(playerRole === 'player1' ? 'lucas' : 'emily');
    } else {
      if (player.attempts >= 2) {
        setPlayer(prev => ({
          ...prev,
          showResult: 'wrong',
          answer: '',
        }));
      } else {
        setPlayer(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
          showResult: 'wrong',
          answer: '',
        }));
        setTimeout(() => {
          setPlayer(prev => ({ ...prev, showResult: null }));
        }, 1500);
        return;
      }
    }

    setGameState('checking');
  };

  // Next song
  const nextSong = () => {
    if (currentIndex + 1 >= currentSongs.length) {
      setGameState('final');
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setPlayer1(prev => ({ ...prev, answer: '', showResult: null, attempts: 0 }));
      setPlayer2(prev => ({ ...prev, answer: '', showResult: null, attempts: 0 }));
      setGameState('playing');
      fetchPreview(currentSongs[nextIdx].deezerId);
    }
  };

  // Save scores when game ends
  useEffect(() => {
    if (gameState === 'final') {
      saveScore('karaoke-multiplayer-p1', player1.score, true);
      saveScore('karaoke-multiplayer-p2', player2.score, true);
    }
  }, [gameState, player1.score, player2.score, saveScore]);

  // Audio management
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Play error:', err));
      }
    }
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Render waiting screen for player names
  if (gameState === 'waiting') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}>
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/events/valentines")}
            className="mb-6 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={18} className="text-white/70" />
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">🎤 Karaoke Multiplayer</h1>
            <p className="text-pink-300/60 text-sm">Desafie um amigo!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 */}
            <div className="rounded-2xl p-6" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="text-center mb-4">
                <span className="text-3xl">🎸</span>
                <h2 className="text-white font-bold mt-2">Player 1</h2>
              </div>
              <input
                type="text"
                value={player1.name}
                onChange={(e) => setPlayer1(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome..."
                className="w-full rounded-xl px-4 py-2.5 text-white text-sm font-bold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                }}
              />
              <Button
                onClick={() => setPlayer1(prev => ({ ...prev, isReady: !prev.isReady }))}
                className="w-full mt-3 rounded-xl"
                style={{
                  background: player1.isReady ? "linear-gradient(135deg, #4caf50, #8bc34a)" : "linear-gradient(135deg, #e91e63, #880E4F)",
                }}
              >
                {player1.isReady ? "✓ Pronto" : "Confirmar"}
              </Button>
            </div>

            {/* Player 2 */}
            <div className="rounded-2xl p-6" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="text-center mb-4">
                <span className="text-3xl">🎹</span>
                <h2 className="text-white font-bold mt-2">Player 2</h2>
              </div>
              <input
                type="text"
                value={player2.name}
                onChange={(e) => setPlayer2(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome..."
                className="w-full rounded-xl px-4 py-2.5 text-white text-sm font-bold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                }}
              />
              <Button
                onClick={() => setPlayer2(prev => ({ ...prev, isReady: !prev.isReady }))}
                className="w-full mt-3 rounded-xl"
                style={{
                  background: player2.isReady ? "linear-gradient(135deg, #4caf50, #8bc34a)" : "linear-gradient(135deg, #e91e63, #880E4F)",
                }}
              >
                {player2.isReady ? "✓ Pronto" : "Confirmar"}
              </Button>
            </div>
          </div>

          <Button
            onClick={startGame}
            disabled={!player1.isReady || !player2.isReady}
            className="w-full mt-6 rounded-xl gap-2 py-3"
            style={{
              background: player1.isReady && player2.isReady ? "linear-gradient(135deg, #ff1493, #ff69b4)" : "rgba(255,255,255,0.1)",
              opacity: player1.isReady && player2.isReady ? 1 : 0.5,
            }}
          >
            <Music size={18} /> Começar Competição
          </Button>
        </div>
      </div>
    );
  }

  // Render decade selection
  if (gameState === 'decade-select') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}>
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => setGameState('waiting')}
            className="mb-6 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowLeft size={18} className="text-white/70" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">Escolha uma Década</h2>
            <p className="text-pink-300/60 text-sm">{player1.name} vs {player2.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(DECADE_INFO).map(([decade, info]) => (
              <button
                key={decade}
                onClick={() => selectDecade(decade)}
                className="rounded-xl p-4 text-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  hover: { transform: "scale(1.05)" },
                }}
              >
                <div className="text-2xl mb-2">{info.emoji}</div>
                <div className="text-white font-bold text-sm">{decade}s</div>
                <div className="text-pink-300/50 text-xs">{info.count} músicas</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render playing screen
  if (gameState === 'playing' && currentSong) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}>
        <audio ref={audioRef} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
          {/* Header with scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="text-center">
                <p className="text-pink-300/60 text-xs mb-1">{player1.name}</p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  <span className="text-2xl font-black text-white">{player1.score}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="text-center">
                <p className="text-pink-300/60 text-xs mb-1">{player2.name}</p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  <span className="text-2xl font-black text-white">{player2.score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Song card */}
          <div className="rounded-2xl p-8 text-center mb-6" style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <p className="text-pink-300/50 text-xs mb-3">🎵 Adivinhe a música!</p>
            <div className="text-5xl mb-4">🎤</div>
            <p className="text-white text-sm mb-4">{currentSong.title}</p>
            <p className="text-pink-300/60 text-xs mb-6">Por: {currentSong.artist}</p>

            <Button
              onClick={() => {
                if (isPlaying) {
                  audioRef.current?.pause();
                } else {
                  audioRef.current?.play();
                }
                setIsPlaying(!isPlaying);
              }}
              disabled={audioLoading}
              className="rounded-xl gap-2 mb-4"
              style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {audioLoading ? "Carregando..." : isPlaying ? "Pausar" : "Ouvir"}
            </Button>

            <p className="text-pink-300/40 text-xs">Dica: {currentSong.hint}</p>
          </div>

          {/* Player inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 Input */}
            <div className="rounded-xl p-4" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <p className="text-pink-300/60 text-xs mb-2">{player1.name}</p>
              <input
                type="text"
                value={player1.answer}
                onChange={(e) => setPlayer1(prev => ({ ...prev, answer: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit('player1')}
                placeholder="Sua resposta..."
                className="w-full rounded-lg px-3 py-2 text-white text-sm font-bold mb-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: player1.showResult ? (player1.showResult === 'correct' ? "1px solid #4caf50" : "1px solid #f44336") : "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                }}
              />
              <Button
                onClick={() => handleSubmit('player1')}
                size="sm"
                className="w-full rounded-lg text-xs"
                style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
              >
                Enviar
              </Button>
              {player1.showResult && (
                <div className="mt-2 text-center text-xs font-bold">
                  {player1.showResult === 'correct' ? (
                    <span className="text-green-400">✨ Correto! +pts</span>
                  ) : (
                    <span className="text-red-400">❌ Errado</span>
                  )}
                </div>
              )}
            </div>

            {/* Player 2 Input */}
            <div className="rounded-xl p-4" style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <p className="text-pink-300/60 text-xs mb-2">{player2.name}</p>
              <input
                type="text"
                value={player2.answer}
                onChange={(e) => setPlayer2(prev => ({ ...prev, answer: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit('player2')}
                placeholder="Sua resposta..."
                className="w-full rounded-lg px-3 py-2 text-white text-sm font-bold mb-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: player2.showResult ? (player2.showResult === 'correct' ? "1px solid #4caf50" : "1px solid #f44336") : "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                }}
              />
              <Button
                onClick={() => handleSubmit('player2')}
                size="sm"
                className="w-full rounded-lg text-xs"
                style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
              >
                Enviar
              </Button>
              {player2.showResult && (
                <div className="mt-2 text-center text-xs font-bold">
                  {player2.showResult === 'correct' ? (
                    <span className="text-green-400">✨ Correto! +pts</span>
                  ) : (
                    <span className="text-red-400">❌ Errado</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {gameState === 'checking' && (
            <Button
              onClick={nextSong}
              className="w-full mt-6 rounded-xl gap-2"
              style={{ background: "linear-gradient(135deg, #ff1493, #ff69b4)" }}
            >
              Próxima Música →
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render final screen
  if (gameState === 'final') {
    const winner = player1.score > player2.score ? 'player1' : player2.score > player1.score ? 'player2' : 'tie';
    const emoji = winner === 'tie' ? '🤝' : winner === 'player1' ? '👑' : '👑';

    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-6xl inline-block mb-4">{emoji}</span>
            <h1 className="text-3xl font-black text-white mb-2">
              {winner === 'tie' ? 'Empate Épico!' : winner === 'player1' ? `${player1.name} Venceu!` : `${player2.name} Venceu!`}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl p-6 text-center" style={{
              background: winner === 'player1' ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: winner === 'player1' ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}>
              <p className="text-white font-bold mb-2">{player1.name}</p>
              <div className="text-4xl font-black text-amber-400 mb-2">{player1.score}</div>
              {winner === 'player1' && <Crown size={24} className="text-amber-400 mx-auto" />}
            </div>

            <div className="rounded-2xl p-6 text-center" style={{
              background: winner === 'player2' ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              border: winner === 'player2' ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}>
              <p className="text-white font-bold mb-2">{player2.name}</p>
              <div className="text-4xl font-black text-amber-400 mb-2">{player2.score}</div>
              {winner === 'player2' && <Crown size={24} className="text-amber-400 mx-auto" />}
            </div>
          </div>

          <Button
            onClick={() => navigate("/events/valentines")}
            className="w-full rounded-xl gap-2 py-3"
            style={{ background: "linear-gradient(135deg, #e91e63, #880E4F)" }}
          >
            <ArrowLeft size={18} /> Voltar ao Restaurante
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
