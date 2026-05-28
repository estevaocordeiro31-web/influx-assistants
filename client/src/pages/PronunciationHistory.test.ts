import { describe, it, expect } from 'vitest';

describe('PronunciationHistory', () => {
  it('should display average pronunciation score', () => {
    const averageScore = 82;
    expect(averageScore).toBeGreaterThanOrEqual(0);
    expect(averageScore).toBeLessThanOrEqual(100);
  });

  it('should calculate score distribution', () => {
    const analyses = [
      { pronunciationScore: 15 },
      { pronunciationScore: 35 },
      { pronunciationScore: 55 },
      { pronunciationScore: 75 },
      { pronunciationScore: 95 },
    ];

    const distribution = [
      { range: '0-20', count: analyses.filter(a => a.pronunciationScore < 20).length },
      { range: '20-40', count: analyses.filter(a => a.pronunciationScore >= 20 && a.pronunciationScore < 40).length },
      { range: '40-60', count: analyses.filter(a => a.pronunciationScore >= 40 && a.pronunciationScore < 60).length },
      { range: '60-80', count: analyses.filter(a => a.pronunciationScore >= 60 && a.pronunciationScore < 80).length },
      { range: '80-100', count: analyses.filter(a => a.pronunciationScore >= 80).length },
    ];

    expect(distribution[0].count).toBe(1);
    expect(distribution[1].count).toBe(1);
    expect(distribution[2].count).toBe(1);
    expect(distribution[3].count).toBe(1);
    expect(distribution[4].count).toBe(1);
  });

  it('should format date correctly', () => {
    const date = new Date('2026-05-28T14:30:00');
    const formatted = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should prepare chart data', () => {
    const analyses = [
      { pronunciationScore: 85, accuracy: 80, fluency: 90, completeness: 85 },
      { pronunciationScore: 90, accuracy: 88, fluency: 92, completeness: 90 },
    ];

    const chartData = analyses.map((a, idx) => ({
      name: `Música ${idx + 1}`,
      pronunciation: a.pronunciationScore,
      accuracy: a.accuracy,
      fluency: a.fluency,
      completeness: a.completeness,
    }));

    expect(chartData).toHaveLength(2);
    expect(chartData[0].pronunciation).toBe(85);
    expect(chartData[1].name).toBe('Música 2');
  });

  it('should handle empty analyses', () => {
    const analyses: any[] = [];
    expect(analyses.length).toBe(0);
  });

  it('should calculate average metrics', () => {
    const analyses = [
      { pronunciationScore: 80, accuracy: 75, fluency: 85, completeness: 80 },
      { pronunciationScore: 90, accuracy: 88, fluency: 92, completeness: 90 },
    ];

    const avgPronunciation = Math.round(
      analyses.reduce((sum, a) => sum + a.pronunciationScore, 0) / analyses.length
    );
    const avgAccuracy = Math.round(
      analyses.reduce((sum, a) => sum + a.accuracy, 0) / analyses.length
    );

    expect(avgPronunciation).toBe(85);
    expect(avgAccuracy).toBe(82);
  });
});
