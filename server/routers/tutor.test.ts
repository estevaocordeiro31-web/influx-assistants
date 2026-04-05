import { tutorRouter } from './tutor';

describe('Tutor Router - Connected Speech & Pronunciation', () => {
  describe('getConnectedSpeechTips', () => {
    it('should return connected speech tips for B1 level', (, async => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      expect(tips).toBeDefined();
      expect(Array.isArray(tips)).toBe(true);
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toHaveProperty('rule');
      expect(tips[0]).toHaveProperty('example');
      expect(tips[0]).toHaveProperty('explanation');
    });

    it('should have linking rule for B1', (, async => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      const linkingRule = tips.find((t) => t.rule === 'Linking');
      expect(linkingRule).toBeDefined();
      expect(linkingRule?.example).toContain('wanna');