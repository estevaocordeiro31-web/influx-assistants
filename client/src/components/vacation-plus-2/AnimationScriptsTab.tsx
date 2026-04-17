import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Film, Play, FileText, Globe, BookOpen, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { AnimationScriptCard } from './AnimationScriptCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoQuiz } from './VideoQuiz';
import { ALL_ANIMATION_SCRIPTS, getScriptsByCharacter } from '@/data/animation-scripts';
import { getQuizByVideoId } from '@/data/vacation-plus-2-quizzes';

// Vídeos do Vacation Plus 2 (8 Units)
const VACATION_PLUS_2_VIDEOS = [
  {
    id: 'vp2-unit1',
    title: "Unit 1: Going on Vacation",
    character: 'lucas' as const,
    flag: '🇺🇸',
    description: "Lucas at the Airport - JFK, New York. Aprenda expressões sobre viagens e aeroportos!",
    duration: '0:29',
    accent: 'American English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/XlCtRstbLoqDlKCx.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit2',
    title: "Unit 2: Eating Out",
    character: 'emily' as const,
    flag: '🇬🇧',
    description: "Emily's Restaurant Adventure - London. Aprenda a pedir comida e dar gorjeta!",
    duration: '0:25',
    accent: 'British English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/aGcXureUgMCJIlpd.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit3',
    title: "Unit 3: Around Town",
    character: 'aiko' as const,
    flag: '🇦🇺',
    description: "Aiko Explores Downtown Sydney. Aprenda a pedir direções e usar transporte público!",
    duration: '0:19',
    accent: 'Australian English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/idiFjoOMQmWLofpx.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit4',
    title: "Unit 4: Describing People",
    character: 'lucas' as const,
    flag: '🇺🇸',
    description: "Lucas Describes His Squad - Central Park. Aprenda a descrever pessoas e personalidades!",
    duration: '0:21',
    accent: 'American English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/LNHQCpAnWjcbWFpP.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit5',
    title: "Unit 5: Shopping",
    character: 'emily' as const,
    flag: '🇬🇧',
    description: "Emily Goes Shopping - Oxford Street. Aprenda a fazer compras e pagar!",
    duration: '0:18',
    accent: 'British English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/uGPcSpRnUkmezPRs.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit6',
    title: "Unit 6: Giving Advice",
    character: 'aiko' as const,
    flag: '🇦🇺',
    description: "Aiko's Life Advice - Bondi Beach. Aprenda a dar conselhos e sugestões!",
    duration: '0:21',
    accent: 'Australian English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/eXWCoukKvDKXastA.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit7',
    title: "Unit 7: Talking About Hobbies",
    character: 'lucas' as const,
    flag: '🇺🇸',
    description: "Lucas and His Hobbies - NYC. Aprenda a falar sobre hobbies e tempo livre!",
    duration: '0:23',
    accent: 'American English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/nzhpenBvndqVtZCS.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
  {
    id: 'vp2-unit8',
    title: "Unit 8: Future Plans",
    character: 'emily' as const,
    flag: '🇬🇧',
    description: "Emily's Future Plans - London Eye. Aprenda a falar sobre planos e sonhos!",
    duration: '0:19',
    accent: 'British English',
    thumbnail: '',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/TKTRxXShWotkGaGJ.mp4',
    subtitles: [] as { label: string; srclang: string; src: string }[],
    category: 'vacation-plus-2' as const,
    hasQuiz: true,
  },
];

// Animações Especiais (histórias completas)
const SPECIAL_ANIMATIONS = [
  {
    id: 'lucas-lochness',
    title: "Lucas and the Loch Ness",
    character: 'lucas' as const,
    flag: '🇺🇸',
    description: "Lucas travels to Scotland and dreams of meeting the legendary Loch Ness Monster!",
    duration: '1:01',
    accent: 'American English',
    thumbnail: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/HKJrxYrZsLNxrhVB.png',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/qcOCQVBVeNQFIbFC.mp4',
    subtitles: [
      {
        label: 'English',
        srclang: 'en',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/hVUlQIilaYzdHCtF.vtt',
      },
      {
        label: 'Português',
        srclang: 'pt',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/cHwyEDYUSYpCwLkx.vtt',
      },
    ],
    category: 'special' as const,
    hasQuiz: false,
  },
  {
    id: 'emily-texas',
    title: "Emily's Texas Adventure",
    character: 'emily' as const,
    flag: '🇬🇧',
    description: "Emily visits Texas and discovers that everything is bigger in the Lone Star State!",
    duration: '1:03',
    accent: 'British English',
    thumbnail: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/LpGXrOihHjIjpArw.png',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/WDmUXTecOMowvCJM.mp4',
    subtitles: [
      {
        label: 'English',
        srclang: 'en',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/kYXLktuonKmxIgip.vtt',
      },
      {
        label: 'Português',
        srclang: 'pt',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/ApdiNOiDEXLsZaXX.vtt',
      },
    ],
    category: 'special' as const,
    hasQuiz: false,
  },
  {
    id: 'aiko-sydney',
    title: "Aiko's Sydney Tour",
    character: 'aiko' as const,
    flag: '🇦🇺',
    description: "Aiko explores Sydney and experiences Australian culture, from the Opera House to Vegemite!",
    duration: '0:57',
    accent: 'Australian English',
    thumbnail: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/tBESoEpKJJPSiKTO.png',
    videoUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/eNdjiqugGmEJQgRE.mp4',
    subtitles: [
      {
        label: 'English',
        srclang: 'en',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/TrnCGIZtijlTKymO.vtt',
      },
      {
        label: 'Português',
        srclang: 'pt',
        src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/rIvQroiZqgmnIxJN.vtt',
      },
    ],
    category: 'special' as const,
    hasQuiz: false,
  },
];

// Combinar todos os vídeos
const AVAILABLE_VIDEOS = [...VACATION_PLUS_2_VIDEOS, ...SPECIAL_ANIMATIONS];

// Helper para obter resultados de quiz do localStorage
const getQuizResults = () => {
  try {
    return JSON.parse(localStorage.getItem('vp2-quiz-results') || '{}');
  } catch {
    return {};
  }
};

export function AnimationScriptsTab() {
  const [selectedCharacter, setSelectedCharacter] = useState<'all' | 'lucas' | 'emily' | 'aiko'>('all');
  const [viewMode, setViewMode] = useState<'videos' | 'scripts'>('videos');
  const [videoCategory, setVideoCategory] = useState<'all' | 'vacation-plus-2' | 'special'>('all');
  const [selectedVideo, setSelectedVideo] = useState<typeof AVAILABLE_VIDEOS[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<string, { score: number; passed: boolean }>>({});

  // Carregar resultados de quiz ao montar
  useEffect(() => {
    setQuizResults(getQuizResults());
  }, []);

  const filteredScripts = selectedCharacter === 'all' 
    ? ALL_ANIMATION_SCRIPTS 
    : getScriptsByCharacter(selectedCharacter);

  const filteredVideos = AVAILABLE_VIDEOS.filter(v => {
    const matchesCharacter = selectedCharacter === 'all' || v.character === selectedCharacter;
    const matchesCategory = videoCategory === 'all' || v.category === videoCategory;
    return matchesCharacter && matchesCategory;
  });

  const characterTabs = [
    { id: 'all', label: 'Todos', emoji: '🎬', count: ALL_ANIMATION_SCRIPTS.length },
    { id: 'lucas', label: 'Lucas', emoji: '🇺🇸', count: getScriptsByCharacter('lucas').length },
    { id: 'emily', label: 'Emily', emoji: '🇬🇧', count: getScriptsByCharacter('emily').length },
    { id: 'aiko', label: 'Aiko', emoji: '🇦🇺', count: getScriptsByCharacter('aiko').length },
  ];

  const categoryTabs = [
    { id: 'all', label: 'Todos', icon: Film, count: AVAILABLE_VIDEOS.length },
    { id: 'vacation-plus-2', label: 'Vacation Plus 2', icon: BookOpen, count: VACATION_PLUS_2_VIDEOS.length },
    { id: 'special', label: 'Especiais', icon: Sparkles, count: SPECIAL_ANIMATIONS.length },
  ];

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Se o vídeo tem quiz e ainda não foi completado com sucesso, mostrar quiz
    if (selectedVideo?.hasQuiz) {
      const result = quizResults[selectedVideo.id];
      if (!result?.passed) {
        setTimeout(() => setShowQuiz(true), 1000);
      }
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (selectedVideo) {
      const newResults = {
        ...quizResults,
        [selectedVideo.id]: { score, passed }
      };
      setQuizResults(newResults);
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  const handleBackToList = () => {
    setSelectedVideo(null);
    setShowQuiz(false);
    setVideoEnded(false);
    // Atualizar resultados ao voltar
    setQuizResults(getQuizResults());
  };

  // Se um vídeo está selecionado, mostrar o player
  if (selectedVideo) {
    const quiz = selectedVideo.hasQuiz ? getQuizByVideoId(selectedVideo.id) : null;
    const quizResult = quizResults[selectedVideo.id];

    return (
      <div className="space-y-4">
        {/* Botão Voltar */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-base sm:text-lg py-2"
        >
          ← Voltar para animações
        </button>

        {/* Quiz Modal */}
        {showQuiz && quiz && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <VideoQuiz
                quiz={quiz}
                onComplete={handleQuizComplete}
                onClose={handleCloseQuiz}
              />
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="rounded-xl overflow-hidden shadow-xl">
          <VideoPlayer
            src={selectedVideo.videoUrl}
            title={selectedVideo.title}
            poster={selectedVideo.thumbnail || undefined}
            subtitles={selectedVideo.subtitles}
            className="aspect-video"
            onEnded={handleVideoEnd}
          />
        </div>

        {/* Info do Vídeo */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {selectedVideo.category === 'vacation-plus-2' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Vacation Plus 2
              </span>
            )}
            {selectedVideo.category === 'special' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Especial
              </span>
            )}
            {/* Quiz Status Badge */}
            {selectedVideo.hasQuiz && quizResult && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                quizResult.passed 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {quizResult.passed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Quiz: {quizResult.score}%
                  </>
                ) : (
                  <>Quiz: {quizResult.score}%</>
                )}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {selectedVideo.title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">{selectedVideo.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
            <span className="flex items-center gap-1 sm:gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
              <span className="text-lg sm:text-xl">{selectedVideo.flag}</span>
              <span className="font-medium">{selectedVideo.character === 'lucas' ? 'Lucas' : selectedVideo.character === 'emily' ? 'Emily' : 'Aiko'}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <Globe className="w-4 h-4" />
              <span>{selectedVideo.accent}</span>
            </span>
            <span className="text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              {selectedVideo.duration}
            </span>
          </div>

          {/* Legendas disponíveis */}
          {selectedVideo.subtitles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Legendas disponíveis:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.subtitles.map((sub) => (
                  <span
                    key={sub.srclang}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {sub.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info sobre legendas embutidas */}
          {selectedVideo.category === 'vacation-plus-2' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Legendas embutidas: Inglês (branco) + Português (amarelo)
              </p>
            </div>
          )}

          {/* Quiz Section */}
          {selectedVideo.hasQuiz && quiz && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-700">Quiz de Compreensão</span>
                </div>
                {quizResult?.passed ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Completado ({quizResult.score}%)
                  </span>
                ) : (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {quizResult ? 'Tentar Novamente' : 'Fazer Quiz'}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {quiz.questions.length} perguntas • Mínimo {quiz.passingScore}% para passar • +{quiz.reward} influxcoins
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Film className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Animation Stories</h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base px-2">
          Histórias curtas e divertidas dos personagens para aprender chunks e expressões
        </p>
      </div>

      {/* Toggle Vídeos / Roteiros */}
      <div className="flex justify-center gap-2 px-2">
        <button
          onClick={() => setViewMode('videos')}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
            viewMode === 'videos'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Vídeos ({AVAILABLE_VIDEOS.length})</span>
        </button>
        <button
          onClick={() => setViewMode('scripts')}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
            viewMode === 'scripts'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium">Roteiros</span>
        </button>
      </div>

      {/* Filtro por categoria de vídeo (apenas no modo vídeos) */}
      {viewMode === 'videos' && (
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setVideoCategory(tab.id as typeof videoCategory)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-xs sm:text-sm ${
                  videoCategory === tab.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium">{tab.label}</span>
                <Badge 
                  variant={videoCategory === tab.id ? "secondary" : "outline"}
                  className={`text-xs ${videoCategory === tab.id ? "bg-white/20 text-white" : ""}`}
                >
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>
      )}

      {/* Filtro por personagem */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
        {characterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCharacter(tab.id as typeof selectedCharacter)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-xs sm:text-sm ${
              selectedCharacter === tab.id
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-base sm:text-lg">{tab.emoji}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'videos' ? (
        <>
          {/* Grid de Vídeos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
            {filteredVideos.map((video) => {
              const quizResult = quizResults[video.id];
              return (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer group text-left w-full"
                  type="button"
                >
                  {/* Thumbnail ou Placeholder */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-pink-500">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                          <span className="text-4xl sm:text-5xl block mb-2">{video.flag}</span>
                          <span className="text-xs sm:text-sm font-medium opacity-90">
                            {video.character === 'lucas' ? 'Lucas' : video.character === 'emily' ? 'Emily' : 'Aiko'}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Botão de play */}
                    <div className="absolute inset-0 bg-black/30 sm:bg-black/40 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                      {video.duration}
                    </div>
                    {/* Badge de categoria */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {video.category === 'vacation-plus-2' ? (
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          VP2
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Especial
                        </span>
                      )}
                    </div>
                    {/* Quiz completed badge */}
                    {video.hasQuiz && quizResult?.passed && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {quizResult.score}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-lg">{video.flag}</span>
                      <span className="text-xs text-gray-600 font-medium">
                        {video.character === 'lucas' ? 'Lucas' : video.character === 'emily' ? 'Emily' : 'Aiko'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {video.accent}
                      </span>
                      {video.hasQuiz && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${
                            quizResult?.passed ? 'text-green-600' : 'text-purple-600'
                          }`}>
                            <Trophy className="w-3 h-3" />
                            Quiz
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum vídeo encontrado com os filtros selecionados.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Grid de roteiros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
            {filteredScripts.map((script) => (
              <AnimationScriptCard key={script.id} script={script} />
            ))}
          </div>
        </>
      )}

      {/* Dica com Fluxie Thinking */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 sm:p-4 rounded-lg border border-purple-500/30 mx-2 sm:mx-0 shadow-lg shadow-purple-500/10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <img 
              src="/miss-elie-uniform-avatar.png" 
              alt="Fluxie Thinking" 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-400 text-sm sm:text-base flex items-center gap-2">
              💡 Dica de Aprendizado
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Fluxie</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {viewMode === 'videos' ? (
                <>Os vídeos do <strong className="text-green-400">Vacation Plus 2</strong> têm legendas embutidas em inglês e português. 
                Assista várias vezes e repita em voz alta para praticar o <strong className="text-cyan-400">connected speech</strong>!
                Depois, faça o <strong className="text-yellow-400">Quiz</strong> para testar sua compreensão e ganhar <strong className="text-yellow-400">influxcoins</strong>! 🏆</>
              ) : (
                <>Ouça cada cena várias vezes e repita em voz alta! Preste atenção no <strong className="text-cyan-400">connected speech</strong> - 
                é assim que nativos realmente falam no dia a dia. Tente imitar a entonação e o ritmo!</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
