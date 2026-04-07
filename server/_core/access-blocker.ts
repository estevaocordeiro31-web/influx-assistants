/**
 * Access Blocker Middleware
 * Bloqueia acesso de alunos até 01/03/2026
 * Mostra página de curiosidade com timer countdown
 */

export interface AccessBlockerConfig {
  unlockDate: Date;
  message: string;
  title: string;
}

export const defaultAccessBlockerConfig: AccessBlockerConfig = {
  unlockDate: new Date("2026-03-01T00:00:00Z"),
  message:
    "Estamos nos preparando para trazer uma forma completamente nova de você enxergar a escola. Algo muito especial está chegando!",
  title: "Preparando algo especial para você",
};

/**
 * Verifica se o acesso está bloqueado
 */
export function isAccessBlocked(config: AccessBlockerConfig = defaultAccessBlockerConfig): boolean {
  const now = new Date();
  return now < config.unlockDate;
}

/**
 * Calcula tempo restante até desbloqueio
 */
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
}

export function getTimeRemaining(config: AccessBlockerConfig = defaultAccessBlockerConfig): TimeRemaining {
  const now = new Date();
  const totalMilliseconds = config.unlockDate.getTime() - now.getTime();

  if (totalMilliseconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMilliseconds: 0,
    };
  }

  const seconds = Math.floor((totalMilliseconds / 1000) % 60);
  const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((totalMilliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds,
  };
}

/**
 * Formata tempo restante para exibição
 */
export function formatTimeRemaining(time: TimeRemaining): string {
  if (time.totalMilliseconds <= 0) {
    return "Acesso liberado!";
  }

  const parts: string[] = [];

  if (time.days > 0) {
    parts.push(`${time.days} dia${time.days !== 1 ? "s" : ""}`);
  }
  if (time.hours > 0) {
    parts.push(`${time.hours} hora${time.hours !== 1 ? "s" : ""}`);
  }
  if (time.minutes > 0) {
    parts.push(`${time.minutes} minuto${time.minutes !== 1 ? "s" : ""}`);
  }
  if (time.seconds > 0 || parts.length === 0) {
    parts.push(`${time.seconds} segundo${time.seconds !== 1 ? "s" : ""}`);
  }

  return parts.join(", ");
}
