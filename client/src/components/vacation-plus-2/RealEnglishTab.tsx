import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, MapPin, MessageCircle, Lightbulb, Loader2, Globe, Mic } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { 
  getRealEnglishByLesson, 
  getDialogueSituationsByLesson,
  TOURIST_SPOTS,
  type RealEnglishPhrase,
  type DialogueSituation
} from '@/data/vacation-plus-2-real-english';
import { TouristSpotCard } from './TouristSpotCard';

interface RealEnglishTabProps {
  lessonId: string;
}

const CHARACTER_INFO = {
  lucas: { name: 'Lucas', flag: '🇺🇸', color: 'bg-blue-500', textColor: 'text-blue-600', avatar: '/characters/lucas.png' },
  emily: { name: 'Emily', flag: '🇬🇧', color: 'bg-red-500', textColor: 'text-red-600', avatar: '/characters/emily.png' },
  aiko: { name: 'Aiko', flag: '🇦🇺', color: 'bg-green-500', textColor: 'text-green-600', avatar: '/characters/aiko.png' }
};

const REGION_INFO = {
  us: { name: 'American English', flag: '🇺🇸', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  uk: { name: 'British English', flag: '🇬🇧', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  au: { name: 'Australian English', flag: '🇦🇺', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
};

function PhraseCard({ phrase }: { phrase: RealEnglishPhrase }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const ttsMutation = trpc.tts.speak.useMutation({
    onSuccess: (data: { audioUrl?: string }) => {
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          toast.error('Erro ao reproduzir áudio');
        };
        audio.play().catch(() => {
          setIsPlaying(false);
          toast.error('Erro ao reproduzir áudio');
        });
      }
    },
    onError: (error: { message: string }) => {
      setIsPlaying(false);
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handlePlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    ttsMutation.mutate({
      text: phrase.audioText,
      character: phrase.character
    });
  };

  const charInfo = CHARACTER_INFO[phrase.character];
  const regionInfo = REGION_INFO[phrase.region];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={regionInfo.color}>
            {regionInfo.flag} {regionInfo.name}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            {isPlaying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardTitle className="text-lg mt-2">"{phrase.phrase}"</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground">{phrase.meaning}</p>
        
        <div className="flex items-center gap-2">
          <img 
            src={charInfo.avatar} 
            alt={charInfo.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{charInfo.name} {charInfo.flag}</span>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mic className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Connected Speech:</span>
          </div>
          <p className="font-mono text-sm text-purple-600 dark:text-purple-400">{phrase.ipa}</p>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-amber-700 dark:text-amber-400">Contexto: </span>
            <span className="text-amber-600 dark:text-amber-300">{phrase.context}</span>
          </p>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-blue-700 dark:text-blue-400">Exemplo: </span>
            <span className="text-blue-600 dark:text-blue-300">"{phrase.example}"</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DialogueSituationCard({ situation }: { situation: DialogueSituation }) {
  const [playingLine, setPlayingLine] = useState<number | null>(null);
  
  const ttsMutation = trpc.tts.speak.useMutation({
    onSuccess: (data: { audioUrl?: string }) => {
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setPlayingLine(null);
        audio.onerror = () => {
          setPlayingLine(null);
          toast.error('Erro ao reproduzir áudio');
        };
        audio.play().catch(() => {
          setPlayingLine(null);
          toast.error('Erro ao reproduzir áudio');
        });
      }
    },
    onError: (error: { message: string }) => {
      setPlayingLine(null);
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handlePlayLine = (index: number, text: string, character: 'lucas' | 'emily' | 'aiko') => {
    if (playingLine !== null) return;
    setPlayingLine(index);
    ttsMutation.mutate({
      text,
      character
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm opacity-90">{situation.location}</span>
        </div>
        <CardTitle className="text-xl">{situation.title}</CardTitle>
        <p className="text-sm opacity-90">{situation.titlePt}</p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">{situation.scenario}</p>
          <p className="text-xs text-muted-foreground mt-1">{situation.scenarioPt}</p>
        </div>

        <div className="space-y-3">
          {situation.lines.map((line, index) => {
            const charInfo = CHARACTER_INFO[line.character];
            return (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  line.character === 'lucas' ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30' :
                  line.character === 'emily' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/30' :
                  'border-l-green-500 bg-green-50 dark:bg-green-950/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={charInfo.avatar} 
                      alt={charInfo.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{charInfo.name} {charInfo.flag}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePlayLine(index, line.text, line.character)}
                    disabled={playingLine !== null}
                  >
                    {playingLine === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm font-medium mb-1">"{line.text}"</p>
                <p className="text-xs text-muted-foreground mb-2">{line.translation}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                    {line.connectedSpeech}
                  </span>
                  {line.slangHighlight && (
                    <Badge variant="secondary" className="text-xs">
                      {line.slangHighlight}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Cultural Note</p>
            <p className="text-sm text-amber-600 dark:text-amber-300">{situation.culturalNote}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RealEnglishTab({ lessonId }: RealEnglishTabProps) {
  const phrases = getRealEnglishByLesson(lessonId);
  const situations = getDialogueSituationsByLesson(lessonId);
  
  // Filtrar pontos turísticos relevantes para a lição
  const lessonNumber = parseInt(lessonId.replace('lesson', ''));
  const spotIndex = Math.min(lessonNumber - 1, 2); // 0, 1, ou 2
  const relevantSpots = [
    TOURIST_SPOTS.filter(s => s.city === 'nyc')[spotIndex],
    TOURIST_SPOTS.filter(s => s.city === 'london')[spotIndex],
    TOURIST_SPOTS.filter(s => s.city === 'sydney')[spotIndex]
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="phrases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phrases" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Expressões</span>
          </TabsTrigger>
          <TabsTrigger value="situations" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Situações</span>
          </TabsTrigger>
          <TabsTrigger value="spots" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Lugares</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phrases" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">🗣️ Real English Expressions</h3>
            <p className="text-sm text-muted-foreground">
              Expressões autênticas usadas por jovens em cada região
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {phrases.map(phrase => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
          {phrases.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Expressões para esta lição em breve!
            </p>
          )}
        </TabsContent>

        <TabsContent value="situations" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">💬 Situações de Diálogo</h3>
            <p className="text-sm text-muted-foreground">
              Cenários reais onde essas expressões são usadas
            </p>
          </div>
          <div className="grid gap-4">
            {situations.map(situation => (
              <DialogueSituationCard key={situation.id} situation={situation} />
            ))}
          </div>
          {situations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Situações de diálogo para esta lição em breve!
            </p>
          )}
        </TabsContent>

        <TabsContent value="spots" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">📍 Pontos Turísticos</h3>
            <p className="text-sm text-muted-foreground">
              Conheça lugares incríveis com Lucas, Emily e Aiko
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relevantSpots.map(spot => (
              <TouristSpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
