import { describe, it, expect } from 'vitest';
import { tutorRouter } from './tutor';

describe('Tutor Router - Connected Speech & Pronunciation', () => {
  describe('getConnectedSpeechTips', () => {
    it('should return connected speech tips for B1 level', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      expect(tips).toBeDefined();
      expect(Array.isArray(tips)).toBe(true);
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toHaveProperty('rule');
      expect(tips[0]).toHaveProperty('example');
      expect(tips[0]).toHaveProperty('explanation');
    });

    it('should have linking rule for B1', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      const linkingRule = tips.find((t) => t.rule === 'Linking');
      expect(linkingRule).toBeDefined();
      expect(linkingRule?.example).toContain('wanna');
    });

    it('should have elision rule for B1', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      const elisionRule = tips.find((t) => t.rule === 'Elision');
      expect(elisionRule).toBeDefined();
      expect(elisionRule?.example).toContain('next');
    });

    it('should have assimilation rule for B2', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B2' });
      const assimilationRule = tips.find((t) => t.rule === 'Assimilation');
      expect(assimilationRule).toBeDefined();
      expect(assimilationRule?.example).toContain('that girl');
    });
  });

  describe('getPronunciationGuide', () => {
    it('should return pronunciation guide for B1 level', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      expect(guide).toBeDefined();
      expect(typeof guide).toBe('object');
      expect(guide).toHaveProperty('want');
      expect(guide.want).toHaveProperty('ipa');
      expect(guide.want).toHaveProperty('tips');
    });

    it('should have correct IPA for "want"', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      expect(guide.want?.ipa).toBe('wɑːnt');
    });

    it('should have correct IPA for "think"', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      expect(guide.think?.ipa).toBe('θɪŋk');
    });

    it('should have pronunciation tips for each word', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      expect(guide.think?.tips).toBeDefined();
      expect(Array.isArray(guide.think?.tips)).toBe(true);
      expect(guide.think?.tips?.length).toBeGreaterThan(0);
    });
  });

  describe('getRealEnglishExamples', () => {
    it('should return real English examples for B1 level', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
      expect(examples[0]).toHaveProperty('formal');
      expect(examples[0]).toHaveProperty('colloquial');
      expect(examples[0]).toHaveProperty('explanation');
      expect(examples[0]).toHaveProperty('level');
    });

    it('should show contractions in real English', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      const contractionExample = examples.find((e) => e.colloquial.includes('gonna'));
      expect(contractionExample).toBeDefined();
      expect(contractionExample?.formal).toContain('going to');
    });

    it('should show reductions in real English', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      const reductionExample = examples.find((e) => e.colloquial.includes('wanna'));
      expect(reductionExample).toBeDefined();
      expect(reductionExample?.explanation).toBeTruthy();
    });

    it('should show difference between formal and colloquial', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      examples.forEach((example) => {
        expect(example.formal).not.toBe(example.colloquial);
        expect(example.explanation).toBeTruthy();
      });
    });

    it('should show multiple contractions for B2 level', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B2' });
      const multipleContractions = examples.find((e) => e.colloquial.includes("couldn't've"));
      expect(multipleContractions).toBeDefined();
    });
  });

  describe('Real English vs Formal Patterns', () => {
    it('should demonstrate "I am going to" → "I\'m gonna"', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      const example = examples.find((e) => e.formal === 'I am going to go');
      expect(example?.colloquial).toBe("I'm gonna go");
    });

    it('should demonstrate "Do you want to" → "D\'you wanna"', async () => {
      const examples = await tutorRouter.createCaller({} as any).getRealEnglishExamples({ level: 'B1' });
      const example = examples.find((e) => e.formal === 'Do you want to');
      expect(example?.colloquial).toBe("D'you wanna");
    });
  });

  describe('Connected Speech Rules Accuracy', () => {
    it('Linking rule should explain vowel-consonant blending', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      const linkingRule = tips.find((t) => t.rule === 'Linking');
      expect(linkingRule?.explanation).toContain('consonant');
      expect(linkingRule?.explanation).toContain('vowel');
    });

    it('Elision rule should explain sound dropping', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B1' });
      const elisionRule = tips.find((t) => t.rule === 'Elision');
      expect(elisionRule?.explanation).toContain('dropped');
    });

    it('Assimilation rule should explain sound changing', async () => {
      const tips = await tutorRouter.createCaller({} as any).getConnectedSpeechTips({ level: 'B2' });
      const assimilationRule = tips.find((t) => t.rule === 'Assimilation');
      expect(assimilationRule?.explanation).toContain('changes');
    });
  });

  describe('Pronunciation Guide Completeness', () => {
    it('should have multiple words in B1 guide', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      const wordCount = Object.keys(guide).length;
      expect(wordCount).toBeGreaterThanOrEqual(3);
    });

    it('should have multiple words in B2 guide', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B2' });
      const wordCount = Object.keys(guide).length;
      expect(wordCount).toBeGreaterThanOrEqual(2);
    });

    it('each word should have IPA and tips', async () => {
      const guide = await tutorRouter.createCaller({} as any).getPronunciationGuide({ level: 'B1' });
      Object.values(guide).forEach((word) => {
        expect(word).toHaveProperty('ipa');
        expect(word).toHaveProperty('tips');
        expect(typeof word.ipa).toBe('string');
        expect(Array.isArray(word.tips)).toBe(true);
      });
    });
  });
});
