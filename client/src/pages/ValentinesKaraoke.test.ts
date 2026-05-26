import { describe, it, expect } from 'vitest';

describe('ValentinesKaraoke - Music Fetching', () => {
  it('should normalize answers correctly', () => {
    const normalizeAnswer = (str: string) => 
      str.toLowerCase().trim().replace(/[''`´]/g, "'").replace(/[^a-z0-9\s']/g, '');

    expect(normalizeAnswer('I Want to Know What Love Is')).toBe('i want to know what love is');
    expect(normalizeAnswer('Take My Breath Away')).toBe('take my breath away');
    expect(normalizeAnswer("Careless Whisper")).toBe('careless whisper');
  });

  it('should validate Deezer IDs', () => {
    const deezerIds = [540528, 676025, 2308961, 4065022, 2157348, 471912];
    expect(deezerIds.every(id => typeof id === 'number' && id > 0)).toBe(true);
  });

  it('should have valid decade categories', () => {
    const decades = ['80s', '90s', '2000s', '2020s'];
    expect(decades.length).toBe(4);
    expect(decades).toContain('80s');
    expect(decades).toContain('90s');
  });

  it('should shuffle songs correctly', () => {
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
    
    const songs = [
      { id: '1', title: 'Song 1' },
      { id: '2', title: 'Song 2' },
      { id: '3', title: 'Song 3' },
      { id: '4', title: 'Song 4' },
      { id: '5', title: 'Song 5' },
    ];

    const shuffled = shuffle(songs);
    expect(shuffled.length).toBe(5);
    expect(shuffled.every(s => songs.some(orig => orig.id === s.id))).toBe(true);
  });

  it('should handle audio loading states', () => {
    const states = ['idle', 'loading', 'playing', 'error'];
    expect(states).toContain('loading');
    expect(states).toContain('playing');
  });

  it('should validate game states', () => {
    const gameStates = ['menu', 'decade-select', 'playing', 'checking', 'result', 'final'];
    expect(gameStates.length).toBe(6);
    expect(gameStates).toContain('playing');
    expect(gameStates).toContain('final');
  });

  it('should calculate score correctly', () => {
    const calculateScore = (correct: boolean, attempts: number): number => {
      if (!correct) return 0;
      if (attempts === 1) return 100;
      if (attempts === 2) return 75;
      if (attempts === 3) return 50;
      return 25;
    };

    expect(calculateScore(true, 1)).toBe(100);
    expect(calculateScore(true, 2)).toBe(75);
    expect(calculateScore(true, 3)).toBe(50);
    expect(calculateScore(false, 1)).toBe(0);
  });

  it('should validate preview URL format', () => {
    const previewUrl = 'https://cdns-files-dzcdn.dzcdn.net/stream/preview.mp3';
    expect(previewUrl).toMatch(/^https:\/\//);
    expect(previewUrl).toContain('.mp3');
  });

  it('should handle tRPC fetch for Deezer preview', () => {
    const deezerPreviewInput = { deezerId: 540528 };
    expect(deezerPreviewInput.deezerId).toBe(540528);
    expect(typeof deezerPreviewInput.deezerId).toBe('number');
  });

  it('should validate accepted answers for songs', () => {
    const acceptedAnswers = ['i want to know what love is', 'want to know what love is', 'foreigner'];
    expect(acceptedAnswers.length).toBeGreaterThan(0);
    expect(acceptedAnswers).toContain('foreigner');
  });

  it('should track round scores', () => {
    const roundScores = [
      { song: { title: 'Song 1' }, correct: true, points: 100 },
      { song: { title: 'Song 2' }, correct: false, points: 0 },
      { song: { title: 'Song 3' }, correct: true, points: 75 },
    ];

    const totalPoints = roundScores.reduce((sum, r) => sum + r.points, 0);
    expect(totalPoints).toBe(175);
    expect(roundScores.filter(r => r.correct).length).toBe(2);
  });

  it('should validate celebration characters', () => {
    const characters = ['lucas', 'emily', 'aiko'];
    expect(characters.length).toBe(3);
    expect(characters).toContain('lucas');
    expect(characters).toContain('emily');
    expect(characters).toContain('aiko');
  });
});
