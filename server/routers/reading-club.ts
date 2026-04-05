import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import {
  readingClubPosts,
  readingClubComments,
  readingClubBadges,
  readingClubEvents,
  readingClubEventParticipants,
  studentInfluxDollars,
  influxDollarTransactions,
  users,
} from '../../drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const readingClubRouter = router({
  // Create a reading club post
  createPost: protectedProcedure
    .input(
      z.object({
        contentType: z.enum(['book', 'magazine', 'comic', 'podcast', 'article']),
        title: z.string().min(1),
        excerpt: z.string().optional(),
        imageUrl: z.string().optional(),
        sourceUrl: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        const result = await db.insert(readingClubPosts).values({
          studentId: ctx.user.id,
          contentType: input.contentType,
          title: input.title,
          excerpt: input.excerpt,
          imageUrl: input.imageUrl,
          sourceUrl: input.sourceUrl,
          notes: input.notes,
        });

        const postId = (result[0] as any).insertId as number;

        return {
          success: true,
          postId,
          message: 'Post compartilhado com sucesso!',
        };
      } catch (error) {
        console.error('[ReadingClub] Erro ao criar post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao compartilhar post',
        });
      }
    }),

  // Get all posts with pagination
  getPosts: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        contentType: z.enum(['book', 'magazine', 'comic', 'podcast', 'article']).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        const offset = (input.page - 1) * input.limit;

        const posts = await db
          .select({
            id: readingClubPosts.id,
            studentId: readingClubPosts.studentId,
            studentName: users.name,
            contentType: readingClubPosts.contentType,
            title: readingClubPosts.title,
            excerpt: readingClubPosts.excerpt,
            imageUrl: readingClubPosts.imageUrl,
            sourceUrl: readingClubPosts.sourceUrl,
            notes: readingClubPosts.notes,
            likes: readingClubPosts.likes,
            commentsCount: readingClubPosts.commentsCount,
            createdAt: readingClubPosts.createdAt,
          })
          .from(readingClubPosts)
          .innerJoin(users, eq(readingClubPosts.studentId, users.id))
          .orderBy(desc(readingClubPosts.createdAt))
          .limit(input.limit)
          .offset(offset);

        return posts;
      } catch (error) {
        console.error('[ReadingClub] Erro ao buscar posts:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar posts',
        });
      }
    }),

  // Add comment to post
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        // Insert comment
        await db.insert(readingClubComments).values({
          postId: input.postId,
          studentId: ctx.user.id,
          content: input.content,
        });

        // Update comments count
        const [post] = await db
          .select()
          .from(readingClubPosts)
          .where(eq(readingClubPosts.id, input.postId))
          .limit(1);

        if (post) {
          await db
            .update(readingClubPosts)
            .set({ commentsCount: post.commentsCount + 1 })
            .where(eq(readingClubPosts.id, input.postId));
        }

        return { success: true, message: 'Comentário adicionado!' };
      } catch (error) {
        console.error('[ReadingClub] Erro ao adicionar comentário:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao adicionar comentário',
        });
      }
    }),

  // Get leaderboard (most active students)
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        // This is a simplified version - in production you'd use raw SQL for better performance
        const posts = await db
          .select({
            studentId: readingClubPosts.studentId,
            studentName: users.name,
            postCount: readingClubPosts.id,
          })
          .from(readingClubPosts)
          .innerJoin(users, eq(readingClubPosts.studentId, users.id))
          .limit(input.limit);

        // Group by student and count posts
        const leaderboard = posts.reduce(
          (acc, post) => {
            const existing = acc.find((item) => item.studentId === post.studentId);
            if (existing) {
              existing.postCount += 1;
            } else {
              acc.push({
                studentId: post.studentId,
                studentName: post.studentName,
                postCount: 1,
              });
            }
            return acc;
          },
          [] as Array<{ studentId: number; studentName: string | null; postCount: number }>
        );

        return leaderboard.sort((a, b) => b.postCount - a.postCount).slice(0, input.limit);
      } catch (error) {
        console.error('[ReadingClub] Erro ao buscar leaderboard:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar leaderboard',
        });
      }
    }),

  // Award badge to student
  awardBadge: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        badgeType: z.enum([
          'active_reader',
          'sharer',
          'commenter',
          'event_participant',
          'book_master',
          'weekly_warrior',
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem conceder badges',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        // Award badge
        const badgeResult = await db.insert(readingClubBadges).values({
          studentId: input.studentId,
          badgeType: input.badgeType,
          influxDollars: 10,
        });

        const badgeId = (badgeResult[0] as any).insertId as number;

        // Update or create student inFlux dollars balance
        const [balance] = await db
          .select()
          .from(studentInfluxDollars)
          .where(eq(studentInfluxDollars.studentId, input.studentId))
          .limit(1);

        if (balance) {
          await db
            .update(studentInfluxDollars)
            .set({
              balance: balance.balance + 10,
              totalEarned: balance.totalEarned + 10,
            })
            .where(eq(studentInfluxDollars.studentId, input.studentId));
        } else {
          await db.insert(studentInfluxDollars).values({
            studentId: input.studentId,
            balance: 10,
            totalEarned: 10,
          });
        }

        // Record transaction
        await db.insert(influxDollarTransactions).values({
          studentId: input.studentId,
          amount: 10,
          type: 'earn',
          reason: `badge_earned_${input.badgeType}`,
          relatedId: badgeId,
        });

        return { success: true, message: 'Badge concedida com sucesso!' };
      } catch (error) {
        console.error('[ReadingClub] Erro ao conceder badge:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao conceder badge',
        });
      }
    }),

  // Get student badges
  getStudentBadges: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        const badges = await db
          .select()
          .from(readingClubBadges)
          .where(eq(readingClubBadges.studentId, input.studentId))
          .orderBy(desc(readingClubBadges.earnedAt));

        return badges;
      } catch (error) {
        console.error('[ReadingClub] Erro ao buscar badges:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar badges',
        });
      }
    }),

  // Get student inFlux dollars balance
  getStudentBalance: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      try {
        const [balance] = await db
          .select()
          .from(studentInfluxDollars)
          .where(eq(studentInfluxDollars.studentId, input.studentId))
          .limit(1);

        return balance || { studentId: input.studentId, balance: 0, totalEarned: 0, totalSpent: 0 };
      } catch (error) {
        console.error('[ReadingClub] Erro ao buscar saldo:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar saldo',
        });
      }
    }),
});
