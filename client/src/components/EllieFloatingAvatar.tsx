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