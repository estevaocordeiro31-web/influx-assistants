import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Heart, ChevronRight, ChevronLeft, Volume2, Star, Trophy, BookOpen,
  HelpCircle, Utensils, Globe, Sparkles, Check, X, ArrowLeft, MessageCircle, Send, Loader2, Music
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  VALENTINE_CHUNKS, VALENTINE_CURIOSITIES, VOCAB_COMPARISONS,
  CHARACTER_IMAGES, CHARACTER_INFO, CHARACTER_COLORS, HERO_BANNER,
  type Character
} from "@/data/valentines/chunks";
import { VALENTINE_QUIZ } from "@/data/valentines/quiz";
// Food Challenge uses valentinesChat tRPC router

type AgeMode = 'teen' | 'adult';
type Section = 'home' | 'chunks' | 'quiz' | 'curiosities' | 'vocab' | 'restaurant';

// Countdown Timer Component
function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date('2026-06-12T19:00:00-03:00').getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30">
      <p className="text-center text-pink-200 text-xs mb-1 font-medium">Faltam para o evento</p>
      <div className="flex justify-center gap-3">
        {[{ v: timeLeft.days, l: 'dias' }, { v: timeLeft.hours, l: 'hrs' }, { v: timeLeft.minutes, l: 'min' }, { v: timeLeft.seconds, l: 'seg' }].map((t, i) => (
          <div key={i} className="text-center">
            <div className="text-white font-bold text-lg leading-none">{String(t.v).padStart(2, '0')}</div>
            <div className="text-pink-300/60 text-[9px] mt-0.5">{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ValentinesRestaurant() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [section, setSection] = useState<Section>('home');
  const [ageMode, setAgeMode] = useState<AgeMode>('adult');
  const [chunkIndex, setChunkIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [curiosityIndex, setCuriosityIndex] = useState(0);
  const [vocabCategory, setVocabCategory] = useState<'food' | 'restaurant' | 'romantic'>('food');
  const [showTranslation, setShowTranslation] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // Food Challenge state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const sendChatMessage = trpc.valentinesChat.sendMessage.useMutation();

  const currentChunk = VALENTINE_CHUNKS[chunkIndex];
  const currentQuiz = VALENTINE_QUIZ[quizIndex];
  const currentCuriosity = VALENTINE_CURIOSITIES[curiosityIndex];

  const getCharImage = (char: Character) => CHARACTER_IMAGES[char][ageMode];
  const getCharInfo = (char: Character) => CHARACTER_INFO[char];

  // TTS function - uses server-side TTS with real character voices
  const [ttsLoading, setTtsLoading] = useState<string | null>(null);
  const ttsSpeak = trpc.tts.speak.useMutation();

  const speak = async (text: string, voice: string) => {
    // Map voice locale to character name
    const charMap: Record<string, Character> = { 'en-US': 'lucas', 'en-GB': 'emily', 'en-AU': 'aiko' };
    const character = charMap[voice] || 'lucas';
    const ttsKey = `${character}-${text.substring(0, 20)}`;
    setTtsLoading(ttsKey);

    // If user is not logged in, use browser TTS directly (no redirect)
    if (!user) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      setTtsLoading(null);
      return;
    }

    try {
      const result = await ttsSpeak.mutateAsync({ text, character, situation: 'casual' });
      if (result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.play();
      }
    } catch {
      // Fallback to browser TTS if server TTS fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setTtsLoading(null);
    }
  };

  // Quiz answer handler
  const handleQuizAnswer = (optionId: string) => {
    if (quizAnswered) return;
    setQuizAnswered(optionId);
    const correct = currentQuiz.options.find(o => o.id === optionId)?.correct;
    if (correct) {
      setQuizScore(prev => prev + currentQuiz.points);
      setTotalPoints(prev => prev + currentQuiz.points);
    }
  };

  const nextQuiz = () => {
    if (quizIndex < VALENTINE_QUIZ.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(null);
    } else {
      setQuizComplete(true);
    }
  };

  // Home Section
  if (section === 'home') {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 50%, #1a0a2e 100%)" }}>
        {/* Hero Banner */}
        <div className="relative w-full h-48 overflow-hidden">
          <img src={HERO_BANNER} alt="Valentine's Restaurant" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0a1e]" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
        </div>

        <div className="max-w-md mx-auto px-4 -mt-8 relative z-10">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Heart className="text-red-400 fill-red-400" size={24} />
              inFlux Restaurant
            </h1>
            <p className="text-pink-300 text-sm mt-1">Valentine's Day Special</p>
          </div>

          {/* Age Mode Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setAgeMode('teen')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                ageMode === 'teen'
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Teens
            </button>
            <button
              onClick={() => setAgeMode('adult')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                ageMode === 'adult'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Adults
            </button>
          </div>

          {/* Characters */}
          <div className="flex justify-center gap-3 mb-6">
            {(['lucas', 'emily', 'aiko'] as Character[]).map(char => (
              <div key={char} className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-lg"
                  style={{ borderColor: CHARACTER_COLORS[char], boxShadow: `0 4px 20px ${CHARACTER_COLORS[char]}40` }}
                >
                  <img src={getCharImage(char)} alt={getCharInfo(char).name} className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-white text-xs font-bold mt-1">{getCharInfo(char).name}</p>
                <p className="text-gray-400 text-[10px]">{getCharInfo(char).roleEmoji} {getCharInfo(char).role}</p>
              </div>
            ))}
          </div>

          {/* Countdown Timer */}
          <CountdownBanner />

          {/* Score */}
          {totalPoints > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-500/10 rounded-xl py-2 border border-yellow-500/20">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-yellow-300 font-bold text-sm">{totalPoints} pontos</span>
            </div>
          )}

          {/* Leaderboard Link */}
          <button
            onClick={() => navigate('/events/valentines/leaderboard')}
            className="w-full mb-4 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 hover:border-pink-500/50 transition-all"
          >
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-white font-medium text-sm">Ver Ranking ao Vivo</span>
            </div>
            <ArrowLeft size={14} className="text-pink-300 rotate-180" />
          </button>

          {/* Missions */}
          <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-pink-400" /> Missões
          </h2>

          <div className="flex flex-col gap-3 pb-8">
            <MissionButton
              icon={<BookOpen size={18} className="text-pink-400" />}
              title="Chunk Lesson"
              description="12 expressões de restaurante com Lucas, Emily e Aiko"
              points={120}
              onClick={() => { setSection('chunks'); setChunkIndex(0); }}
              color="#e91e63"
            />
            <MissionButton
              icon={<HelpCircle size={18} className="text-yellow-400" />}
              title="Culture Quiz"
              description="10 perguntas sobre Valentine's Day no mundo"
              points={100}
              onClick={() => { setSection('quiz'); setQuizIndex(0); setQuizAnswered(null); setQuizComplete(false); setQuizScore(0); }}
              color="#ffc107"
            />
            <MissionButton
              icon={<Globe size={18} className="text-purple-400" />}
              title="Curiosities"
              description="Fatos incríveis sobre Valentine's em NYC, Londres e Sydney"
              points={60}
              onClick={() => { setSection('curiosities'); setCuriosityIndex(0); }}
              color="#9c27b0"
            />
            <MissionButton
              icon={<Utensils size={18} className="text-green-400" />}
              title="Vocab Battle"
              description="US vs UK vs AU — quem fala o quê?"
              points={80}
              onClick={() => { setSection('vocab'); setVocabCategory('food'); }}
              color="#4caf50"
            />
            <MissionButton
              icon={<MessageCircle size={18} className="text-red-400" />}
              title="Food Challenge"
              description="Faça seu pedido no restaurante conversando com Lucas, Emily e Aiko!"
              points={150}
              onClick={() => { setSection('restaurant'); setChatMessages([]); setChatInput(''); setOrderComplete(false); setMessageCount(0); }}
              color="#f44336"
            />
            <MissionButton
              icon={<Sparkles size={18} className="text-cyan-400" />}
              title="Games Arena"
              description="5 jogos: Word Scramble, Love Match, Emoji Decoder e mais!"
              points={390}
              onClick={() => navigate('/events/valentines/games')}
              color="#00bcd4"
            />
            <MissionButton
              icon={<Music size={18} className="text-purple-400" />}
              title="🎤 Qual é a Música?"
              description="Ouça trechos de hits românticos e adivinhe! 80s, 90s, 2000s, 2020s"
              points={500}
              onClick={() => navigate('/events/valentines/karaoke')}
              color="#9C27B0"
            />
            <MissionButton
              icon={<Music size={18} className="text-pink-400" />}
              title="🎤 Karaoke Multiplayer"
              description="Desafie um amigo! Competição lado-a-lado com placar ao vivo"
              points={600}
              onClick={() => navigate('/events/valentines/karaoke-multiplayer')}
              color="#ff1493"
            />
          </div>
        </div>
      </div>
    );
  }

  // Chunks Section
  if (section === 'chunks') {
    return (
      <div className="min-h-screen pb-8" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
        <div className="max-w-md mx-auto px-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSection('home')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-pink-400 fill-pink-400" />
              <span className="text-white font-bold text-sm">Chunk Lesson</span>
            </div>
            <span className="text-gray-400 text-xs">{chunkIndex + 1}/{VALENTINE_CHUNKS.length}</span>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-6">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((chunkIndex + 1) / VALENTINE_CHUNKS.length) * 100}%`, background: "linear-gradient(90deg, #e91e63, #ff5252)" }}
            />
          </div>

          {/* Character Image */}
          <div className="flex justify-center mb-4">
            <div
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-xl"
              style={{ borderColor: CHARACTER_COLORS[currentChunk.who], boxShadow: `0 8px 30px ${CHARACTER_COLORS[currentChunk.who]}50` }}
            >
              <img src={getCharImage(currentChunk.who)} alt={getCharInfo(currentChunk.who).name} className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Character Info */}
          <div className="text-center mb-4">
            <p className="text-white font-bold">{getCharInfo(currentChunk.who).name} {currentChunk.flag}</p>
            <p className="text-gray-400 text-xs">{getCharInfo(currentChunk.who).city} • {getCharInfo(currentChunk.who).accent}</p>
          </div>

          {/* Chunk Card */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${CHARACTER_COLORS[currentChunk.who]}33` }}>
            {/* Chunk */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">"{currentChunk.chunk}"</h2>
              <button
                onClick={() => speak(currentChunk.chunk, getCharInfo(currentChunk.who).ttsVoice)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${CHARACTER_COLORS[currentChunk.who]}20` }}
              >
                <Volume2 size={14} style={{ color: CHARACTER_COLORS[currentChunk.who] }} />
              </button>
            </div>

            {/* Equivalência */}
            <p className="text-pink-300 text-sm font-medium mb-3">= {currentChunk.equivalencia}</p>

            {/* Contexto */}
            <p className="text-gray-300 text-sm mb-4">{currentChunk.contexto}</p>

            {/* Exemplo */}
            <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(0,0,0,0.3)" }}>
              <p className="text-white text-sm whitespace-pre-line">{currentChunk.exemplo.en}</p>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-pink-400 text-xs mt-2 underline"
              >
                {showTranslation ? 'Ocultar tradução' : 'Ver tradução'}
              </button>
              {showTranslation && (
                <p className="text-gray-400 text-xs mt-1 whitespace-pre-line">{currentChunk.exemplo.pt}</p>
              )}
            </div>

            {/* Nota */}
            {currentChunk.nota && (
              <p className="text-yellow-300/80 text-xs italic">{currentChunk.nota}</p>
            )}
          </div>

          {/* Listen to example */}
          <button
            onClick={() => speak(currentChunk.exemplo.en.replace(/—/g, '').replace(/\n/g, ' '), getCharInfo(currentChunk.who).ttsVoice)}
            className="w-full py-3 rounded-xl mb-4 flex items-center justify-center gap-2 text-sm font-medium"
            style={{ background: `${CHARACTER_COLORS[currentChunk.who]}20`, color: CHARACTER_COLORS[currentChunk.who], border: `1px solid ${CHARACTER_COLORS[currentChunk.who]}40` }}
          >
            <Volume2 size={16} /> Ouvir exemplo com sotaque
          </button>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setChunkIndex(prev => Math.max(0, prev - 1)); setShowTranslation(false); }}
              disabled={chunkIndex === 0}
              className="flex-1 border-white/20 text-white"
            >
              <ChevronLeft size={16} /> Anterior
            </Button>
            <Button
              onClick={() => {
                if (chunkIndex < VALENTINE_CHUNKS.length - 1) {
                  setChunkIndex(prev => prev + 1);
                  setShowTranslation(false);
                } else {
                  setTotalPoints(prev => prev + 120);
                  setSection('home');
                }
              }}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
            >
              {chunkIndex === VALENTINE_CHUNKS.length - 1 ? 'Concluir! +120pts' : 'Próximo'}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Section
  if (section === 'quiz') {
    if (quizComplete) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Completo!</h2>
            <p className="text-pink-300 text-lg mb-4">{quizScore}/{VALENTINE_QUIZ.length * 10} pontos</p>
            <div className="flex gap-2 mb-6 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={24} className={i < Math.ceil((quizScore / (VALENTINE_QUIZ.length * 10)) * 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
              ))}
            </div>
            <Button onClick={() => setSection('home')} className="bg-pink-600 hover:bg-pink-700 text-white px-8">
              Voltar ao Menu
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-8" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
        <div className="max-w-md mx-auto px-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSection('home')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-yellow-400" />
              <span className="text-white font-bold text-sm">Culture Quiz</span>
            </div>
            <span className="text-yellow-300 text-xs font-bold">{quizScore} pts</span>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-6">
            <div
              className="h-full rounded-full transition-all duration-300 bg-yellow-400"
              style={{ width: `${((quizIndex + 1) / VALENTINE_QUIZ.length) * 100}%` }}
            />
          </div>

          {/* Character */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2" style={{ borderColor: CHARACTER_COLORS[currentQuiz.character] }}>
              <img src={getCharImage(currentQuiz.character)} alt="" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{getCharInfo(currentQuiz.character).name} pergunta:</p>
              <p className="text-gray-400 text-xs">{getCharInfo(currentQuiz.character).city}</p>
            </div>
          </div>

          {/* Question */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-white font-medium text-sm mb-1">{currentQuiz.question}</p>
            <p className="text-gray-400 text-xs">{currentQuiz.questionPt}</p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2 mb-4">
            {currentQuiz.options.map(option => {
              let optionStyle = "bg-white/5 border-white/10 text-white";
              if (quizAnswered) {
                if (option.correct) optionStyle = "bg-green-500/20 border-green-500/50 text-green-300";
                else if (option.id === quizAnswered && !option.correct) optionStyle = "bg-red-500/20 border-red-500/50 text-red-300";
              }
              return (
                <button
                  key={option.id}
                  onClick={() => handleQuizAnswer(option.id)}
                  disabled={!!quizAnswered}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${optionStyle}`}
                >
                  <span className="flex items-center gap-2">
                    {quizAnswered && option.correct && <Check size={14} className="text-green-400" />}
                    {quizAnswered && option.id === quizAnswered && !option.correct && <X size={14} className="text-red-400" />}
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {quizAnswered && (
            <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
              <p className="text-yellow-200 text-sm">{currentQuiz.explanation}</p>
              <p className="text-yellow-200/60 text-xs mt-1">{currentQuiz.explanationPt}</p>
            </div>
          )}

          {/* Next */}
          {quizAnswered && (
            <Button onClick={nextQuiz} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              {quizIndex === VALENTINE_QUIZ.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Curiosities Section
  if (section === 'curiosities') {
    return (
      <div className="min-h-screen pb-8" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
        <div className="max-w-md mx-auto px-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSection('home')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-purple-400" />
              <span className="text-white font-bold text-sm">Curiosities</span>
            </div>
            <span className="text-gray-400 text-xs">{curiosityIndex + 1}/{VALENTINE_CURIOSITIES.length}</span>
          </div>

          {/* Character */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-xl"
              style={{ borderColor: CHARACTER_COLORS[currentCuriosity.character], boxShadow: `0 8px 30px ${CHARACTER_COLORS[currentCuriosity.character]}50` }}
            >
              <img src={getCharImage(currentCuriosity.character)} alt="" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-4xl mb-2">{currentCuriosity.emoji}</p>
            <p className="text-white font-bold">{getCharInfo(currentCuriosity.character).name} • {currentCuriosity.city}</p>
          </div>

          {/* Fact Card */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${CHARACTER_COLORS[currentCuriosity.character]}33` }}>
            <h3 className="text-white font-bold text-lg mb-2">{currentCuriosity.titleEn}</h3>
            <p className="text-gray-200 text-sm mb-4">{currentCuriosity.factEn}</p>

            <button
              onClick={() => speak(currentCuriosity.factEn, getCharInfo(currentCuriosity.character).ttsVoice)}
              className="flex items-center gap-2 text-sm mb-4"
              style={{ color: CHARACTER_COLORS[currentCuriosity.character] }}
            >
              <Volume2 size={14} /> Listen
            </button>

            <div className="border-t border-white/10 pt-3">
              <p className="text-gray-400 text-xs font-medium mb-1">{currentCuriosity.titlePt}</p>
              <p className="text-gray-400 text-xs">{currentCuriosity.factPt}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCuriosityIndex(prev => Math.max(0, prev - 1))}
              disabled={curiosityIndex === 0}
              className="flex-1 border-white/20 text-white"
            >
              <ChevronLeft size={16} /> Anterior
            </Button>
            <Button
              onClick={() => {
                if (curiosityIndex < VALENTINE_CURIOSITIES.length - 1) {
                  setCuriosityIndex(prev => prev + 1);
                } else {
                  setTotalPoints(prev => prev + 60);
                  setSection('home');
                }
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {curiosityIndex === VALENTINE_CURIOSITIES.length - 1 ? 'Concluir! +60pts' : 'Próximo'}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vocab Comparison Section
  if (section === 'vocab') {
    const filteredVocab = VOCAB_COMPARISONS.filter(v => v.category === vocabCategory);

    return (
      <div className="min-h-screen pb-8" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
        <div className="max-w-md mx-auto px-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSection('home')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Utensils size={16} className="text-green-400" />
              <span className="text-white font-bold text-sm">Vocab Battle</span>
            </div>
            <span className="text-gray-400 text-xs">US vs UK vs AU</span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-5">
            {[
              { key: 'food' as const, label: '🍔 Food', color: '#4caf50' },
              { key: 'restaurant' as const, label: '🍽️ Restaurant', color: '#2196f3' },
              { key: 'romantic' as const, label: '💕 Romantic', color: '#e91e63' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setVocabCategory(cat.key)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  vocabCategory === cat.key
                    ? 'text-white shadow-lg'
                    : 'bg-white/5 text-gray-400'
                }`}
                style={vocabCategory === cat.key ? { background: `${cat.color}30`, border: `1px solid ${cat.color}50`, boxShadow: `0 4px 15px ${cat.color}20` } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Vocab Table */}
          <div className="flex flex-col gap-2">
            {filteredVocab.map(vocab => (
              <div key={vocab.id} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{vocab.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{vocab.item}</p>
                    <p className="text-gray-500 text-xs">{vocab.itemPt}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="rounded-lg p-2 text-center" style={{ background: "rgba(229,57,53,0.1)" }}>
                    <p className="text-[10px] text-gray-400">🇺🇸 US</p>
                    <p className="text-white text-xs font-medium">{vocab.us}</p>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={{ background: "rgba(136,14,79,0.1)" }}>
                    <p className="text-[10px] text-gray-400">🇬🇧 UK</p>
                    <p className="text-white text-xs font-medium">{vocab.uk}</p>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={{ background: "rgba(255,111,0,0.1)" }}>
                    <p className="text-[10px] text-gray-400">🇦🇺 AU</p>
                    <p className="text-white text-xs font-medium">{vocab.au}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Done button */}
          <Button
            onClick={() => { setTotalPoints(prev => prev + 80); setSection('home'); }}
            className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white"
          >
            Concluir! +80pts <Check size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // Restaurant Food Challenge Section
  if (section === 'restaurant') {
    const handleSendChat = async () => {
      if (!chatInput.trim() || chatLoading) return;
      const userMsg = chatInput.trim();
      setChatInput('');
      const newMessages = [...chatMessages, { role: 'user' as const, content: userMsg }];
      setChatMessages(newMessages);
      setChatLoading(true);
      setMessageCount(prev => prev + 1);
      try {
        const result = await sendChatMessage.mutateAsync({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        });
        setChatMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
        // Check if order is complete (after 6+ messages from user)
        if (messageCount >= 5) {
          setOrderComplete(true);
        }
      } catch {
        setChatMessages(prev => [...prev, { role: 'assistant', content: "[Lucas] Oops! The kitchen got a bit hectic. Could you try again?" }]);
      } finally {
        setChatLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d0a1e 100%)" }}>
        <div className="max-w-md mx-auto px-4 pt-6 flex-1 flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSection('home')} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-red-400" />
              <span className="text-white font-bold text-sm">Food Challenge</span>
            </div>
            <span className="text-gray-400 text-xs">{messageCount} msgs</span>
          </div>

          {/* Characters strip */}
          <div className="flex justify-center gap-2 mb-3">
            {(['lucas', 'emily', 'aiko'] as Character[]).map(char => (
              <div key={char} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: `${CHARACTER_COLORS[char]}15`, border: `1px solid ${CHARACTER_COLORS[char]}30` }}>
                <img src={getCharImage(char)} alt={getCharInfo(char).name} className="w-6 h-6 rounded-full object-cover object-top" />
                <span className="text-white text-[10px] font-medium">{getCharInfo(char).name}</span>
                <span className="text-[10px]">{getCharInfo(char).roleEmoji}</span>
              </div>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto rounded-2xl p-3 mb-3 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minHeight: '300px', maxHeight: 'calc(100vh - 280px)' }}>
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border-2" style={{ borderColor: CHARACTER_COLORS.lucas }}>
                  <img src={getCharImage('lucas')} alt="Lucas" className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-white font-bold text-sm mb-1">Welcome to inFlux Restaurant!</p>
                <p className="text-gray-400 text-xs mb-4">Faça seu pedido em inglês! Lucas, Emily e Aiko vão te atender.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Hi! I'd like to see the menu", "Hello! Table for two, please", "Good evening! What do you recommend?"].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => { setChatInput(prompt); }}
                      className="px-3 py-1.5 rounded-xl text-xs text-pink-300 transition-all active:scale-95"
                      style={{ background: "rgba(233,30,99,0.1)", border: "1px solid rgba(233,30,99,0.2)" }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatMessages.map((msg, idx) => {
              // Detect which character is speaking
              const charMatch = msg.role === 'assistant' ? msg.content.match(/^\[(Lucas|Emily|Aiko)\]/) : null;
              const speakingChar = charMatch ? charMatch[1].toLowerCase() as Character : null;
              return (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && speakingChar && (
                    <img src={getCharImage(speakingChar)} alt={speakingChar} className="w-8 h-8 rounded-full object-cover object-top shrink-0 mt-1" style={{ border: `2px solid ${CHARACTER_COLORS[speakingChar]}` }} />
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-100'}`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #e91e63, #c2185b)' }
                      : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  >
                    <p className="whitespace-pre-wrap">{msg.role === 'assistant' && speakingChar ? msg.content.replace(/^\[(Lucas|Emily|Aiko)\]\s*/, '') : msg.content}</p>
                  </div>
                </div>
              );
            })}
            {chatLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Loader2 size={14} className="text-pink-400 animate-spin" />
                </div>
                <div className="rounded-2xl px-3 py-2 text-sm text-gray-400" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  typing...
                </div>
              </div>
            )}
          </div>

          {/* Order Complete Banner */}
          {orderComplete && (
            <div className="rounded-xl p-3 mb-3 text-center" style={{ background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)' }}>
              <p className="text-green-300 text-sm font-bold">Order complete! Great job!</p>
              <Button
                onClick={() => { setTotalPoints(prev => prev + 150); setSection('home'); }}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm"
                size="sm"
              >
                Concluir! +150pts <Check size={14} className="ml-1" />
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 pb-4">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
              placeholder="Type your order in English..."
              className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              disabled={chatLoading}
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim() || chatLoading}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #e91e63, #c2185b)' }}
            >
              {chatLoading ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Mission Button Component
function MissionButton({ icon, title, description, points, onClick, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: number;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
      style={{ background: `${color}10`, border: `1px solid ${color}30` }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold" style={{ color }}>{points}pts</p>
        <ChevronRight size={14} className="text-gray-500" />
      </div>
    </button>
  );
}
