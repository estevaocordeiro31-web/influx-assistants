import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export interface TabNotifications {
  chat: number;
  exercises: number;
  blog: number;
  data: number;
  materials: number;
  readingClub: number;
  tutor: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<TabNotifications>({
    chat: 0,
    exercises: 0,
    blog: 0,
    data: 0,
    materials: 0,
    readingClub: 0,
    tutor: 0,
  });

  // TODO: Implementar queries reais para buscar contadores do backend
  // Por enquanto, valores mockados para demonstração
  useEffect(() => {
    // Simular notificações para demonstração
    const mockNotifications: TabNotifications = {
      chat: 3, // 3 mensagens não lidas
      exercises: 5, // 5 exercícios pendentes
      blog: 2, // 2 novas dicas do blog
      data: 0,
      materials: 1, // 1 novo material disponível
      readingClub: 4, // 4 novos posts no clube
      tutor: 0,
    };
    
    setNotifications(mockNotifications);
  }, []);

  const clearNotification = (tab: keyof TabNotifications) => {
    setNotifications(prev => ({
      ...prev,
      [tab]: 0,
    }));
  };

  const getTotalCount = () => {
    return Object.values(notifications).reduce((sum, count) => sum + count, 0);
  };

  return {
    notifications,
    clearNotification,
    getTotalCount,
  };
}
