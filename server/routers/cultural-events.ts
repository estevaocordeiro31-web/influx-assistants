import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { culturalEvents, eventParticipants, eventMissionProgress } from "../../drizzle/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
// FOOD_CHALLENGE_SYSTEM_PROMPT defined inline to avoid cross-boundary import
const FOOD_CHALLENGE_SYSTEM_PROMPT = `You are three Brazilian friends who grew up abroad and came back to help at inFlux school's St. Patrick's Night event. You rotate naturally in the conversation:

- LUCAS (New York): Warm, direct, energetic. American English. Says "awesome", "dude", "totally", "for sure". References NYC life.
- EMILY (London): Charming, witty, slightly formal. British English. Says "brilliant", "lovely", "cheers", "fancy". References London life.
- AIKO (Sydney): Relaxed, sunny, laid-back. Australian English. Says "no worries", "reckon", "heaps", "arvo", "g'day". References Sydney life.

MISSION: Help the student order food in English for the Food Challenge.

RULES:
- Always respond in English
- Pick ONE character to respond (the most appropriate for the context)
- Keep responses SHORT (2-3 sentences max)
- Gently correct mistakes by modeling the right form
- Celebrate when they use a chunk correctly
- If they write in Portuguese, ask them to try in English
- Start message with character name in brackets: [Lucas], [Emily], or [Aiko]

FOOD MENU (St. Patrick's Night):
- Irish stew (cozido irlandês) - $12
- Shepherd's pie (torta de carne com purê) - $14
- Fish and chips - $11
- Guinness beef burger - $15
- Colcannon (purê com couve) - $8
- Soda bread with butter - $5
- Apple crumble (torta de maçã) - $7
- Irish coffee - $9`;

export const culturalEventsRouter = router({
  // Get active event
  getActive: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const events = await db
      .select()
      .from(culturalEvents)
      .where(eq(culturalEvents.active, true))
      .limit(1);
    return events[0] ?? null;
  }),

  // Join as guest
  joinAsGuest: publicProcedure
    .input(z.object({
      eventId: z.string(),
      name: z.string().min(2).max(100),
      whatsapp: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const token = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const [result] = await db.insert(eventParticipants).values({
        eventId: input.eventId,
        guestName: input.name,
        guestWhatsapp: input.whatsapp ?? null,
        guestToken: token,
        totalPoints: 0,
        missionsCompleted: {},
      });
      return { participantId: (result as any).insertId, token };
    }),

  // Join as authenticated student
  joinAsStudent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      // Check if already joined
      const existing = await db
        .select()
        .from(eventParticipants)
        .where(and(
          eq(eventParticipants.eventId, input.eventId),
          eq(eventParticipants.userId, ctx.user.id)
        ))
        .limit(1);
      if (existing[0]) return { participantId: existing[0].id, token: null };
      const [result] = await db.insert(eventParticipants).values({
        eventId: input.eventId,
        userId: ctx.user.id,
        totalPoints: 0,
        missionsCompleted: {},
      });
      return { participantId: (result as any).insertId, token: null };
    }),

  // Get participant by token (guest) or userId (student)
  getParticipant: publicProcedure
    .input(z.object({
      eventId: z.string(),
      token: z.string().optional(),
      userId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      if (input.token) {
        const rows = await db
          .select()
          .from(eventParticipants)
          .where(and(
            eq(eventParticipants.eventId, input.eventId),
            eq(eventParticipants.guestToken, input.token)
          ))
          .limit(1);
        return rows[0] ?? null;
      }
      if (input.userId) {
        const rows = await db
          .select()
          .from(eventParticipants)
          .where(and(
            eq(eventParticipants.eventId, input.eventId),
            eq(eventParticipants.userId, input.userId)
          ))
          .limit(1);
        return rows[0] ?? null;
      }
      return null;
    }),

  // Save mission progress
  saveMissionProgress: publicProcedure
    .input(z.object({
      participantId: z.number(),
      missionId: z.string(),
      score: z.number().min(0).max(200),
      completed: z.boolean(),
      timeSpentSeconds: z.number().optional(),
      answers: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      // Upsert: check if exists
      const existing = await db
        .select()
        .from(eventMissionProgress)
        .where(and(
          eq(eventMissionProgress.participantId, input.participantId),
          eq(eventMissionProgress.missionId, input.missionId)
        ))
        .limit(1);

      if (existing[0]) {
        // Only update if new score is higher
        if (input.score > existing[0].score) {
          await db.update(eventMissionProgress)
            .set({
              score: input.score,
              completed: input.completed,
              timeSpentSeconds: input.timeSpentSeconds ?? existing[0].timeSpentSeconds,
              answers: input.answers ?? existing[0].answers,
              completedAt: input.completed ? new Date() : existing[0].completedAt,
            })
            .where(eq(eventMissionProgress.id, existing[0].id));
        }
      } else {
        await db.insert(eventMissionProgress).values({
          participantId: input.participantId,
          missionId: input.missionId,
          score: input.score,
          completed: input.completed,
          timeSpentSeconds: input.timeSpentSeconds ?? 0,
          answers: input.answers ?? null,
          completedAt: input.completed ? new Date() : null,
        });
      }

      // Recalculate total points
      const allProgress = await db
        .select()
        .from(eventMissionProgress)
        .where(eq(eventMissionProgress.participantId, input.participantId));

      const totalPoints = allProgress.reduce((sum, p) => sum + p.score, 0);
      const missionsCompleted: Record<string, boolean> = {};
      allProgress.forEach(p => { missionsCompleted[p.missionId] = p.completed; });

      await db.update(eventParticipants)
        .set({ totalPoints, missionsCompleted })
        .where(eq(eventParticipants.id, input.participantId));

      return { totalPoints, missionsCompleted };
    }),

  // Get leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ eventId: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const rows = await db
        .select()
        .from(eventParticipants)
        .where(eq(eventParticipants.eventId, input.eventId))
        .orderBy(desc(eventParticipants.totalPoints))
        .limit(input.limit);

      return rows.map((r: typeof rows[0], i: number) => ({
        rank: i + 1,
        name: r.guestName ?? `Aluno #${r.userId}`,
        totalPoints: r.totalPoints,
        missionsCompleted: r.missionsCompleted as Record<string, boolean> ?? {},
        isGuest: !r.userId,
      }));
    }),

  // Food challenge chat (AI with Lucas/Emily/Aiko)
  foodChallengeChat: publicProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: FOOD_CHALLENGE_SYSTEM_PROMPT },
          ...input.messages,
        ],
      });
      const content = response.choices[0]?.message?.content ?? '';
      return { content };
    }),

  // Evaluate speaking response
  evaluateSpeaking: publicProcedure
    .input(z.object({
      transcription: z.string(),
      scenarioId: z.string(),
      character: z.enum(['lucas', 'emily', 'aiko']),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: 'system' as const, content: 'You are an English teacher evaluating a student spoken response at a cultural event. The student is a Brazilian adult learning English at inFlux school. Evaluate their response and return JSON with scores and feedback in Portuguese.' },
          {
            role: 'user' as const,
            content: `Scenario ID: ${input.scenarioId}
Character: ${input.character}
Student's transcription: "${input.transcription}"

Evaluate this response. Return JSON with:
- vocabulary_score (0-30): Did they use chunks/vocabulary from the lesson?
- fluency_score (0-25): Was the response natural and fluent?
- content_score (0-25): Did they address the prompt appropriately?
- pronunciation_score (0-20): Estimated pronunciation quality from text
- total_score (0-100): Sum of all scores
- feedback_pt: Encouraging feedback in Portuguese (2-3 sentences)
- chunks_used: Array of chunks from the lesson that were used
- suggestion: One specific improvement suggestion in Portuguese`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'speaking_evaluation',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                vocabulary_score: { type: 'number' },
                fluency_score: { type: 'number' },
                content_score: { type: 'number' },
                pronunciation_score: { type: 'number' },
                total_score: { type: 'number' },
                feedback_pt: { type: 'string' },
                chunks_used: { type: 'array', items: { type: 'string' } },
                suggestion: { type: 'string' },
              },
              required: ['vocabulary_score', 'fluency_score', 'content_score', 'pronunciation_score', 'total_score', 'feedback_pt', 'chunks_used', 'suggestion'],
              additionalProperties: false,
            }
          }
        }
      });
      const raw = (response.choices[0]?.message?.content as string) ?? '{}';
      return JSON.parse(raw);
    }),
});
