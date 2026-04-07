import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Volume2, Lightbulb, MessageCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import type { TouristSpot } from '@/data/vacation-plus-2-real-english';

interface TouristSpotCardProps {
  spot: TouristSpot;
}

const CHARACTER_INFO = {
  lucas: { name: 'Lucas', flag: '🇺🇸', color: 'bg-blue-500', avatar: '/characters/lucas.png' },
  emily: { name: 'Emily', flag: '🇬🇧', color: 'bg-red-500', avatar: '/characters/emily.png' },
  aiko: { name: 'Aiko', flag: '🇦🇺', color: 'bg-green-500', avatar: '/characters/aiko.png' }
};

const CITY_INFO = {
  nyc: { name: 'New York', color: 'from-blue-600 to-blue-800' },
  london: { name: 'London', color: 'from-red-600 to-red-800' },
  sydney: { name: 'Sydney', color: 'from-green-600 to-green-800' }
};

export function TouristSpotCard({ spot }: TouristSpotCardProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showDialogues, setShowDialogues] = useState(false);
  
  const ttsMutation = trpc.tts.speak.useMutation({
    onSuccess: (data: { audioUrl?: string }) => {
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setPlayingIndex(null);
        audio.onerror = () => {
          setPlayingIndex(null);
          toast.error('Erro ao reproduzir áudio');
        };
        audio.play().catch(() => {
          setPlayingIndex(null);
          toast.error('Erro ao reproduzir áudio');
        });
      }
    },
    onError: (error: { message: string }) => {
      setPlayingIndex(null);
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handlePlayDialogue = (index: number, text: string) => {
    if (playingIndex !== null) return;
    
    setPlayingIndex(index);
    const charInfo = CHARACTER_INFO[spot.character];
    
    ttsMutation.mutate({
      text,
      character: spot.character
    });
  };

  const charInfo = CHARACTER_INFO[spot.character];
  const cityInfo = CITY_INFO[spot.city];

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Header com gradiente da cidade */}
      <div className={`bg-gradient-to-r ${cityInfo.color} p-4 text-white`}>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5" />
          <span className="text-sm opacity-90">{cityInfo.name}</span>
        </div>
        <CardTitle className="text-xl font-bold">{spot.name}</CardTitle>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Descrição */}
        <p className="text-muted-foreground">{spot.description}</p>

        {/* Dica local */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Local Tip</p>
            <p className="text-sm text-amber-600 dark:text-amber-300">{spot.localTip}</p>
          </div>
        </div>

        {/* Gírias usadas */}
        <div className="flex flex-wrap gap-2">
          {spot.slangUsed.map((slang, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {slang}
            </Badge>
          ))}
        </div>

        {/* Botão para mostrar diálogos */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowDialogues(!showDialogues)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {showDialogues ? 'Esconder Diálogos' : 'Ver Diálogos com ' + charInfo.name}
        </Button>

        {/* Diálogos */}
        {showDialogues && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src={charInfo.avatar} 
                alt={charInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{charInfo.name} {charInfo.flag}</p>
                <p className="text-xs text-muted-foreground">Apresentando {spot.name}</p>
              </div>
            </div>

            {spot.dialogue.map((line, index) => (
              <div 
                key={index}
                className="p-3 bg-muted/50 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">"{line.text}"</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0"
                    onClick={() => handlePlayDialogue(index, line.text)}
                    disabled={playingIndex !== null}
                  >
                    {playingIndex === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{line.translation}</p>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {line.connectedSpeech}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
