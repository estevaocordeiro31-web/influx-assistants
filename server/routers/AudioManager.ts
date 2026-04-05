import { Howl } from 'howler';

/**
 * AudioManager - Gerenciador centralizado de áudio para o inFlux Personal Tutor
 * 
 * Responsável por carregar, reproduzir e controlar todos os efeitos sonoros
 * da aplicação usando Howler.js
 */

export type SoundType = 'chunk-success' | 'fluxie-reply' | 'badge-unlocked';

interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
}

class AudioManagerClass {
  private sounds: Map<SoundType, Howl> = new Map();
  private globalVolume: number = 0.7;
  private isMuted: boolean = false;

  constructor() {
    this.initializeSounds();
    this.loadVolumeSettings();
  }

  /**
   * Inicializa todos os sons da aplicação
   */
  private initializeSounds() {
    const soundConfigs: Record<SoundType, SoundConfig> = {
      'chunk-success': {
        src: '/sounds/chunk-success.mp3',
        volume: 0.6,
      },
      'fluxie-reply': {
        src: '/sounds/fluxie-reply.mp3',
        volume: 0.5,
      },
      'badge-unlocked': {
        src: '/sounds/badge-unlocked.mp3',
        volume: 0.8,
      },
    };

    Object.entries(soundConfigs).forEach(([key, config]) => {
      const sound = new Howl({
        src: [config.src],
        volume: (config.volume || 1.0) * this.globalVolume,
        loop: config.loop || false,
        preload: true,
      });

      this.sounds.set(key as SoundType, sound);
    });
  }

  /**
   * Carrega configurações de volume do localStorage
   */
  private loadVolumeSettings() {
    try {
      const savedVolume = localStorage.getItem('influx-audio-volume');
      const savedMuted = localStorage.getItem('influx-audio-muted');

      if (savedVolume) {
        this.globalVolume = parseFloat(savedVolume);
      }

      if (savedMuted) {
        this.isMuted = savedMuted === 'true';
      }

      this.updateAllVolumes();
    } catch (error) {
      console.warn('[AudioManager] Erro ao carregar configurações:', error);
    }
  }

  /**
   * Salva configurações de volume no localStorage
   */
  private saveVolumeSettings() {
    try {
      localStorage.setItem('influx-audio-volume', this.globalVolume.toString());
      localStorage.setItem('influx-audio-muted', this.isMuted.toString());
    } catch (error) {
      console.warn('[AudioManager] Erro ao salvar configurações:', error);
    }
  }

  /**
   * Atualiza o volume de todos os sons
   */
  private updateAllVolumes() {
    const effectiveVolume = this.isMuted ? 0 : this.globalVolume;

    this.sounds.forEach((sound, key) => {
      const baseVolume = this.getBaseVolume(key);
      sound.volume(baseVolume * effectiveVolume);
    });
  }

  /**
   * Retorna o volume base de um som específico
   */
  private getBaseVolume(soundType: SoundType): number {
    const baseVolumes: Record<SoundType, number> = {
      'chunk-success': 0.6,
      'fluxie-reply': 0.5,
      'badge-unlocked': 0.8,
    };

    return baseVolumes[soundType] || 1.0;
  }

  /**
   * Reproduz um som
   */
  play(soundType: SoundType, options?: { onEnd?: () => void }) {
    const sound = this.sounds.get(soundType);

    if (!sound) {
      console.warn(`[AudioManager] Som não encontrado: ${soundType}`);
      return;
    }

    // Para o som se já estiver tocando (evita sobreposição)
    if (sound.playing()) {
      sound.stop();
    }

    // Reproduz o som
    const soundId = sound.play();

    // Callback ao finalizar
    if (options?.onEnd) {
      sound.once('end', options.onEnd, soundId);
    }
  }

  /**
   * Para um som específico
   */
  stop(soundType: SoundType) {
    const sound = this.sounds.get(soundType);
    if (sound) {
      sound.stop();
    }
  }

  /**
   * Para todos os sons
   */
  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }

  /**
   * Define o volume global (0.0 a 1.0)
   */
  setVolume(volume: number) {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
    this.saveVolumeSettings();
  }

  /**
   * Retorna o volume global atual
   */
  getVolume(): number {
    return this.globalVolume;
  }

  /**
   * Ativa/desativa o mute
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateAllVolumes();
    this.saveVolumeSettings();
  }

  /**
   * Retorna se está mutado
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Alterna entre mutado e não mutado
   */
  toggleMute() {
    this.setMuted(!this.isMuted);
  }

  /**
   * Libera recursos de todos os sons
   */
  destroy() {
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
  }
}

// Singleton instance
export const AudioManager = new AudioManagerClass();

// Export para uso em testes
export { AudioManagerClass };
