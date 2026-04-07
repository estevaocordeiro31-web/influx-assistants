import { router, publicProcedure, protectedProcedure } from '../_core/router';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Tipos de badges
const BADGES = {
  WELCOME_STARTER: { id: 'welcome_starter', name: 'Welcome Starter', color: 'bronze', icon: '🎯' },
  VOCABULARY_MASTER: { id: 'vocab_master', name: 'Vocabulary Master', color: 'silver', icon: '📚' },
  SPEAKING_HERO: { id: 'speaking_hero', name: 'Speaking Hero', color: 'gold', icon: '🎤' },
  TEAM_PLAYER: { id: 'team_player', name: 'Team Player', color: 'silver', icon: '👥' },
  ACHIEVEMENT_UNLOCKED: { id: 'achievement_unlocked', name: 'Achievement Unlocked', color: 'gold', icon: '🏆' },
  WELLNESS_CHAMPION: { id: 'wellness_champion', name: 'Wellness Champion', color: 'bronze', icon: '💚' },
  PASSPORT_EXPLORER: { id: 'passport_explorer', name: 'Passport Explorer', color: 'gold', icon: '✨' },
};

export const passportRouter = router({
  // Obter progresso do aluno
  getStudentProgress: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        return {
          userId: ctx.user.id,
          totalPoints: 0,
          completedActivities: 0,
          badges: [],
          level: 'Iniciante',
          nextLevelPoints: 100,
          currentPoints: 0,
        };
      }

      // Mock data - em produção viria do banco
      return {
        userId: ctx.user.id,
        totalPoints: 250,
        completedActivities: 3,
        badges: [BADGES.WELCOME_STARTER, BADGES.TEAM_PLAYER],
        level: 'Explorador',
        nextLevelPoints: 500,
        currentPoints: 250,
        progressPercentage: 50,
      };
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw new Error('Failed to get student progress');
    }
  }),

  // Marcar atividade como completa
  completeActivity: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        score: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      try {
        // Calcular pontos baseado no score
        const points = Math.floor((input.score / 100) * 100);

        // Determinar badges ganhos
        const earnedBadges = [];
        if (input.activityId === 'welcome-quest') {
          earnedBadges.push(BADGES.WELCOME_STARTER);
        } else if (input.activityId === 'vocabulary-adventure') {
          earnedBadges.push(BADGES.VOCABULARY_MASTER);
        } else if (input.activityId === 'speaking-challenge') {
          earnedBadges.push(BADGES.SPEAKING_HERO);
        } else if (input.activityId === 'team-games') {
          earnedBadges.push(BADGES.TEAM_PLAYER);
        } else if (input.activityId === 'achievement-quest') {
          earnedBadges.push(BADGES.ACHIEVEMENT_UNLOCKED);
        } else if (input.activityId === 'wellness-break') {
          earnedBadges.push(BADGES.WELLNESS_CHAMPION);
        }

        return {
          success: true,
          points,
          earnedBadges,
          message: `Parabéns! Você ganhou ${points} pontos!`,
        };
      } catch (error) {
        console.error('Error completing activity:', error);
        throw new Error('Failed to complete activity');
      }
    }),

  // Obter todas as badges do aluno
  getStudentBadges: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      // Mock data - em produção viria do banco
      return {
        userId: ctx.user.id,
        badges: [
          {
            ...BADGES.WELCOME_STARTER,
            earnedAt: new Date('2026-02-15'),
            description: 'Completou a atividade Welcome Quest',
          },
          {
            ...BADGES.TEAM_PLAYER,
            earnedAt: new Date('2026-02-18'),
            description: 'Participou de jogos em equipe',
          },
        ],
        totalBadges: 2,
      };
    } catch (error) {
      console.error('Error getting student badges:', error);
      throw new Error('Failed to get student badges');
    }
  }),

  // Obter certificado de conclusão
  getCertificate: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ ctx, input }: any) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, ctx.user.id),
        });

        if (!user) {
          throw new Error('User not found');
        }

        return {
          certificateId: `CERT-${ctx.user.id}-${input.activityId}-${Date.now()}`,
          studentName: user.name || 'Student',
          activityName: input.activityId,
          completedAt: new Date(),
          certificateUrl: `/certificates/${ctx.user.id}/${input.activityId}.pdf`,
          shareableLink: `https://influx.com/verify/${ctx.user.id}/${input.activityId}`,
        };
      } catch (error) {
        console.error('Error getting certificate:', error);
        throw new Error('Failed to get certificate');
      }
    }),

  // Obter recomendações personalizadas
  getPersonalizedRecommendations: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        return {
          recommendations: [],
          message: 'Nenhuma recomendação disponível',
        };
      }

      // Mock data - em produção viria do banco com análise de progresso
      return {
        recommendations: [
          {
            activityId: 'vocabulary-adventure',
            title: 'Vocabulary Adventure',
            reason: 'Próximo passo recomendado após Welcome Quest',
            difficulty: 'medium',
            estimatedTime: '60 min',
            priority: 'high',
          },
          {
            activityId: 'speaking-challenge',
            title: 'Speaking Challenge',
            reason: 'Desenvolva sua confiança ao falar',
            difficulty: 'medium',
            estimatedTime: '45 min',
            priority: 'medium',
          },
        ],
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }),

  // Obter leaderboard
  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }: any) => {
      try {
        // Mock data - em produção viria do banco
        return {
          leaderboard: [
            { rank: 1, name: 'Ana Silva', points: 850, badges: 5, level: 'Mestre' },
            { rank: 2, name: 'Bruno Santos', points: 720, badges: 4, level: 'Explorador' },
            { rank: 3, name: 'Carla Oliveira', points: 680, badges: 4, level: 'Explorador' },
            { rank: 4, name: 'Diego Costa', points: 550, badges: 3, level: 'Iniciante' },
            { rank: 5, name: 'Eduarda Martins', points: 480, badges: 2, level: 'Iniciante' },
          ],
          totalParticipants: 182,
        };
      } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw new Error('Failed to get leaderboard');
      }
    }),

  // Compartilhar badge em redes sociais
  shareBadge: protectedProcedure
    .input(
      z.object({
        badgeId: z.string(),
        platform: z.enum(['twitter', 'facebook', 'whatsapp', 'linkedin']),
      })
    )
    .mutation(async ({ ctx: userCtx, input }: any) => {
      try {
        const badge = Object.values(BADGES).find((b) => b.id === input.badgeId);

        if (!badge) {
          throw new Error('Badge not found');
        }

        const shareMessages: Record<string, string> = {
          twitter: `Acabei de ganhar a badge "${badge.name}" ${badge.icon} no inFlux! Junte-se a mim na jornada de aprendizado de inglês! 🎉`,
          facebook: `Que orgulho! Conquistei a badge "${badge.name}" ${badge.icon} no inFlux! Estou aprendendo inglês de forma divertida e interativa.`,
          whatsapp: `Oi! Conquistei a badge "${badge.name}" ${badge.icon} no inFlux! Vem comigo nessa jornada de aprendizado! 🚀`,
          linkedin: `Estou desenvolvendo minhas habilidades em inglês no inFlux. Acabei de ganhar a badge "${badge.name}" ${badge.icon}!`,
        };

        return {
          success: true,
          message: shareMessages[input.platform as string] || '',
          shareUrl: `https://influx.com/share/badge/${userCtx.user.id}/${input.badgeId}`,
        };
      } catch (error) {
        console.error('Error sharing badge:', error);
        throw new Error('Failed to share badge');
      }
    }),

  // Obter estatísticas do aluno
  getStudentStats: protectedProcedure.query(async ({ ctx }: any) => {
    try {
      return {
        userId: ctx.user.id,
        stats: {
          totalActivitiesCompleted: 3,
          totalActivitiesAvailable: 6,
          completionRate: 50,
          totalPoints: 250,
          totalBadges: 2,
          averageScore: 85,
          streakDays: 5,
          lastActivityDate: new Date('2026-02-20'),
        },
      };
    } catch (error) {
      console.error('Error getting student stats:', error);
      throw new Error('Failed to get student stats');
    }
  }),
});
