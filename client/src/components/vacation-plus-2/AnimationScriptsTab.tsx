import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Film, Play, FileText, Globe } from 'lucide-react';
import { AnimationScriptCard } from './AnimationScriptCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ALL_ANIMATION_SCRIPTS, getScriptsByCharacter } from '@/data/animation-scripts';

// Configuração dos vídeos disponíveis - Todos os 3 personagens
const AVAILABLE_VIDEOS = [
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
  },
];

export function AnimationScriptsTab() {
  const [selectedCharacter, setSelectedCharacter] = useState<'all' | 'lucas' | 'emily' | 'aiko'>('all');
  const [viewMode, setViewMode] = useState<'videos' | 'scripts'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<typeof AVAILABLE_VIDEOS[0] | null>(null);

  const filteredScripts = selectedCharacter === 'all' 
    ? ALL_ANIMATION_SCRIPTS 
    : getScriptsByCharacter(selectedCharacter);

  const filteredVideos = selectedCharacter === 'all'
    ? AVAILABLE_VIDEOS
    : AVAILABLE_VIDEOS.filter(v => v.character === selectedCharacter);

  const characterTabs = [
    { id: 'all', label: 'Todos', emoji: '🎬', count: ALL_ANIMATION_SCRIPTS.length },
    { id: 'lucas', label: 'Lucas', emoji: '🇺🇸', count: getScriptsByCharacter('lucas').length },
    { id: 'emily', label: 'Emily', emoji: '🇬🇧', count: getScriptsByCharacter('emily').length },
    { id: 'aiko', label: 'Aiko', emoji: '🇦🇺', count: getScriptsByCharacter('aiko').length },
  ];

  // Se um vídeo está selecionado, mostrar o player
  if (selectedVideo) {
    return (
      <div className="space-y-4">
        {/* Botão Voltar */}
        <button
          onClick={() => setSelectedVideo(null)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-base sm:text-lg py-2"
        >
          ← Voltar para animações
        </button>

        {/* Video Player */}
        <div className="rounded-xl overflow-hidden shadow-xl">
          <VideoPlayer
            src={selectedVideo.videoUrl}
            title={selectedVideo.title}
            poster={selectedVideo.thumbnail}
            subtitles={selectedVideo.subtitles}
            className="aspect-video"
          />
        </div>

        {/* Info do Vídeo */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
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

      {/* Toggle Vídeos / Roteiros - Otimizado para Mobile */}
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
          <span className="font-medium">Vídeos</span>
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

      {/* Filtro por personagem - Otimizado para Mobile */}
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
            <Badge 
              variant={selectedCharacter === tab.id ? "secondary" : "outline"}
              className={`text-xs ${selectedCharacter === tab.id ? "bg-white/20 text-white" : ""}`}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'videos' ? (
        <>
          {/* Grid de Vídeos - Otimizado para Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 text-2xl sm:text-3xl">
                    {video.flag}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      {video.character === 'lucas' ? 'Lucas' : video.character === 'emily' ? 'Emily' : 'Aiko'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {video.accent}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Próximos vídeos */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg border border-blue-200 mx-2 sm:mx-0">
            <h3 className="font-semibold text-blue-700 mb-3 text-sm sm:text-base">🎬 Próximos Vídeos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                <span className="text-xl sm:text-2xl">🇺🇸</span>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Lucas in New York</p>
                  <p className="text-xs sm:text-sm text-gray-500">Em breve...</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 p-3 rounded-lg">
                <span className="text-xl sm:text-2xl">🇬🇧</span>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Emily in Paris</p>
                  <p className="text-xs sm:text-sm text-gray-500">Em breve...</p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Dica */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-200 mx-2 sm:mx-0">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-purple-700 text-sm sm:text-base">Dica de Aprendizado</h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Ouça cada cena várias vezes e repita em voz alta! Preste atenção no <strong>connected speech</strong> - 
              é assim que nativos realmente falam no dia a dia. Tente imitar a entonação e o ritmo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
