import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type EllieState = 'welcome' | 'success' | 'help' | 'neutral' | 'celebration';
type StudentBook = 'Fluxie' | 'Junior' | 'Regular' | 'Advanced';

interface EllieFloatingAvatarProps {
  studentBook?: StudentBook;
  onRequestSupport?: () => void;
  isOpen?: boolean;
}

const ellieMessages: Record<StudentBook, Record<EllieState, string>> = {
  Fluxie: {
    welcome: 'Olá! Bem-vindo ao Passaporte inFlux! 🎉 Eu sou a Ellie, sua coordenadora virtual. Vamos explorar juntos?',
    success: 'Parabéns! Você completou uma atividade incrível! 🌟',
    help: 'Precisa de ajuda? Clique em "Solicitar Comissário" para falar com a Jennifer!',
    neutral: 'Como posso ajudá-lo hoje?',
    celebration: 'Que legal! Você está indo muito bem! 🚀',
  },
  Junior: {
    welcome: 'Bem-vindo ao seu Passaporte inFlux! Eu sou a Ellie. Prontos para uma jornada de aprendizado? ✈️',
    success: 'Excelente trabalho! Seu Flight Plan está progredindo perfeitamente! 📈',
    help: 'Dúvidas? Solicite suporte com a Jennifer, nossa coordenadora!',
    neutral: 'Como posso auxiliar você?',
    celebration: 'Você está decolando! Continue assim! 🎯',
  },
  Regular: {
    welcome: 'Bem-vindo! Sou a Ellie, sua assistente de coordenação. Vamos otimizar seu aprendizado?',
    success: 'Ótimo progresso! Você está no caminho certo! 💪',
    help: 'Precisa de orientação? Abra um ticket de suporte comigo!',
    neutral: 'Em que posso ser útil?',
    celebration: 'Você está conquistando seus objetivos! Parabéns! 🏆',
  },
  Advanced: {
    welcome: 'Bem-vindo ao Passaporte Advanced! Sou a Ellie, sua coordenadora. Prontos para desafios maiores?',
    success: 'Impressionante! Você está dominando o conteúdo! 🎓',
    help: 'Questões complexas? Solicite uma sessão com a Jennifer!',
    neutral: 'Como posso otimizar sua experiência?',
    celebration: 'Você está no topo! Excelente desempenho! ⭐',
  },
};

const avatarImages: Record<EllieState, string> = {
  welcome: '/miss-elie-uniform-waving.png',
  success: '/miss-elie-uniform-thumbsup.png',
  help: '/miss-elie-uniform-teaching.png',
  neutral: '/miss-elie-uniform-avatar.png',
  celebration: '/miss-elie-uniform-full.png',
};

export function EllieFloatingAvatar({
  studentBook = 'Regular',
  onRequestSupport,
  isOpen: initialOpen = false,
}: EllieFloatingAvatarProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [currentState, setCurrentState] = useState<EllieState>('welcome');

  const handleStateChange = (state: EllieState) => {
    setCurrentState(state);
  };

  const message = ellieMessages[studentBook][currentState];
  const avatarImage = avatarImages[currentState];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 mb-4 animate-in fade-in slide-in-from-bottom-2">
          <Card className="w-80 bg-slate-800 border-green-400 shadow-lg">
            <div className="p-4">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <img
                  src={avatarImage}
                  alt="Ellie"
                  className="w-32 h-32 object-contain rounded-lg"
                />
              </div>

              {/* Message */}
              <div className="bg-slate-700 rounded-lg p-3 mb-4">
                <p className="text-slate-100 text-sm leading-relaxed">{message}</p>
              </div>

              {/* State Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  size="sm"
                  variant={currentState === 'success' ? 'default' : 'outline'}
                  onClick={() => handleStateChange('success')}
                  className="text-xs"
                >
                  ✨ Sucesso
                </Button>
                <Button
                  size="sm"
                  variant={currentState === 'help' ? 'default' : 'outline'}
                  onClick={() => handleStateChange('help')}
                  className="text-xs"
                >
                  ❓ Ajuda
                </Button>
                <Button
                  size="sm"
                  variant={currentState === 'celebration' ? 'default' : 'outline'}
                  onClick={() => handleStateChange('celebration')}
                  className="text-xs"
                >
                  🎉 Celebração
                </Button>
                <Button
                  size="sm"
                  variant={currentState === 'neutral' ? 'default' : 'outline'}
                  onClick={() => handleStateChange('neutral')}
                  className="text-xs"
                >
                  💬 Neutro
                </Button>
              </div>

              {/* Support Button */}
              <Button
                onClick={() => {
                  onRequestSupport?.();
                  setIsOpen(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Solicitar Comissário
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
