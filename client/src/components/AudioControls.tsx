import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

/**
 * AudioControls - Controles de áudio para a interface
 * 
 * Permite ao usuário ajustar volume e mutar/desmutar sons
 */

export function AudioControls() {
  const { volume, setVolume, isMuted, toggleMute } = useSound();

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Controles de Áudio</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 px-2"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-4 w-4 mr-1" />
                  Mutado
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-1" />
                  Ativo
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Volume</span>
              <span className="text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              disabled={isMuted}
              className="w-full"
            />
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3">
            <p>🔊 Sons incluem:</p>
            <ul className="mt-1 space-y-1 ml-4">
              <li>✓ Validação de chunks</li>
              <li>💬 Respostas do Fluxie</li>
              <li>🏆 Conquistas de badges</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
