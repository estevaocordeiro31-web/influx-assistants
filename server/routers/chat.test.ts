import { describe, it, expect, vi, beforeEach } from "vitest";
import { chatRouter } from "./chat";
import { TRPCError } from "@trpc/server";

// Mock das dependências
vi.mock("../db", () => ({
  getStudentProfile: vi.fn(),
  createConversation: vi.fn(),
  getConversationMessages: vi.fn(),
  addMessageToConversation: vi.fn(),
  getChunksByContext: vi.fn(),
}));

vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import * as db from "../db";
import * as llm from "../_core/llm";

describe("Chat Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("deve criar uma nova conversa quando conversationId não é fornecido", async () => {
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

      vi.mocked(db.getStudentProfile).mockResolvedValue({
        id: 1,
        userId: 1,
        objective: "career",
        currentLevel: "intermediate",
        totalHoursLearned: 10,
        streakDays: 5,
        lastActivityAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(db.createConversation).mockResolvedValue({
        insertId: 123,
      } as any);

      vi.mocked(db.getConversationMessages).mockResolvedValue([]);

      vi.mocked(db.getChunksByContext).mockResolvedValue([
        {
          id: 1,
          englishChunk: "I would like to",
          portugueseEquivalent: "Eu gostaria de",
          level: "beginner",
          context: "career",
          example: "I would like to discuss the project",
          nativeUsageFrequency: "very_common",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      vi.mocked(llm.invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Great! I would like to help you with that.",
            },
          },
        ],
      } as any);

      vi.mocked(db.addMessageToConversation).mockResolvedValue(undefined);

      const caller = chatRouter.createCaller(mockContext);

      const result = await caller.sendMessage({
        message: "Hello, I want to learn English",
        objective: "career",
        level: "intermediate",
      });

      expect(result.conversationId).toBe(123);
      expect(result.message).toBe("Great! I would like to help you with that.");
      expect(db.createConversation).toHaveBeenCalled();
      expect(llm.invokeLLM).toHaveBeenCalled();
      expect(db.addMessageToConversation).toHaveBeenCalledTimes(2);
    });

    it("deve retornar erro quando usuário não está autenticado", async () => {
      const mockContext = {
        user: null,
        req: {} as any,
        res: {} as any,
      };

      const caller = chatRouter.createCaller(mockContext);

      await expect(
        caller.sendMessage({
          message: "Hello",
        })
      ).rejects.toThrow(TRPCError);
    });

    it("deve usar conversa existente quando conversationId é fornecido", async () => {
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

      vi.mocked(db.getStudentProfile).mockResolvedValue({
        id: 1,
        userId: 1,
        objective: "career",
        currentLevel: "intermediate",
        totalHoursLearned: 10,
        streakDays: 5,
        lastActivityAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(db.getConversationMessages).mockResolvedValue([
        {
          id: 1,
          conversationId: 123,
          role: "user",
          content: "Previous message",
          chunksUsed: null,
          audioUrl: null,
          audioTranscription: null,
          pronunciationScore: null,
          createdAt: new Date(),
        },
      ]);

      vi.mocked(db.getChunksByContext).mockResolvedValue([]);

      vi.mocked(llm.invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Response to your message",
            },
          },
        ],
      } as any);

      vi.mocked(db.addMessageToConversation).mockResolvedValue(undefined);

      const caller = chatRouter.createCaller(mockContext);

      const result = await caller.sendMessage({
        conversationId: 123,
        message: "Continue the conversation",
      });

      expect(result.conversationId).toBe(123);
      expect(db.createConversation).not.toHaveBeenCalled();
      expect(db.getConversationMessages).toHaveBeenCalledWith(123);
    });
  });

  describe("getConversation", () => {
    it("deve retornar mensagens de uma conversa", async () => {
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

      const mockMessages = [
        {
          id: 1,
          conversationId: 123,
          role: "user" as const,
          content: "Hello",
          chunksUsed: null,
          audioUrl: null,
          audioTranscription: null,
          pronunciationScore: null,
          createdAt: new Date(),
        },
        {
          id: 2,
          conversationId: 123,
          role: "assistant" as const,
          content: "Hi there!",
          chunksUsed: null,
          audioUrl: null,
          audioTranscription: null,
          pronunciationScore: null,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getConversationMessages).mockResolvedValue(mockMessages);

      const caller = chatRouter.createCaller(mockContext);

      const result = await caller.getConversation({ conversationId: 123 });

      expect(result).toEqual(mockMessages);
      expect(db.getConversationMessages).toHaveBeenCalledWith(123);
    });

    it("deve retornar erro quando usuário não está autenticado", async () => {
      const mockContext = {
        user: null,
        req: {} as any,
        res: {} as any,
      };

      const caller = chatRouter.createCaller(mockContext);

      await expect(
        caller.getConversation({ conversationId: 123 })
      ).rejects.toThrow(TRPCError);
    });
  });
});
