/**
 * Router tRPC para Text-to-Speech dos personagens
 * Lucas (US), Emily (UK) e Aiko (AU)
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { 
  generateSpeech, 
  generateDialogue, 
  getCharacterVoiceInfo, 
  getAllCharacters,
  getAvailableProviders,
  testProvider,
  CHARACTER_VOICES,
  type CharacterVoice,
  type TTSProvider
} from "../_core/textToSpeech";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

const characterSchema = z.enum(["lucas", "emily", "aiko"]);
const situationSchema = z.enum(["greeting", "explaining", "excited", "casual", "formal"]).optional();
const providerSchema = z.enum(["openai", "elevenlabs", "google"]).optional();

export const ttsRouter = router({
  /**
   * Retorna os provedores de TTS disponíveis
   */
  getProviders: publicProcedure
    .query(() => {
      return {
        available: getAvailableProviders(),
        order: ["openai", "elevenlabs", "google"],
      };
    }),

  /**
   * Testa um provedor específico de TTS
   */
  testProvider: protectedProcedure
    .input(z.object({
      provider: z.enum(["openai", "elevenlabs", "google"]),
    }))
    .mutation(async ({ input }) => {
      const success = await testProvider(input.provider as TTSProvider);
      return {
        provider: input.provider,
        success,
        message: success 
          ? `Provedor ${input.provider} está funcionando!`
          : `Provedor ${input.provider} falhou no teste.`,
      };
    }),

  /**
   * Gera audio de fala para um personagem especifico
   */
  speak: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(5000),
      character: characterSchema,
      situation: situationSchema,
      preferredProvider: providerSchema,
    }))
    .mutation(async ({ input }) => {
      const result = await generateSpeech({
        text: input.text,
        character: input.character,
        situation: input.situation,
        preferredProvider: input.preferredProvider as TTSProvider | undefined,
      });

      if ('error' in result) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: result.error,
          cause: result,
        });
      }

      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filename = "tts/" + input.character + "-" + timestamp + "-" + randomSuffix + ".mp3";
      
      const { url } = await storagePut(filename, result.audioBuffer, "audio/mpeg");

      return {
        audioUrl: url,
        character: result.character,
        text: input.text,
      };
    }),

  /**
   * Gera audio para um dialogo completo entre personagens
   */
  dialogue: protectedProcedure
    .input(z.object({
      lines: z.array(z.object({
        character: characterSchema,
        text: z.string().min(1).max(2000),
        situation: situationSchema,
      })).min(1).max(20),
    }))
    .mutation(async ({ input }) => {
      const results = await generateDialogue(input.lines);
      const audioUrls: Array<{
        character: string;
        text: string;
        audioUrl: string;
      }> = [];

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const line = input.lines[i];

        if ('error' in result) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Erro na linha " + (i + 1) + ": " + result.error,
            cause: result,
          });
        }

        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = "tts/dialogue-" + line.character + "-" + timestamp + "-" + randomSuffix + ".mp3";
        
        const { url } = await storagePut(filename, result.audioBuffer, "audio/mpeg");

        audioUrls.push({
          character: line.character,
          text: line.text,
          audioUrl: url,
        });
      }

      return {
        dialogue: audioUrls,
        totalLines: audioUrls.length,
      };
    }),

  /**
   * Retorna informacoes de voz de um personagem especifico
   */
  getCharacterInfo: publicProcedure
    .input(z.object({
      character: characterSchema,
    }))
    .query(({ input }) => {
      const info = getCharacterVoiceInfo(input.character);
      if (!info) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Personagem nao encontrado: " + input.character,
        });
      }
      return info;
    }),

  /**
   * Retorna todos os personagens disponiveis
   */
  getAllCharacters: publicProcedure
    .query(() => {
      return getAllCharacters();
    }),

  /**
   * Gera audio para vocabulario com pronuncia de cada personagem
   * Util para comparar sotaques
   */
  compareAccents: protectedProcedure
    .input(z.object({
      word: z.string().min(1).max(100),
    }))
    .mutation(async ({ input }) => {
      const characters: Array<"lucas" | "emily" | "aiko"> = ["lucas", "emily", "aiko"];
      const comparisons: Array<{
        character: CharacterVoice;
        audioUrl: string;
      }> = [];

      for (const character of characters) {
        const result = await generateSpeech({
          text: input.word,
          character,
        });

        if ('error' in result) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Erro ao gerar audio para " + character + ": " + result.error,
          });
        }

        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = "tts/compare-" + character + "-" + timestamp + "-" + randomSuffix + ".mp3";
        
        const { url } = await storagePut(filename, result.audioBuffer, "audio/mpeg");

        comparisons.push({
          character: result.character,
          audioUrl: url,
        });
      }

      return {
        word: input.word,
        comparisons,
      };
    }),
});
