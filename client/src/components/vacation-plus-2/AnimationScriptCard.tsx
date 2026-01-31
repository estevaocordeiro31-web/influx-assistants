import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Clock, MapPin, Sparkles, MessageCircle, BookOpen } from 'lucide-react';
import { AnimationScript, Scene } from '@/data/animation-scripts';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface AnimationScriptCardProps {
  script: AnimationScript;
}

const characterInfo = {
  lucas: {
    name: 'Lucas',
    flag: '🇺🇸',
    color: 'from-blue-500 to-red-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    image: '/characters/lucas-front.png'
  },
  emily: {
    name: 'Emily',
    flag: '🇬🇧',
    color: 'from-red-500 to-blue-700',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    image: '/characters/emily-front.png'
  },
  aiko: {
    name: 'Aiko',
    flag: '🇦🇺',
    color: 'from-green-500 to-yellow-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    image: '/characters/aiko-front.png'
  }
};

const emotionEmoji: Record<string, string> = {
  neutral: '😐',
  excited: '🤩',
  confused: '😕',
  scared: '😱',
  laughing: '😂',
  thinking: '🤔',
  surprised: '😮'
};

export function AnimationScriptCard({ script }: AnimationScriptCardProps) {
  const [playingScene, setPlayingScene] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);

  const character = characterInfo[script.character];
  
  const speakMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => {
      if (data.audioUrl) {
        if (currentAudio) {
          currentAudio.pause();
        }
        const audio = new Audio(data.audioUrl);
        setCurrentAudio(audio);
        audio.play();
        audio.onended = () => {
          setPlayingScene(null);
          setCurrentAudio(null);
        };
      }
    },
    onError: (error) => {
      toast.error('Erro ao gerar áudio: ' + error.message);
      setPlayingScene(null);
    }
  });

  const playSceneAudio = (scene: Scene) => {
    if (playingScene === scene.id) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setPlayingScene(null);
      return;
    }

    setPlayingScene(scene.id);
    speakMutation.mutate({
      text: scene.dialogue,
      character: script.character
    });
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setPlayingScene(null);
  };

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${character.color} p-4 text-white`}>
        <div className="flex items-center gap-4">
          <img 
            src={character.image} 
            alt={character.name}
            className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{character.flag}</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {character.name}
              </Badge>
            </div>
            <h3 className="text-xl font-bold">{script.title}</h3>
            <p className="text-sm opacity-90">{script.titlePt}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{script.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{script.setting}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <Tabs defaultValue="scenes" className="w-full">
          <TabsList className="w-full rounded-none border-b grid grid-cols-3">
            <TabsTrigger value="scenes" className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Cenas</span>
            </TabsTrigger>
            <TabsTrigger value="chunks" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Chunks</span>
            </TabsTrigger>
            <TabsTrigger value="culture" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Cultura</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba de Cenas */}
          <TabsContent value="scenes" className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {script.scenes.map((scene) => (
              <div 
                key={scene.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  expandedScene === scene.id 
                    ? `${character.bgColor} border-2` 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{emotionEmoji[scene.emotion]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Cena {scene.id}
                      </Badge>
                      {scene.soundEffect && (
                        <Badge variant="secondary" className="text-xs">
                          🔊 {scene.soundEffect}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`font-medium ${character.textColor}`}>
                      "{scene.dialogue}"
                    </p>
                    
                    {expandedScene === scene.id && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600 italic">
                          {scene.dialoguePt}
                        </p>
                        {scene.action && (
                          <p className="text-xs text-gray-500">
                            📍 {scene.action}
                          </p>
                        )}
                        {scene.visualNote && (
                          <p className="text-xs text-gray-500">
                            🎬 {scene.visualNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={playingScene === scene.id ? "destructive" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSceneAudio(scene);
                    }}
                    disabled={speakMutation.isPending && playingScene !== scene.id}
                    className="flex-shrink-0"
                  >
                    {playingScene === scene.id ? (
                      speakMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Aba de Chunks */}
          <TabsContent value="chunks" className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Expressões deste roteiro
              </h4>
              <p className="text-sm text-gray-500">
                Clique para ouvir a pronúncia
              </p>
            </div>
            
            {script.chunks.map((chunk, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${character.bgColor} border`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className={`font-bold ${character.textColor}`}>
                      "{chunk.chunk}"
                    </p>
                    <p className="text-sm text-gray-600">
                      {chunk.meaning}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      Ex: {chunk.example}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {chunk.connectedSpeech}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Connected Speech Section */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-700 mb-3">
                🗣️ Connected Speech
              </h4>
              <div className="space-y-2">
                {script.connectedSpeech.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 line-through">{item.original}</span>
                    <span className="text-gray-400">→</span>
                    <span className={`font-semibold ${character.textColor}`}>{item.spoken}</span>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {item.phonetic}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Aba de Cultura */}
          <TabsContent value="culture" className="p-4">
            <div className={`p-4 rounded-lg ${character.bgColor} border`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{character.flag}</span>
                <div>
                  <h4 className={`font-semibold ${character.textColor} mb-2`}>
                    Curiosidade Cultural
                  </h4>
                  <p className="text-gray-700 mb-3">
                    {script.culturalNote}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {script.culturalNotePt}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
