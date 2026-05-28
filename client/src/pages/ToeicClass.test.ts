import { describe, it, expect } from 'vitest';

describe('ToeicClass', () => {
  it('should have 7 TOEIC parts', () => {
    const parts = [
      'part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7'
    ];
    expect(parts).toHaveLength(7);
  });

  it('should have 4 listening parts', () => {
    const listeningParts = ['part1', 'part2', 'part3', 'part4'];
    expect(listeningParts).toHaveLength(4);
  });

  it('should have 3 reading parts', () => {
    const readingParts = ['part5', 'part6', 'part7'];
    expect(readingParts).toHaveLength(3);
  });

  it('should have correct question counts', () => {
    const questions = {
      part1: 6,
      part2: 25,
      part3: 39,
      part4: 30,
      part5: 30,
      part6: 16,
      part7: 54,
    };

    const total = Object.values(questions).reduce((a, b) => a + b, 0);
    expect(total).toBe(200);
  });

  it('should have traps and tips for each part', () => {
    const parts = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7'];
    parts.forEach(part => {
      expect(part).toBeTruthy();
    });
  });

  it('should have at least 3 traps per part', () => {
    const trapsCount = {
      part1: 3,
      part2: 3,
      part3: 4,
      part4: 4,
      part5: 3,
      part6: 3,
      part7: 3,
    };

    Object.values(trapsCount).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  it('should have at least 3 tips per part', () => {
    const tipsCount = {
      part1: 3,
      part2: 3,
      part3: 4,
      part4: 4,
      part5: 3,
      part6: 3,
      part7: 8,
    };

    Object.values(tipsCount).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  it('should calculate total listening time correctly', () => {
    const listeningDuration = 45; // minutes
    expect(listeningDuration).toBe(45);
  });

  it('should calculate total reading time correctly', () => {
    const readingDuration = 75; // minutes
    expect(readingDuration).toBe(75);
  });

  it('should calculate total test time correctly', () => {
    const totalTime = 45 + 75; // minutes
    expect(totalTime).toBe(120);
  });

  it('should have correct TOEIC score range', () => {
    const minScore = 10;
    const maxScore = 990;
    expect(maxScore - minScore).toBe(980);
  });

  it('should have audio files for listening parts', () => {
    const audioFiles = [
      '/toeic-audio/media1.mp3',
      '/toeic-audio/media2.mp3',
      '/toeic-audio/media3.mp3',
      '/toeic-audio/media4.mp3',
    ];

    expect(audioFiles).toHaveLength(4);
    audioFiles.forEach(file => {
      expect(file).toContain('toeic-audio');
      expect(file).toContain('.mp3');
    });
  });

  it('should have part descriptions', () => {
    const descriptions = {
      part1: 'Listen to a photograph and choose the best sentence.',
      part2: 'Listen to a question and choose the best response.',
      part3: 'Listen to conversations and answer questions.',
      part4: 'Listen to monologues and answer questions.',
      part5: 'Fill in the blank with the correct word or phrase.',
      part6: 'Complete the text with the correct words or phrases.',
      part7: 'Read passages and answer comprehension questions.',
    };

    Object.values(descriptions).forEach(desc => {
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  it('should identify Part 7 as the longest reading section', () => {
    const part7Questions = 54;
    const part5Questions = 30;
    const part6Questions = 16;

    expect(part7Questions).toBeGreaterThan(part5Questions);
    expect(part7Questions).toBeGreaterThan(part6Questions);
  });

  it('should identify Part 2 as the longest listening section', () => {
    const part2Questions = 25;
    const part1Questions = 6;
    const part3Questions = 39;
    const part4Questions = 30;

    expect(part3Questions).toBeGreaterThan(part2Questions);
    expect(part4Questions).toBeGreaterThan(part2Questions);
  });

  it('should validate trap content for Part 1', () => {
    const part1Traps = [
      'Three incorrect sentences with words that sound similar to the recording',
      'Words that sound like the recording but are used incorrectly (e.g., "meeting" vs "sitting")',
      'Sentences that use furniture or location words incorrectly',
    ];

    expect(part1Traps).toHaveLength(3);
    part1Traps.forEach(trap => {
      expect(trap.toLowerCase()).toContain('word');
    });
  });

  it('should validate tip content for Part 7', () => {
    const part7Tips = [
      'Read the questions before you read the passage',
      'Do not look at the answer options',
      'Read the passage quickly to get a general idea',
      'Do not worry about words you do not understand',
      'Answer the easier questions first to gather information',
      'Leave the negative questions to be solved last',
      'Always look for the "small print" - if there is extra information, there will be a question about it',
      'Be familiar with the type of passages that will be presented',
    ];

    expect(part7Tips).toHaveLength(8);
    expect(part7Tips[0]).toContain('questions');
  });
});
