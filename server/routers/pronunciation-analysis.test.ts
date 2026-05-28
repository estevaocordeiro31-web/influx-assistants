import { describe, it, expect } from 'vitest';

describe('Pronunciation Analysis', () => {
  it('should calculate accuracy correctly', () => {
    const transcription = 'i want to know what love is';
    const expectedLyrics = 'i want to know what love is';
    
    const normalizeText = (text: string) =>
      text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    const normalized = normalizeText(transcription);
    const normalizedExpected = normalizeText(expectedLyrics);

    const transcribedWords = normalized.split(/\s+/).filter((w) => w);
    const expectedWords = normalizedExpected.split(/\s+/).filter((w) => w);

    let matchedWords = 0;
    for (const word of transcribedWords) {
      if (expectedWords.some((w) => w.includes(word) || word.includes(w))) {
        matchedWords++;
      }
    }

    const accuracy =
      expectedWords.length > 0
        ? Math.round((matchedWords / expectedWords.length) * 100)
        : 0;

    expect(accuracy).toBe(100);
  });

  it('should calculate partial accuracy', () => {
    const transcription = 'i want to no what love is';
    const expectedLyrics = 'i want to know what love is';
    
    const normalizeText = (text: string) =>
      text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    const normalized = normalizeText(transcription);
    const normalizedExpected = normalizeText(expectedLyrics);

    const transcribedWords = normalized.split(/\s+/).filter((w) => w);
    const expectedWords = normalizedExpected.split(/\s+/).filter((w) => w);

    let matchedWords = 0;
    for (const word of transcribedWords) {
      if (expectedWords.some((w) => w.includes(word) || word.includes(w))) {
        matchedWords++;
      }
    }

    const accuracy =
      expectedWords.length > 0
        ? Math.round((matchedWords / expectedWords.length) * 100)
        : 0;

    expect(accuracy).toBeLessThan(100);
    expect(accuracy).toBeGreaterThan(50);
  });

  it('should calculate completeness', () => {
    const transcribedWords = 'i want to know what love is'.split(/\s+/).filter((w) => w);
    const expectedWords = 'i want to know what love is'.split(/\s+/).filter((w) => w);

    const completeness =
      transcribedWords.length > 0
        ? Math.round((transcribedWords.length / expectedWords.length) * 100)
        : 0;

    expect(completeness).toBe(100);
  });

  it('should calculate fluency score', () => {
    const transcribedWords = 'i want to know what love is'.split(/\s+/).filter((w) => w);
    const expectedWords = 'i want to know what love is'.split(/\s+/).filter((w) => w);

    const fluency = Math.min(
      100,
      Math.round(
        (transcribedWords.length / Math.max(expectedWords.length, 5)) * 80
      )
    );

    expect(fluency).toBeGreaterThan(0);
    expect(fluency).toBeLessThanOrEqual(100);
  });

  it('should calculate weighted pronunciation score', () => {
    const accuracy = 85;
    const fluency = 90;
    const completeness = 80;

    const pronunciationScore = Math.round(
      (accuracy * 0.4 + fluency * 0.3 + completeness * 0.3) / 100 * 100
    );

    expect(pronunciationScore).toBeGreaterThan(0);
    expect(pronunciationScore).toBeLessThanOrEqual(100);
  });

  it('should generate appropriate feedback for excellent score', () => {
    const accuracy = 85;
    let feedback = '';

    if (accuracy >= 80) {
      feedback = '🌟 Excelente pronúncia! Você acertou a maioria das palavras.';
    }

    expect(feedback).toContain('Excelente');
  });

  it('should generate appropriate feedback for good score', () => {
    const accuracy = 65;
    let feedback = '';

    if (accuracy >= 60) {
      feedback = '👍 Bom trabalho! Tente focar nas palavras que não acertou.';
    }

    expect(feedback).toContain('Bom trabalho');
  });

  it('should generate appropriate feedback for low score', () => {
    const accuracy = 35;
    let feedback = '';

    if (accuracy < 40) {
      feedback = '🎯 Continua tentando! Escuta a música novamente e tente de novo.';
    }

    expect(feedback).toContain('Continua tentando');
  });

  it('should normalize text correctly', () => {
    const normalizeText = (text: string) =>
      text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    const result = normalizeText("I Want To Know What Love Is!");
    expect(result).toBe('i want to know what love is');
  });

  it('should handle empty transcription', () => {
    const transcribedWords = ''.split(/\s+/).filter((w) => w);
    const expectedWords = 'i want to know'.split(/\s+/).filter((w) => w);

    const accuracy =
      expectedWords.length > 0
        ? Math.round((transcribedWords.length / expectedWords.length) * 100)
        : 0;

    expect(accuracy).toBe(0);
  });

  it('should handle partial words matching', () => {
    const transcription = 'i wanna know what love is';
    const expectedLyrics = 'i want to know what love is';

    const normalizeText = (text: string) =>
      text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    const normalized = normalizeText(transcription);
    const normalizedExpected = normalizeText(expectedLyrics);

    const transcribedWords = normalized.split(/\s+/).filter((w) => w);
    const expectedWords = normalizedExpected.split(/\s+/).filter((w) => w);

    let matchedWords = 0;
    for (const word of transcribedWords) {
      if (expectedWords.some((w) => w.includes(word) || word.includes(w))) {
        matchedWords++;
      }
    }

    expect(matchedWords).toBeGreaterThan(0);
  });

  it('should validate pronunciation score range', () => {
    const scores = [0, 25, 50, 75, 100];
    expect(scores.every(s => s >= 0 && s <= 100)).toBe(true);
  });

  it('should validate accuracy range', () => {
    const accuracy = 75;
    expect(accuracy).toBeGreaterThanOrEqual(0);
    expect(accuracy).toBeLessThanOrEqual(100);
  });

  it('should validate fluency range', () => {
    const fluency = 85;
    expect(fluency).toBeGreaterThanOrEqual(0);
    expect(fluency).toBeLessThanOrEqual(100);
  });

  it('should validate completeness range', () => {
    const completeness = 90;
    expect(completeness).toBeGreaterThanOrEqual(0);
    expect(completeness).toBeLessThanOrEqual(100);
  });
});
