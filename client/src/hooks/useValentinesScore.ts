import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

const EVENT_ID = 'valentines-2026';
const STORAGE_KEY = 'valentines_participant';

interface StoredParticipant {
  participantId: number;
  token: string | null;
  name: string;
}

export function useValentinesScore() {
  const { user } = useAuth();
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const joinAsStudent = trpc.culturalEvents.joinAsStudent.useMutation();
  const joinEvent = trpc.culturalEvents.joinEvent.useMutation();
  const saveMission = trpc.culturalEvents.saveMissionProgress.useMutation();

  // Auto-join on mount
  useEffect(() => {
    const init = async () => {
      // Check if already stored locally
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed: StoredParticipant = JSON.parse(stored);
          setParticipantId(parsed.participantId);
          setIsReady(true);
          return;
        } catch { /* ignore parse errors */ }
      }

      // If user is logged in, join as student
      if (user) {
        try {
          const result = await joinAsStudent.mutateAsync({ eventId: EVENT_ID });
          const data: StoredParticipant = {
            participantId: result.participantId,
            token: result.token,
            name: user.name || 'Aluno',
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setParticipantId(result.participantId);
        } catch (err) {
          console.error('Failed to join as student:', err);
        }
      }
      setIsReady(true);
    };

    init();
  }, [user]);

  // Join as guest (for non-logged users)
  const joinAsGuest = useCallback(async (name: string, whatsapp?: string) => {
    try {
      const result = await joinEvent.mutateAsync({ eventId: EVENT_ID, name, whatsapp });
      const data: StoredParticipant = {
        participantId: result.participantId,
        token: result.token,
        name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setParticipantId(result.participantId);
      return result.participantId;
    } catch (err) {
      console.error('Failed to join as guest:', err);
      return null;
    }
  }, [joinEvent]);

  // Save score for a mission
  const saveScore = useCallback(async (missionId: string, score: number, completed: boolean = true, timeSpentSeconds?: number) => {
    if (!participantId) return null;
    try {
      const result = await saveMission.mutateAsync({
        participantId,
        missionId,
        score,
        completed,
        timeSpentSeconds,
      });
      return result;
    } catch (err) {
      console.error('Failed to save score:', err);
      return null;
    }
  }, [participantId, saveMission]);

  return {
    participantId,
    isReady,
    isParticipant: !!participantId,
    saveScore,
    joinAsGuest,
    isSaving: saveMission.isPending,
  };
}
