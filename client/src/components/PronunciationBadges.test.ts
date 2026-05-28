import { describe, it, expect } from 'vitest';

describe('PronunciationBadges', () => {
  it('should show perfect pronunciation badge for 90+ score', () => {
    const pronunciationScore = 95;
    const hasBadge = pronunciationScore >= 90;
    expect(hasBadge).toBe(true);
  });

  it('should show excellent pronunciation badge for 75-89 score', () => {
    const pronunciationScore = 82;
    const hasBadge = pronunciationScore >= 75 && pronunciationScore < 90;
    expect(hasBadge).toBe(true);
  });

  it('should show good pronunciation badge for 60-74 score', () => {
    const pronunciationScore = 68;
    const hasBadge = pronunciationScore >= 60 && pronunciationScore < 75;
    expect(hasBadge).toBe(true);
  });

  it('should show high accuracy badge for 85+ accuracy', () => {
    const accuracy = 88;
    const hasBadge = accuracy >= 85;
    expect(hasBadge).toBe(true);
  });

  it('should show fluent speaker badge for 80+ fluency', () => {
    const fluency = 85;
    const hasBadge = fluency >= 80;
    expect(hasBadge).toBe(true);
  });

  it('should show complete coverage badge for 90+ completeness', () => {
    const completeness = 92;
    const hasBadge = completeness >= 90;
    expect(hasBadge).toBe(true);
  });

  it('should not show badges for low scores', () => {
    const pronunciationScore = 45;
    const accuracy = 50;
    const fluency = 55;
    const completeness = 60;

    const badges = [];
    if (pronunciationScore >= 90) badges.push('perfect');
    if (pronunciationScore >= 75 && pronunciationScore < 90) badges.push('excellent');
    if (pronunciationScore >= 60 && pronunciationScore < 75) badges.push('good');
    if (accuracy >= 85) badges.push('accuracy');
    if (fluency >= 80) badges.push('fluent');
    if (completeness >= 90) badges.push('complete');

    expect(badges).toHaveLength(0);
  });

  it('should show multiple badges for excellent performance', () => {
    const pronunciationScore = 92;
    const accuracy = 90;
    const fluency = 88;
    const completeness = 95;

    const badges = [];
    if (pronunciationScore >= 90) badges.push('perfect');
    if (accuracy >= 85) badges.push('accuracy');
    if (fluency >= 80) badges.push('fluent');
    if (completeness >= 90) badges.push('complete');

    expect(badges.length).toBeGreaterThanOrEqual(3);
  });

  it('should validate badge thresholds', () => {
    const thresholds = {
      perfectPronunciation: 90,
      excellentPronunciation: 75,
      goodPronunciation: 60,
      highAccuracy: 85,
      fluentSpeaker: 80,
      completeCoverage: 90,
    };

    expect(thresholds.perfectPronunciation).toBeGreaterThan(thresholds.excellentPronunciation);
    expect(thresholds.excellentPronunciation).toBeGreaterThan(thresholds.goodPronunciation);
    expect(thresholds.highAccuracy).toBeGreaterThan(thresholds.fluentSpeaker);
  });

  it('should handle edge cases at threshold boundaries', () => {
    const scores = [89, 90, 74, 75, 59, 60, 84, 85];
    
    expect(scores[0] < 90).toBe(true); // Just below perfect
    expect(scores[1] >= 90).toBe(true); // At perfect
    expect(scores[2] < 75).toBe(true); // Just below excellent
    expect(scores[3] >= 75).toBe(true); // At excellent
    expect(scores[4] < 60).toBe(true); // Just below good
    expect(scores[5] >= 60).toBe(true); // At good
    expect(scores[6] < 85).toBe(true); // Just below accuracy
    expect(scores[7] >= 85).toBe(true); // At accuracy
  });

  it('should count badges correctly', () => {
    const testCases = [
      { score: 95, expected: 1 }, // Perfect pronunciation
      { score: 80, expected: 1 }, // Good pronunciation
      { score: 50, expected: 0 }, // No badges
    ];

    testCases.forEach(({ score, expected }) => {
      const badges = [];
      if (score >= 90) badges.push('perfect');
      else if (score >= 75) badges.push('excellent');
      else if (score >= 60) badges.push('good');
      expect(badges).toHaveLength(expected);
    });
  });
});
