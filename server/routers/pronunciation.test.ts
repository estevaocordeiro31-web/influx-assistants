import { describe, it, expect, vi, beforeEach } from "vitest";
import { pronunciationRouter } from "./pronunciation";
import { TRPCError } from "@trpc/server";

vi.mock("../_core/voiceTranscription", () => ({
  transcribeAudio: vi.fn(),
}));

vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("../db", () => ({
  addMessageToConversation: vi.fn(),
  getStudentProfile: vi.fn(),
  getDb: vi.fn(),
}));

import * as voiceTranscription from "../_core/voiceTranscription";
import * as llm from "../_core/llm";
import * as db from "../db";

describe("Pronunciation Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("transcribeAndEvaluate", () => {
    it("deve transcrever áudio e avaliar pronúncia", async () => {
      const mockUser = {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "student" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      };

      const mockContext = {
        user: mockUser,
        req: {} as any,
        res: {} as any,
      };

      vi.mocked(voiceTranscription.transcribeAudio).mockResolvedValue({
        text: "I would like to help you with this project",
        language: "en",
      } as any);

      vi.mocked(llm.invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                score: 85,
                accuracy: "Excelente",
                clarity: "Muito claro",
                fluency: "Fluente",
                feedback: "Pronúncia muito boa! Continue praticando.",
                chunks_identified: ["I would like to", "help you with"],
              }),
            },
          },
        ],
      } as any);

      vi.mocked(db.addMessageToConversation).mockResolvedValue(undefined);

      const caller = pronunciationRouter.createCaller(mockContext);

      const result = await caller.transcribeAndEvaluate({
        audioUrl: "https://example.com/audio.mp3",
        conversationId: 123,
        originalText: "I would like to help you with this project",
        language: "en",
      });

      expect(result.transcribedText).toBe("I would like to help you with this project");
      expect(result.evaluation?.score).toBe(85);
      expect(result.evaluation?.chunks_identified).toContain("I would like to");
      expect(db.addMessageToConversation).toHaveBeenCalledTimes(2);
    });

    it("deve retornar erro quando usuário não está autenticado", async () => {
      const mockContext = {
        user: null,
        req: {} as any,
        res: {} as any,
      };

      const caller = pronunciationRouter.createCaller(mockContext);

      await expect(
        caller.transcribeAndEvaluate({
          audioUrl: "https://example.com/audio.mp3",
          conversationId: 123,
        })
      ).rejects.toThrow(TRPCError);
    });

    it("deve retornar erro quando transcrição falha", async () => {
      const mockUser = {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "student" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      };

      const mockContext = {
        user: mockUser,
        req: {} as any,
        res: {} as any,
      };

      vi.mocked(voiceTranscription.transcribeAudio).mockResolvedValue(null as any);

      const caller = pronunciationRouter.createCaller(mockContext);

      await expect(
        caller.transcribeAndEvaluate({
          audioUrl: "https://example.com/audio.mp3",
          conversationId: 123,
        })
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("getStudentPronunciationStats", () => {
    it("deve retornar estatísticas de pronúncia do aluno", async () => {
      const mockUser = {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "student" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      };

      const mockContext = {
        user: mockUser,
        req: {} as any,
        res: {} as any,
      };

      const caller = pronunciationRouter.createCaller(mockContext);

      const result = await caller.getStudentPronunciationStats();

      expect(result).toEqual({
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        recentScores: [],
      });
    });

    it("deve retornar erro quando usuário não está autenticado", async () => {
      const mockContext = {
        user: null,
        req: {} as any,
        res: {} as any,
      };

      const caller = pronunciationRouter.createCaller(mockContext);

      await expect(caller.getStudentPronunciationStats()).rejects.toThrow(TRPCError);
    });
  });
});
