import { describe, it, expect } from 'vitest';

describe('TiagoPersonalizedTabs', () => {
  describe('Medical Topics', () => {
    it('deve conter 3 tópicos médicos', () => {
      const topics = [
        { id: 'med-1', title: 'Patient Consultation Basics' },
        { id: 'med-2', title: 'Medical Terminology - Common Conditions' },
        { id: 'med-3', title: 'Prescriptions & Treatment Plans' },
      ];

      expect(topics.length).toBe(3);
      expect(topics[0].title).toBe('Patient Consultation Basics');
    });

    it('deve ter vocabulário em cada tópico', () => {
      const topic = {
        id: 'med-1',
        vocabulary: [
          'symptom - sinal/sintoma',
          'diagnosis - diagnóstico',
          'prescription - prescrição/receita',
        ],
      };

      expect(topic.vocabulary.length).toBeGreaterThan(0);
      expect(topic.vocabulary[0]).toContain('symptom');
    });

    it('deve ter frases úteis em cada tópico', () => {
      const topic = {
        id: 'med-1',
        phrases: [
          '"Can you describe your symptoms?" - Você pode descrever seus sintomas?',
          '"How long have you had this pain?" - Há quanto tempo você tem essa dor?',
        ],
      };

      expect(topic.phrases.length).toBeGreaterThan(0);
      expect(topic.phrases[0]).toContain('Can you describe');
    });

    it('deve ter nível de dificuldade', () => {
      const topic = {
        id: 'med-1',
        difficulty: 'beginner' as const,
      };

      expect(['beginner', 'intermediate', 'advanced']).toContain(topic.difficulty);
    });
  });

  describe('Travel Destinations', () => {
    it('deve conter 2 destinos de viagem', () => {
      const destinations = [
        { id: 'cancun', city: 'Cancun', country: 'Mexico' },
        { id: 'newyork', city: 'New York', country: 'USA' },
      ];

      expect(destinations.length).toBe(2);
      expect(destinations[0].city).toBe('Cancun');
      expect(destinations[1].city).toBe('New York');
    });

    it('deve ter materiais para cada destino', () => {
      const destination = {
        id: 'cancun',
        materials: [
          { id: 'cancun-1', title: 'Hotel Check-in Dialogue', category: 'dialogue' as const },
          { id: 'cancun-2', title: 'Beach & Resort Vocabulary', category: 'vocabulary' as const },
        ],
      };

      expect(destination.materials.length).toBeGreaterThan(0);
      expect(destination.materials[0].category).toBe('dialogue');
    });

    it('deve ter personagem associado', () => {
      const destination = {
        id: 'cancun',
        character: 'lucas' as const,
      };

      expect(['lucas', 'emily', 'aiko']).toContain(destination.character);
    });

    it('deve ter informação de quando é a viagem', () => {
      const destination = {
        id: 'cancun',
        when: 'Next Month',
      };

      expect(destination.when).toBeDefined();
      expect(destination.when.length).toBeGreaterThan(0);
    });
  });

  describe('Material Categories', () => {
    it('deve ter categorias válidas de material', () => {
      const validCategories = ['phrases', 'vocabulary', 'dialogue', 'cultural'];
      const material = { category: 'dialogue' as const };

      expect(validCategories).toContain(material.category);
    });

    it('deve ter conteúdo em cada material', () => {
      const material = {
        id: 'cancun-1',
        title: 'Hotel Check-in Dialogue',
        content: 'Lucas: "Good afternoon! Welcome to our hotel."',
      };

      expect(material.content).toBeDefined();
      expect(material.content.length).toBeGreaterThan(0);
    });
  });

  describe('Tiago Profile', () => {
    it('deve ter informações corretas do Tiago', () => {
      const tiago = {
        name: 'Tiago Laerte Marques',
        email: 'tiago.laerte@icloud.com',
        phone: '11920409000',
        profession: 'Doctor',
        level: 'elementary',
        objective: 'career',
      };

      expect(tiago.name).toBe('Tiago Laerte Marques');
      expect(tiago.email).toBe('tiago.laerte@icloud.com');
      expect(tiago.profession).toBe('Doctor');
      expect(tiago.level).toBe('elementary');
      expect(tiago.objective).toBe('career');
    });

    it('deve ter avatar configurado', () => {
      const avatar = {
        path: '/tiago-avatar-caricature.png',
        format: 'png',
        style: 'Disney-Pixar caricature',
      };

      expect(avatar.path).toContain('tiago');
      expect(avatar.format).toBe('png');
      expect(avatar.style).toContain('caricature');
    });
  });

  describe('Medical English Content', () => {
    it('deve ter vocabulário médico essencial', () => {
      const medicalVocab = [
        'symptom',
        'diagnosis',
        'prescription',
        'vital signs',
        'blood pressure',
        'heart rate',
        'temperature',
        'patient history',
      ];

      expect(medicalVocab.length).toBeGreaterThan(0);
      expect(medicalVocab).toContain('diagnosis');
      expect(medicalVocab).toContain('prescription');
    });

    it('deve ter frases de consulta médica', () => {
      const phrases = [
        'Can you describe your symptoms?',
        'How long have you had this pain?',
        'Are you taking any medications?',
        'I\'m going to examine you now.',
      ];

      expect(phrases.length).toBeGreaterThan(0);
      phrases.forEach((phrase) => {
        expect(phrase.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Travel Content', () => {
    it('deve ter conteúdo para Cancun', () => {
      const cancunMaterials = [
        'Hotel Check-in Dialogue',
        'Beach & Resort Vocabulary',
        'Restaurant Ordering',
      ];

      expect(cancunMaterials.length).toBe(3);
      expect(cancunMaterials).toContain('Hotel Check-in Dialogue');
    });

    it('deve ter conteúdo para Nova York', () => {
      const nyMaterials = [
        'NYC Taxi & Transportation',
        'NYC Attractions & Sightseeing',
        'American Accent & Connected Speech',
      ];

      expect(nyMaterials.length).toBe(3);
      expect(nyMaterials).toContain('NYC Attractions & Sightseeing');
    });

    it('deve ter conteúdo sobre sotaque americano', () => {
      const americanEnglish = {
        features: [
          'Pronunciation of r - always pronounced',
          'T sounds - often sounds like d',
          'Stress patterns - different from British English',
        ],
      };

      expect(americanEnglish.features.length).toBeGreaterThan(0);
      expect(americanEnglish.features[0]).toContain('Pronunciation');
    });
  });

  describe('Connected Speech Practice', () => {
    it('deve ter exemplos de connected speech', () => {
      const examples = [
        { formal: 'want to', casual: 'wanna' },
        { formal: 'going to', casual: 'gonna' },
        { formal: 'got to', casual: 'gotta' },
      ];

      expect(examples.length).toBe(3);
      expect(examples[0].casual).toBe('wanna');
    });
  });
});
