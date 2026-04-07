import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Loader2, RotateCcw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Chunk } from "@/data/vacation-plus-2-expanded";

interface ChunkCardProps {
  chunk: Chunk;
  lessonId: number;
}

export function ChunkCard({ chunk, lessonId }: ChunkCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingCharacter, setPlayingCharacter] = useState<string | null>(null);
  const [loadingCharacter, setLoadingCharacter] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakMutation = trpc.tts.speak.useMutation({
    onError: (error) => {
      toast.error("Erro ao gerar áudio: " + error.message);
      setLoadingCharacter(null);
    },
  });

  const playAudio = async (character: "lucas" | "emily" | "aiko") => {
    if (playingCharacter === character && audioRef.current) {
      audioRef.current.pause();
      setPlayingCharacter(null);
      return;
    }

    setLoadingCharacter(character);

    try {
      const text = chunk.audioText[character];
      const result = await speakMutation.mutateAsync({
        text,
        character,
        situation: "casual",
      });

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(result.audioUrl);
      audioRef.current = audio;

      audio.onended = () => setPlayingCharacter(null);
      audio.onerror = () => {
        toast.error("Erro ao carregar áudio");
        setPlayingCharacter(null);
        setLoadingCharacter(null);
      };

      audio.onloadeddata = () => {
        audio.play().then(() => {
          setPlayingCharacter(character);
          setLoadingCharacter(null);
        }).catch(() => {
          toast.error("Clique novamente para ouvir");
          setLoadingCharacter(null);
        });
      };

      audio.load();
    } catch (error) {
      setLoadingCharacter(null);
    }
  };

  const characters = [
    { id: "lucas" as const, name: "Lucas", flag: "🇺🇸", color: "bg-blue-500" },
    { id: "emily" as const, name: "Emily", flag: "🇬🇧", color: "bg-red-500" },
    { id: "aiko" as const, name: "Aiko", flag: "🇦🇺", color: "bg-yellow-500" },
  ];

  return (
    <div 
      className="perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-[280px] transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Frente do Card */}
        <Card className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50 transition-all`}>
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-green-400 border-green-400/50">
                Chunk {chunk.id}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                "{chunk.expression}"
              </h3>
              <p className="text-slate-400 text-center text-sm">
                {chunk.meaning}
              </p>
            </div>

            {chunk.connectedSpeech && (
              <div className="mt-3 p-2 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 text-center">
                  🗣️ <span className="text-green-400">{chunk.connectedSpeech}</span>
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500 text-center mt-2">
              Clique para ver exemplos →
            </p>
          </CardContent>
        </Card>

        {/* Verso do Card */}
        <Card className={`absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700`}>
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-green-400">
                Exemplos por Sotaque
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {/* US Example */}
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-400">🇺🇸 US</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio("lucas");
                    }}
                  >
                    {loadingCharacter === "lucas" ? (
                      <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                    ) : (
                      <Volume2 className={`h-3 w-3 ${playingCharacter === "lucas" ? "text-green-400" : "text-blue-400"}`} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-300 mt-1">{chunk.examples.us}</p>
              </div>

              {/* UK Example */}
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-red-400">🇬🇧 UK</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio("emily");
                    }}
                  >
                    {loadingCharacter === "emily" ? (
                      <Loader2 className="h-3 w-3 animate-spin text-red-400" />
                    ) : (
                      <Volume2 className={`h-3 w-3 ${playingCharacter === "emily" ? "text-green-400" : "text-red-400"}`} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-300 mt-1">{chunk.examples.uk}</p>
              </div>

              {/* AU Example */}
              <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-400">🇦🇺 AU</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio("aiko");
                    }}
                  >
                    {loadingCharacter === "aiko" ? (
                      <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
                    ) : (
                      <Volume2 className={`h-3 w-3 ${playingCharacter === "aiko" ? "text-green-400" : "text-yellow-400"}`} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-300 mt-1">{chunk.examples.au}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center mt-2">
              ← Clique para voltar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
