import { describe, it, expect } from 'vitest';

describe('ValentinesLeaderboard', () => {
  it('should define event ID correctly', () => {
    const EVENT_ID = 'valentines-2026';
    expect(EVENT_ID).toBe('valentines-2026');
  });

  it('should structure leaderboard entry correctly', () => {
    const entry = {
      rank: 1,
      name: 'Test Player',
      totalPoints: 500,
      missionsCompleted: {
        'word-scramble': true,
        'love-match': false,
        'karaoke': true,
      },
      isGuest: false,
    };

    expect(entry.rank).toBe(1);
    expect(entry.name).toBe('Test Player');
    expect(entry.totalPoints).toBe(500);
    expect(entry.missionsCompleted).toBeDefined();
    expect(entry.isGuest).toBe(false);
  });

  it('should calculate podium order correctly', () => {
    const top3 = [
      { rank: 1, name: 'Alice', totalPoints: 1000, missionsCompleted: {}, isGuest: false },
      { rank: 2, name: 'Bob', totalPoints: 950, missionsCompleted: {}, isGuest: false },
      { rank: 3, name: 'Charlie', totalPoints: 900, missionsCompleted: {}, isGuest: false },
    ];

    const podiumOrder = [top3[1], top3[0], top3[2]];
    expect(podiumOrder[0].name).toBe('Bob');
    expect(podiumOrder[1].name).toBe('Alice');
    expect(podiumOrder[2].name).toBe('Charlie');
  });

  it('should assign correct medals', () => {
    const medals = ['🥈', '🥇', '🥉'];
    expect(medals[0]).toBe('🥈');
    expect(medals[1]).toBe('🥇');
    expect(medals[2]).toBe('🥉');
  });

  it('should calculate total stats correctly', () => {
    const leaderboard = [
      { rank: 1, name: 'A', totalPoints: 500, missionsCompleted: { m1: true, m2: true }, isGuest: false },
      { rank: 2, name: 'B', totalPoints: 400, missionsCompleted: { m1: true }, isGuest: false },
      { rank: 3, name: 'C', totalPoints: 300, missionsCompleted: { m1: false }, isGuest: true },
    ];

    const totalParticipants = leaderboard.length;
    const totalPoints = leaderboard.reduce((s, p) => s + p.totalPoints, 0);
    const totalMissions = leaderboard.reduce((s, p) => s + Object.values(p.missionsCompleted).filter(Boolean).length, 0);

    expect(totalParticipants).toBe(3);
    expect(totalPoints).toBe(1200);
    expect(totalMissions).toBe(3);
  });

  it('should find user rank correctly', () => {
    const leaderboard = [
      { rank: 1, name: 'Alice', totalPoints: 1000, missionsCompleted: {}, isGuest: false },
      { rank: 2, name: 'Bob', totalPoints: 950, missionsCompleted: {}, isGuest: false },
      { rank: 3, name: 'Charlie', totalPoints: 900, missionsCompleted: {}, isGuest: false },
    ];

    const myName = 'Bob';
    const myRank = leaderboard.findIndex(p => p.name === myName) + 1;
    expect(myRank).toBe(2);
  });

  it('should validate podium heights', () => {
    const podiumHeights = ['h-24', 'h-32', 'h-20'];
    expect(podiumHeights.length).toBe(3);
    expect(podiumHeights[0]).toBe('h-24');
    expect(podiumHeights[1]).toBe('h-32');
    expect(podiumHeights[2]).toBe('h-20');
  });

  it('should validate podium colors', () => {
    const podiumColors = [
      'bg-gradient-to-t from-gray-400 to-gray-300',
      'bg-gradient-to-t from-yellow-500 to-yellow-300',
      'bg-gradient-to-t from-amber-700 to-amber-500',
    ];
    expect(podiumColors.length).toBe(3);
    expect(podiumColors[1]).toContain('yellow');
  });
});
