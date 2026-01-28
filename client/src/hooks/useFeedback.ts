import { useState, useCallback } from 'react';
import { useChunkSuccessSound, useFluxieReplySound, useBadgeUnlockedSound } from './useSound';

/**
 * Hook useFeedback - Combina som e animação para feedback completo
 * 
 * Fornece funções que acionam simultaneamente efeitos sonoros
 * e animações visuais para criar feedback sensorial rico
 */

export type FeedbackType = 'success' | 'notification' | 'achievement';

export function useFeedback() {
  const [activeFeedback, setActiveFeedback] = useState<FeedbackType | null>(null);
  
  const playChunkSuccess = useChunkSuccessSound();
  const playFluxieReply = useFluxieReplySound();
  const playBadgeUnlocked = useBadgeUnlockedSound();

  const triggerSuccess = useCallback(() => {
    playChunkSuccess();
    setActiveFeedback('success');
    setTimeout(() => setActiveFeedback(null), 2000);
  }, [playChunkSuccess]);

  const triggerNotification = useCallback(() => {
    playFluxieReply();
    setActiveFeedback('notification');
    setTimeout(() => setActiveFeedback(null), 1500);
  }, [playFluxieReply]);

  const triggerAchievement = useCallback(() => {
    playBadgeUnlocked();
    setActiveFeedback('achievement');
    setTimeout(() => setActiveFeedback(null), 2500);
  }, [playBadgeUnlocked]);

  return {
    activeFeedback,
    triggerSuccess,
    triggerNotification,
    triggerAchievement,
    clearFeedback: () => setActiveFeedback(null),
  };
}

/**
 * Hook useChunkFeedback - Feedback específico para validação de chunks
 */
export function useChunkFeedback() {
  const { triggerSuccess } = useFeedback();

  const showChunkSuccess = useCallback((onComplete?: () => void) => {
    triggerSuccess();
    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  }, [triggerSuccess]);

  return { showChunkSuccess };
}

/**
 * Hook useFluxieFeedback - Feedback específico para respostas do Fluxie
 */
export function useFluxieFeedback() {
  const { triggerNotification } = useFeedback();

  const showFluxieReply = useCallback((onComplete?: () => void) => {
    triggerNotification();
    if (onComplete) {
      setTimeout(onComplete, 1500);
    }
  }, [triggerNotification]);

  return { showFluxieReply };
}

/**
 * Hook useBadgeFeedback - Feedback específico para conquistas de badges
 */
export function useBadgeFeedback() {
  const { triggerAchievement } = useFeedback();

  const showBadgeUnlocked = useCallback((onComplete?: () => void) => {
    triggerAchievement();
    if (onComplete) {
      setTimeout(onComplete, 2500);
    }
  }, [triggerAchievement]);

  return { showBadgeUnlocked };
}
