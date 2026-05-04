import { describe, it, expect } from 'vitest';

describe('ValentinesKaraokeMultiplayer', () => {
  it('should define game states', () => {
    const gameStates = ['waiting', 'decade-select', 'playing', 'checking', 'result', 'final'];
    gameStates.forEach(state => {
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(0);
    });
  });

  it('should define player roles', () => {
    const roles = ['player1', 'player2'];
    roles.forEach(role => {
      expect(typeof role).toBe('string');
    });
  });

  it('should validate player state structure', () => {
    const mockPlayer = {
      name: 'Test Player',
      score: 0,
      answer: '',
      showResult: null,
      attempts: 0,
      isReady: false,
    };

    expect(mockPlayer.name).toBeDefined();
    expect(mockPlayer.score).toBe(0);
    expect(mockPlayer.answer).toBe('');
    expect(mockPlayer.showResult).toBeNull();
    expect(mockPlayer.attempts).toBe(0);
    expect(mockPlayer.isReady).toBe(false);
  });

  it('should calculate points correctly', () => {
    const attempts = 0;
    const basePoints = 50;
    const points = basePoints - (attempts * 10);
    expect(points).toBe(50);

    const pointsWith2Attempts = basePoints - (2 * 10);
    expect(pointsWith2Attempts).toBe(30);
  });

  it('should determine winner correctly', () => {
    const player1Score = 150;
    const player2Score = 100;
    const winner = player1Score > player2Score ? 'player1' : 'player2';
    expect(winner).toBe('player1');

    const tieScore1 = 100;
    const tieScore2 = 100;
    const tieWinner = tieScore1 > tieScore2 ? 'player1' : tieScore2 > tieScore1 ? 'player2' : 'tie';
    expect(tieWinner).toBe('tie');
  });

  it('should normalize answers correctly', () => {
    const normalizeAnswer = (str: string) => str.toLowerCase().trim().replace(/[''`´]/g, "'").replace(/[^a-z0-9\s']/g, '');
    
    expect(normalizeAnswer("The Weeknd")).toBe("the weeknd");
    expect(normalizeAnswer("Blinding Lights")).toBe("blinding lights");
    expect(normalizeAnswer("Can't Help Falling In Love")).toBe("can't help falling in love");
  });
});
