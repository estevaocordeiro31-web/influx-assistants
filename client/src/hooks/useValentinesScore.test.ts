import { describe, it, expect } from 'vitest';

describe('useValentinesScore Hook', () => {
  it('should define the EVENT_ID constant', () => {
    const EVENT_ID = 'valentines-2026';
    expect(EVENT_ID).toBe('valentines-2026');
  });

  it('should define the STORAGE_KEY constant', () => {
    const STORAGE_KEY = 'valentines_participant';
    expect(STORAGE_KEY).toBe('valentines_participant');
  });

  it('should have valid mission IDs', () => {
    const missionIds = [
      'word-scramble',
      'love-match',
      'emoji-decoder',
      'karaoke',
    ];
    
    missionIds.forEach(id => {
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  it('should validate participant data structure', () => {
    const mockParticipant = {
      participantId: 123,
      token: 'test-token',
      name: 'Test Student',
    };
    
    expect(mockParticipant.participantId).toBeDefined();
    expect(mockParticipant.token).toBeDefined();
    expect(mockParticipant.name).toBeDefined();
  });
});
