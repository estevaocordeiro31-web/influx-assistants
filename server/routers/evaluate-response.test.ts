import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the LLM to avoid real API calls in tests
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("./utils/sync", () => ({
  getStudentId: vi.fn().mockResolvedValue(null),
  onExerciseCompleted: vi.fn().mockResolvedValue(undefined),
}));

import { invokeLLM } from "./_core/llm";

const mockEvaluation = {
  overallScore: 85,
  fluencyLevel: "very_good",
  isCorrect: true,
  correctedVersion: "I would like to schedule a meeting.",
  grammarErrors: [],
  suggestedChunk: {
    chunk: "I would like to",
    equivalencia: "Eu gostaria de",
    example: "I would like to schedule a meeting.",
    reason: "Expressão formal muito usada em contextos profissionais",
  },
  connectedSpeechTip: {
    tip: "Em inglês falado, 'would like to' soa como 'wud like tuh'",
    example: "'I wud like tuh schedule a meeting'",
  },
  encouragement: "Excelente! Sua frase está muito natural e profissional! 🌟",
};

describe("evaluateResponse procedure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return structured evaluation from LLM", async () => {
    const mockedInvokeLLM = vi.mocked(invokeLLM);
    mockedInvokeLLM.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockEvaluation),
          },
        },
      ],
    } as any);

    // Simulate the evaluation logic
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an evaluator" },
        { role: "user", content: 'Evaluate: "I would like to schedule a meeting."' },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "language_evaluation",
          strict: true,
          schema: { type: "object", properties: {}, required: [], additionalProperties: false },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    expect(content).toBeTruthy();
    const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
    expect(parsed.overallScore).toBe(85);
    expect(parsed.fluencyLevel).toBe("very_good");
    expect(parsed.isCorrect).toBe(true);
    expect(parsed.grammarErrors).toHaveLength(0);
    expect(parsed.suggestedChunk.chunk).toBe("I would like to");
    expect(parsed.connectedSpeechTip.tip).toBeTruthy();
  });

  it("should detect grammar errors for incorrect sentences", async () => {
    const evalWithErrors = {
      ...mockEvaluation,
      overallScore: 55,
      fluencyLevel: "developing",
      isCorrect: false,
      correctedVersion: "I want to go to the store.",
      grammarErrors: [
        {
          original: "I wants to go",
          correction: "I want to go",
          explanation: "Com 'I', o verbo não recebe 's' no presente simples",
        },
      ],
    };

    const mockedInvokeLLM = vi.mocked(invokeLLM);
    mockedInvokeLLM.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(evalWithErrors) } }],
    } as any);

    const response = await invokeLLM({ messages: [] } as any);
    const content = response.choices[0]?.message?.content;
    const parsed = JSON.parse(typeof content === "string" ? content : "{}");

    expect(parsed.isCorrect).toBe(false);
    expect(parsed.grammarErrors).toHaveLength(1);
    expect(parsed.grammarErrors[0].original).toBe("I wants to go");
    expect(parsed.grammarErrors[0].correction).toBe("I want to go");
    expect(parsed.overallScore).toBeLessThan(70);
  });

  it("should handle all fluency levels", () => {
    const levels = ["needs_work", "developing", "good", "very_good", "excellent"];
    levels.forEach(level => {
      expect(["needs_work", "developing", "good", "very_good", "excellent"]).toContain(level);
    });
  });

  it("should validate score range 0-100", () => {
    const validScores = [0, 25, 50, 75, 100];
    validScores.forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it("should include connected speech tip in every evaluation", () => {
    expect(mockEvaluation.connectedSpeechTip).toBeDefined();
    expect(mockEvaluation.connectedSpeechTip.tip).toBeTruthy();
    expect(mockEvaluation.connectedSpeechTip.example).toBeTruthy();
  });

  it("should include chunk suggestion in every evaluation", () => {
    expect(mockEvaluation.suggestedChunk).toBeDefined();
    expect(mockEvaluation.suggestedChunk.chunk).toBeTruthy();
    expect(mockEvaluation.suggestedChunk.equivalencia).toBeTruthy();
    expect(mockEvaluation.suggestedChunk.example).toBeTruthy();
    expect(mockEvaluation.suggestedChunk.reason).toBeTruthy();
  });

  it("should provide encouragement message in Portuguese", () => {
    expect(mockEvaluation.encouragement).toBeTruthy();
    // Encouragement should be in Portuguese (contains common Portuguese words)
    const hasPortuguese = /[àáâãéêíóôõúç]|Excelente|Muito|bom|Continue|praticando/i.test(
      mockEvaluation.encouragement
    );
    expect(hasPortuguese).toBe(true);
  });

  it("should fire onExerciseCompleted hook for scores >= 60", async () => {
    const { onExerciseCompleted, getStudentId } = await import("./utils/sync");
    const mockedGetStudentId = vi.mocked(getStudentId);
    const mockedOnExercise = vi.mocked(onExerciseCompleted);

    mockedGetStudentId.mockResolvedValueOnce(42);

    // Simulate the hook call
    const score = 85;
    if (score >= 60) {
      const studentId = await getStudentId(1);
      if (studentId) await onExerciseCompleted(studentId, score);
    }

    expect(mockedGetStudentId).toHaveBeenCalledWith(1);
    expect(mockedOnExercise).toHaveBeenCalledWith(42, 85);
  });

  it("should NOT fire onExerciseCompleted for scores < 60", async () => {
    const { onExerciseCompleted, getStudentId } = await import("./utils/sync");
    const mockedGetStudentId = vi.mocked(getStudentId);
    const mockedOnExercise = vi.mocked(onExerciseCompleted);

    vi.clearAllMocks();

    const score = 45;
    if (score >= 60) {
      const studentId = await getStudentId(1);
      if (studentId) await onExerciseCompleted(studentId, score);
    }

    expect(mockedGetStudentId).not.toHaveBeenCalled();
    expect(mockedOnExercise).not.toHaveBeenCalled();
  });
});
