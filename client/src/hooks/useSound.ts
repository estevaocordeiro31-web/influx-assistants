import { useCallback, useEffect, useState } from 'react';
import { AudioManager, SoundType } from '../lib/AudioManager';

/**
 * Hook useSound - Interface React para o AudioManager
 * 
 * Permite reproduzir sons e controlar configurações de áudio
 * de forma reativa nos componentes
 */

export function useSound() {
  const [volume, setVolumeState] = useState(AudioManager.getVolume());
  const [isMuted, setIsMutedState] = useState(AudioManager.getMuted());

  // Sincroniza estado com AudioManager
  useEffect(() => {
    const interval = setInterval(() => {
      setVolumeState(AudioManager.getVolume());
      setIsMutedState(AudioManager.getMuted());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const play = useCallback((soundType: SoundType, options?: { onEnd?: () => void }) => {
    AudioManager.play(soundType, options);
  }, []);

  const stop = useCallback((soundType: SoundType) => {
    AudioManager.stop(soundType);
  }, []);

  const stopAll = useCallback(() => {
    AudioManager.stopAll();
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    AudioManager.setVolume(newVolume);
    setVolumeState(newVolume);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    AudioManager.setMuted(muted);
    setIsMutedState(muted);
  }, []);

  const toggleMute = useCallback(() => {
    AudioManager.toggleMute();
    setIsMutedState(AudioManager.getMuted());
  }, []);

  return {
    play,
    stop,
    stopAll,
    volume,
    setVolume,
    isMuted,
    setMuted,
    toggleMute,
  };
}

/**
 * Hook useChunkSuccessSound - Som de sucesso ao validar chunk
 */
export function useChunkSuccessSound() {
  const { play } = useSound();

  const playSuccess = useCallback((onEnd?: () => void) => {
    play('chunk-success', { onEnd });
  }, [play]);

  return playSuccess;
}

/**
 * Hook useFluxieReplySound - Som de notificação ao receber resposta do Fluxie
 */
export function useFluxieReplySound() {
  const { play } = useSound();

  const playReply = useCallback((onEnd?: () => void) => {
    play('fluxie-reply', { onEnd });
  }, [play]);

  return playReply;
}

/**
 * Hook useBadgeUnlockedSound - Som de conquista ao desbloquear badge
 */
export function useBadgeUnlockedSound() {
  const { play } = useSound();

  const playBadge = useCallback((onEnd?: () => void) => {
    play('badge-unlocked', { onEnd });
  }, [play]);

  return playBadge;
}
