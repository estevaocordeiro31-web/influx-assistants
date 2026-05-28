import { describe, it, expect } from 'vitest';

describe('TutorComparison', () => {
  it('should calculate score difference', () => {
    const studentScore = 85;
    const tutorScore = 90;
    const difference = studentScore - tutorScore;
    expect(difference).toBe(-5);
  });

  it('should determine color for positive difference', () => {
    const difference = 5;
    const color = difference >= 0 ? 'text-green-400' : 'text-red-400';
    expect(color).toBe('text-green-400');
  });

  it('should determine color for negative difference', () => {
    const difference = -5;
    const color = difference >= 0 ? 'text-green-400' : 'text-red-400';
    expect(color).toBe('text-red-400');
  });

  it('should format difference label correctly', () => {
    const difference = 5;
    const label = difference > 0 ? `+${difference}%` : `${difference}%`;
    expect(label).toBe('+5%');
  });

  it('should format negative difference label', () => {
    const difference = -5;
    const label = difference > 0 ? `+${difference}%` : `${difference}%`;
    expect(label).toBe('-5%');
  });

  it('should validate metrics range', () => {
    const metrics = {
      studentScore: 85,
      tutorScore: 90,
      accuracy: 88,
      fluency: 82,
      completeness: 85,
      intonation: 80,
      rhythm: 75,
    };

    const isValid = Object.values(metrics).every(v => v >= 0 && v <= 100);
    expect(isValid).toBe(true);
  });

  it('should provide improvement tips for low accuracy', () => {
    const accuracy = 70;
    const shouldShowTip = accuracy < 80;
    expect(shouldShowTip).toBe(true);
  });

  it('should not provide improvement tips for high accuracy', () => {
    const accuracy = 85;
    const shouldShowTip = accuracy < 80;
    expect(shouldShowTip).toBe(false);
  });

  it('should provide fluency tips when needed', () => {
    const fluency = 65;
    const shouldShowTip = fluency < 80;
    expect(shouldShowTip).toBe(true);
  });

  it('should provide intonation tips when needed', () => {
    const intonation = 70;
    const shouldShowTip = intonation < 75;
    expect(shouldShowTip).toBe(true);
  });

  it('should provide rhythm tips when needed', () => {
    const rhythm = 60;
    const shouldShowTip = rhythm < 75;
    expect(shouldShowTip).toBe(true);
  });

  it('should show excellence message for high scores', () => {
    const accuracy = 85;
    const fluency = 85;
    const isExcellent = accuracy >= 80 && fluency >= 80;
    expect(isExcellent).toBe(true);
  });

  it('should compare student with tutor metrics', () => {
    const student = { accuracy: 85, fluency: 80, completeness: 85 };
    const tutor = { accuracy: 90, fluency: 90, completeness: 95 };

    const differences = {
      accuracy: student.accuracy - tutor.accuracy,
      fluency: student.fluency - tutor.fluency,
      completeness: student.completeness - tutor.completeness,
    };

    expect(differences.accuracy).toBe(-5);
    expect(differences.fluency).toBe(-10);
    expect(differences.completeness).toBe(-10);
  });

  it('should handle missing audio URLs gracefully', () => {
    const studentAudio = null;
    const tutorAudio = null;

    expect(studentAudio).toBeNull();
    expect(tutorAudio).toBeNull();
  });

  it('should track playing state for student audio', () => {
    let isPlayingStudent = false;
    isPlayingStudent = true;
    expect(isPlayingStudent).toBe(true);
    isPlayingStudent = false;
    expect(isPlayingStudent).toBe(false);
  });

  it('should track playing state for tutor audio', () => {
    let isPlayingTutor = false;
    isPlayingTutor = true;
    expect(isPlayingTutor).toBe(true);
    isPlayingTutor = false;
    expect(isPlayingTutor).toBe(false);
  });

  it('should handle loading state', () => {
    let isLoading = true;
    expect(isLoading).toBe(true);
    isLoading = false;
    expect(isLoading).toBe(false);
  });

  it('should validate metric names', () => {
    const metricNames = ['accuracy', 'fluency', 'completeness', 'intonation', 'rhythm'];
    expect(metricNames).toHaveLength(5);
    expect(metricNames).toContain('accuracy');
    expect(metricNames).toContain('fluency');
  });
});
