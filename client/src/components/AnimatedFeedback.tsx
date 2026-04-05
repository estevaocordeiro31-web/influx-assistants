import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Trophy, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * AnimatedFeedback - Componentes de feedback visual animado
 * 
 * Micro-interações sincronizadas com efeitos sonoros para
 * reforçar feedback positivo e aumentar engajamento
 */

interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
}

/**
 * Animação de pulso - Usado para feedback de sucesso
 */
export function PulseAnimation({ children, className }: AnimatedIconProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animação de brilho - Usado para notificações
 */
export function GlowAnimation({ children, className }: AnimatedIconProps) {
  return (
    <motion.div
      className={className}
      animate={{
        filter: [
          'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
          'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))',
          'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
        ],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animação de conquista - Usado para badges
 */
export function AchievementAnimation({ children, className }: AnimatedIconProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: [0, 1.3, 1],
        rotate: [- 180, 0, 0],
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animação de partículas - Efeito de celebração
 */
export function ParticleEffect() {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: Math.cos((i * 2 * Math.PI) / particles.length) * 100,
            y: Math.sin((i * 2 * Math.PI) / particles.length) * 100,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Feedback de Chunk Validado
 */
export function ChunkSuccessFeedback() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <PulseAnimation>
        <CheckCircle className="h-12 w-12 text-green-500" />
      </PulseAnimation>
    </div>
  );
}

/**
 * Feedback de Resposta do Fluxie
 */
export function FluxieReplyFeedback() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <GlowAnimation>
        <MessageCircle className="h-10 w-10 text-blue-500" />
      </GlowAnimation>
    </div>
  );
}

/**
 * Feedback de Badge Conquistado
 */
export function BadgeUnlockedFeedback() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <ParticleEffect />
      <AchievementAnimation>
        <Trophy className="h-16 w-16 text-yellow-500" />
      </AchievementAnimation>
    </div>
  );
}

/**
 * Componente genérico de feedback animado
 */
interface AnimatedFeedbackProps {
  type: 'success' | 'notification' | 'achievement';
  show: boolean;
  onComplete?: () => void;
}

export function AnimatedFeedback({ type, show, onComplete }: AnimatedFeedbackProps) {
  if (!show) return null;

  const feedbackComponents = {
    success: <ChunkSuccessFeedback />,
    notification: <FluxieReplyFeedback />,
    achievement: <BadgeUnlockedFeedback />,
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 1000);
      }}
    >
      {feedbackComponents[type]}
    </motion.div>
  );
}
