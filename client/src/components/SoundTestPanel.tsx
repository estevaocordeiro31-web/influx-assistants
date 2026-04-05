import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useChunkSuccessSound, useFluxieReplySound, useBadgeUnlockedSound } from '../hooks/useSound';
import { AudioControls } from './AudioControls';
import { CheckCircle, MessageCircle, Trophy } from 'lucide-react';

/**
 * SoundTestPanel - Painel de teste de sons
 * 
 * Componente para demonstrar e testar todos os sons do sistema
 */

export function SoundTestPanel() {
  const playChunkSuccess = useChunkSuccessSound();
  const playFluxieReply = useFluxieReplySound();
  const playBadgeUnlocked = useBadgeUnlockedSound();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Teste de Sons</CardTitle>
            <CardDescription>
              Experimente os efeitos sonoros do inFlux Personal Tutor
            </CardDescription>
          </div>
          <AudioControls />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => playChunkSuccess()}
          >
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-sm">Chunk Validado</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => playFluxieReply()}
          >
            <MessageCircle className="h-8 w-8 text-blue-500" />
            <span className="text-sm">Resposta do Fluxie</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => playBadgeUnlocked()}
          >
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span className="text-sm">Badge Conquistado</span>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground border-t pt-4">
          <p className="font-medium mb-2">Quando os sons tocam:</p>
          <ul className="space-y-1 ml-4">
            <li>✓ <strong>Chunk Validado:</strong> Quando o aluno acerta um exercício de chunks</li>
            <li>💬 <strong>Resposta do Fluxie:</strong> Quando o assistente IA envia uma mensagem</li>
            <li>🏆 <strong>Badge Conquistado:</strong> Quando o aluno desbloqueia uma conquista</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
