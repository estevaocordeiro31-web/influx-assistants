import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Film, User, Play, FileText } from 'lucide-react';
import { AnimationScriptCard } from './AnimationScriptCard';
import { VideoPlayer } from './VideoPlayer';
import { ALL_ANIMATION_SCRIPTS, getScriptsByCharacter } from '@/data/animation-scripts';

// Configuração dos vídeos disponíveis
const AVAILABLE_VIDEOS = [
  {
    id: 'lucas-loch-ness',
    title: 'Lucas e o Lago Ness',
    character: 'lucas' as const,
    duration: '48s',
    thumbnail: '/videos/lucas-loch-ness/scene01-arrival.png',
    videos: {
      noSubs: '/videos/lucas-loch-ness/lucas-loch-ness-animated.mp4',
      englishOnly: '/videos/lucas-loch-ness/lucas-loch-ness-english-subs.mp4',
      dualSubs: '/videos/lucas-loch-ness/lucas-loch-ness-dual-subs.mp4',
    }
  },
  // Mais vídeos serão adicionados aqui
];

export function AnimationScriptsTab() {
  const [selectedCharacter, setSelectedCharacter] = useState<'all' | 'lucas' | 'emily' | 'aiko'>('all');
  const [viewMode, setViewMode] = useState<'videos' | 'scripts'>('videos');

  const filteredScripts = selectedCharacter === 'all' 
    ? ALL_ANIMATION_SCRIPTS 
    : getScriptsByCharacter(selectedCharacter);

  const characterTabs = [
    { id: 'all', label: 'Todos', emoji: '🎬', count: ALL_ANIMATION_SCRIPTS.length },
    { id: 'lucas', label: 'Lucas', emoji: '🇺🇸', count: getScriptsByCharacter('lucas').length },
    { id: 'emily', label: 'Emily', emoji: '🇬🇧', count: getScriptsByCharacter('emily').length },
    { id: 'aiko', label: 'Aiko', emoji: '🇦🇺', count: getScriptsByCharacter('aiko').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Film className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">Animation Stories</h2>
        </div>
        <p className="text-gray-600">
          Histórias curtas e divertidas dos personagens para aprender chunks e expressões
        </p>
      </div>

      {/* Toggle Vídeos / Roteiros */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('videos')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            viewMode === 'videos'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="font-medium">Assistir Vídeos</span>
        </button>
        <button
          onClick={() => setViewMode('scripts')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            viewMode === 'scripts'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Ver Roteiros</span>
        </button>
      </div>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'videos' ? (
        <>
          {/* Seção de Vídeos */}
          <div className="space-y-6">
            {AVAILABLE_VIDEOS.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {AVAILABLE_VIDEOS.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    title={video.title}
                    character={video.character}
                    thumbnail={video.thumbnail}
                    videos={video.videos}
                    duration={video.duration}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Vídeos em produção...</p>
              </div>
            )}

            {/* Próximos vídeos */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-3">🎬 Próximos Vídeos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <p className="font-medium text-gray-700">Emily no Texas</p>
                    <p className="text-sm text-gray-500">Em breve...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                  <span className="text-2xl">🇦🇺</span>
                  <div>
                    <p className="font-medium text-gray-700">Aiko em Nova York</p>
                    <p className="text-sm text-gray-500">Em breve...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filtro por personagem */}
          <div className="flex flex-wrap justify-center gap-2">
            {characterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCharacter(tab.id as typeof selectedCharacter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCharacter === tab.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.emoji}</span>
                <span className="font-medium">{tab.label}</span>
                <Badge 
                  variant={selectedCharacter === tab.id ? "secondary" : "outline"}
                  className={selectedCharacter === tab.id ? "bg-white/20 text-white" : ""}
                >
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Grid de roteiros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScripts.map((script) => (
              <AnimationScriptCard key={script.id} script={script} />
            ))}
          </div>
        </>
      )}

      {/* Dica */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-purple-700">Dica de Aprendizado</h4>
            <p className="text-sm text-gray-600">
              Ouça cada cena várias vezes e repita em voz alta! Preste atenção no <strong>connected speech</strong> - 
              é assim que nativos realmente falam no dia a dia. Tente imitar a entonação e o ritmo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
