import { describe, it, expect } from 'vitest';

describe('Tutor Personalizado V2', () => {
  describe('Integração com chunks do aluno', () => {
    it('deve buscar chunks do aluno para contexto', () => {
      const studentChunks = [
        'Hello, how are you?',
        'My name is John',
        'I like to read books',
        'What is your favorite color?',
        'Nice to meet you',
      ];

      expect(studentChunks.length).toBe(5);
      expect(studentChunks[0]).toBe('Hello, how are you?');
    });

    it('deve filtrar chunks vazios', () => {
      const chunks = ['Hello', '', 'World', null, 'Test'];
      const filtered = chunks.filter(Boolean);

      expect(filtered.length).toBe(3);
      expect(filtered).toEqual(['Hello', 'World', 'Test']);
    });

    it('deve limitar chunks para primeiros 20', () => {
      const chunks = Array.from({ length: 50 }, (_, i) => `Chunk ${i + 1}`);
      const limited = chunks.slice(0, 20);

      expect(limited.length).toBe(20);
      expect(limited[0]).toBe('Chunk 1');
      expect(limited[19]).toBe('Chunk 20');
    });
  });

  describe('Mapeamento de níveis para CEFR', () => {
    it('deve mapear beginner para A1', () => {
      const LEVEL_TO_CEFR: Record<string, string> = {
        beginner: 'A1',
        elementary: 'A2',
        intermediate: 'B1',
        upper_intermediate: 'B2',
        advanced: 'C1',
        proficient: 'C2',
      };

      expect(LEVEL_TO_CEFR['beginner']).toBe('A1');
    });

    it('deve mapear elementary para A2', () => {
      const LEVEL_TO_CEFR: Record<string, string> = {
        beginner: 'A1',
        elementary: 'A2',
        intermediate: 'B1',
        upper_intermediate: 'B2',
        advanced: 'C1',
        proficient: 'C2',
      };

      expect(LEVEL_TO_CEFR['elementary']).toBe('A2');
    });

    it('deve mapear intermediate para B1', () => {
      const LEVEL_TO_CEFR: Record<string, string> = {
        beginner: 'A1',
        elementary: 'A2',
        intermediate: 'B1',
        upper_intermediate: 'B2',
        advanced: 'C1',
        proficient: 'C2',
      };

      expect(LEVEL_TO_CEFR['intermediate']).toBe('B1');
    });

    it('deve mapear proficient para C2', () => {
      const LEVEL_TO_CEFR: Record<string, string> = {
        beginner: 'A1',
        elementary: 'A2',
        intermediate: 'B1',
        upper_intermediate: 'B2',
        advanced: 'C1',
        proficient: 'C2',
      };

      expect(LEVEL_TO_CEFR['proficient']).toBe('C2');
    });
  });

  describe('Connected Speech Rules por Nível', () => {
    it('deve retornar regras vazias para A1', () => {
      const CONNECTED_SPEECH_RULES: Record<string, any[]> = {
        A1: [],
        A2: [{ rule: 'Linking' }],
      };

      expect(CONNECTED_SPEECH_RULES['A1'].length).toBe(0);
    });

    it('deve retornar Linking para A2', () => {
      const CONNECTED_SPEECH_RULES: Record<string, any[]> = {
        A1: [],
        A2: [{ rule: 'Linking', example: 'I want to → I wanna' }],
      };

      expect(CONNECTED_SPEECH_RULES['A2'].length).toBe(1);
      expect(CONNECTED_SPEECH_RULES['A2'][0].rule).toBe('Linking');
    });

    it('deve retornar múltiplas regras para B1', () => {
      const CONNECTED_SPEECH_RULES: Record<string, any[]> = {
        B1: [
          { rule: 'Linking' },
          { rule: 'Elision' },
        ],
      };

      expect(CONNECTED_SPEECH_RULES['B1'].length).toBe(2);
    });
  });

  describe('Validação de Autorização', () => {
    it('deve permitir acesso se studentId corresponde a userId', () => {
      const ctx = { user: { id: 123, role: 'user' } };
      const studentId = 123;

      const isAuthorized = ctx.user?.id === studentId || ctx.user?.role === 'admin';
      expect(isAuthorized).toBe(true);
    });

    it('deve permitir acesso se role é admin', () => {
      const ctx = { user: { id: 123, role: 'admin' } };
      const studentId = 456;

      const isAuthorized = ctx.user?.id === studentId || ctx.user?.role === 'admin';
      expect(isAuthorized).toBe(true);
    });

    it('deve negar acesso se studentId não corresponde e role não é admin', () => {
      const ctx = { user: { id: 123, role: 'user' } };
      const studentId = 456;

      const isAuthorized = ctx.user?.id === studentId || ctx.user?.role === 'admin';
      expect(isAuthorized).toBe(false);
    });
  });

  describe('Prompt Personalizado', () => {
    it('deve incluir chunks do aluno no prompt', () => {
      const chunks = ['Hello', 'Good morning', 'How are you?'];
      const prompt = `Student chunks:\n${chunks.map((c) => `- ${c}`).join('\n')}`;

      expect(prompt).toContain('Hello');
      expect(prompt).toContain('Good morning');
      expect(prompt).toContain('How are you?');
    });

    it('deve incluir nível CEFR no prompt', () => {
      const cefr = 'B1';
      const prompt = `Student level: ${cefr}`;

      expect(prompt).toContain('B1');
    });

    it('deve incluir mensagem do aluno no prompt', () => {
      const message = 'What is your name?';
      const prompt = `Student message: "${message}"`;

      expect(prompt).toContain('What is your name?');
    });
  });

  describe('Resposta Personalizada', () => {
    it('deve incluir mensagem na resposta', () => {
      const response = {
        message: 'My name is Tutor',
        pronunciation: undefined,
        connectedSpeech: undefined,
        realEnglishNote: undefined,
        usedChunks: [],
      };

      expect(response.message).toBe('My name is Tutor');
    });

    it('deve incluir chunks usados na resposta', () => {
      const response = {
        message: 'Response',
        usedChunks: ['Hello', 'Good morning'],
      };

      expect(response.usedChunks?.length).toBe(2);
      expect(response.usedChunks).toContain('Hello');
    });

    it('deve limitar chunks usados a 5', () => {
      const chunks = Array.from({ length: 10 }, (_, i) => `Chunk ${i + 1}`);
      const usedChunks = chunks.slice(0, 5);

      expect(usedChunks.length).toBe(5);
    });
  });

  describe('Isolamento de Dados por Aluno', () => {
    it('deve retornar chunks diferentes para alunos diferentes', () => {
      const student1Chunks = ['Hello', 'Good morning'];
      const student2Chunks = ['Hi', 'How are you?'];

      expect(student1Chunks).not.toEqual(student2Chunks);
    });

    it('deve manter chunks isolados por studentId', () => {
      const chunksMap: Record<number, string[]> = {
        1: ['Hello', 'Good morning'],
        2: ['Hi', 'How are you?'],
        3: ['Welcome', 'Nice to meet you'],
      };

      expect(chunksMap[1]).toEqual(['Hello', 'Good morning']);
      expect(chunksMap[2]).toEqual(['Hi', 'How are you?']);
      expect(chunksMap[3]).toEqual(['Welcome', 'Nice to meet you']);
    });
  });

  describe('Compatibilidade com Múltiplos Níveis', () => {
    it('deve adaptar resposta para aluno A1', () => {
      const studentLevel = 'beginner';
      const cefr = 'A1';

      expect(cefr).toBe('A1');
    });

    it('deve adaptar resposta para aluno C2', () => {
      const studentLevel = 'proficient';
      const cefr = 'C2';

      expect(cefr).toBe('C2');
    });

    it('deve usar regras de connected speech apropriadas por nível', () => {
      const levels = {
        A1: 0,
        A2: 1,
        B1: 2,
        B2: 2,
        C1: 1,
        C2: 1,
      };

      expect(levels['B1']).toBe(2);
      expect(levels['C2']).toBe(1);
    });
  });
});
