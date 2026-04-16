/**
 * Dashboard Sync Router
 * 
 * Sincroniza alunos ativos do banco de dados centralizado (Dashboard)
 * com o banco local do Personal Tutor
 */

import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { users, studentProfiles } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';

// ============================================================================
// TIPOS
// ============================================================================

interface CentralStudent {
  id: number;
  matricula: string;
  name: string;
  email: string;
  status: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  address?: string;
  responsibleName?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
  unidade_id?: number;
  metadata?: any;
}

interface StudentIntelligence {
  id: number;
  student_id: number;
  contact_phone?: string;
  interest_profile?: string;
  pain_points?: string;
  learning_style?: string;
  current_level?: string;
  mastered_topics?: any;
  struggling_topics?: any;
  confidence_score?: number;
  last_tutor_sync?: string;
  metadata?: any;
}

interface SyncResult {
  success: boolean;
  totalStudents: number;
  syncedStudents: number;
  failedSyncs: number;
  errors: Array<{ studentId: number; error: string }>;
  timestamp: Date;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Conectar ao banco de dados centralizado
 */
async function connectToCentralDatabase() {
  const centralDbUrl = process.env.CENTRAL_DATABASE_URL;
  
  if (!centralDbUrl) {
    throw new Error('CENTRAL_DATABASE_URL não configurada');
  }

  try {
    const connection = await mysql.createConnection(centralDbUrl);
    return connection;
  } catch (error) {
    throw new Error(`Erro ao conectar ao banco centralizado: ${error}`);
  }
}

/**
 * Mapear nível do Dashboard para nível local
 */
function mapLevelToLocal(dashboardLevel?: string): string {
  const levelMap: Record<string, string> = {
    'Book 1': 'beginner',
    'Book 2': 'elementary',
    'Book 3': 'intermediate',
    'Book 4': 'upper_intermediate',
    'Book 5': 'advanced',
    'beginner': 'beginner',
    'elementary': 'elementary',
    'intermediate': 'intermediate',
    'upper_intermediate': 'upper_intermediate',
    'advanced': 'advanced',
    'proficient': 'proficient',
  };

  return levelMap[dashboardLevel || ''] || 'beginner';
}

/**
 * Mapear objetivo do Dashboard para objetivo local
 */
function mapObjectiveToLocal(dashboardObjective?: string): string {
  const objectiveMap: Record<string, string> = {
    'Carreira': 'career',
    'Viagem': 'travel',
    'Estudos': 'studies',
    'Outro': 'other',
    'career': 'career',
    'travel': 'travel',
    'studies': 'studies',
    'other': 'other',
  };

  return objectiveMap[dashboardObjective || ''] || 'other';
}

/**
 * Buscar alunos ativos do banco centralizado
 */
async function fetchActiveCentralStudents(connection: mysql.Connection): Promise<CentralStudent[]> {
  try {
    const query = `
      SELECT 
        id, matricula, name, email, status, phone, gender, birthDate, 
        cpf, rg, address, responsibleName, responsiblePhone, 
        responsibleEmail, unidade_id, metadata
      FROM students
      WHERE status = 'Ativo'
      LIMIT 500
    `;

    const [rows] = await connection.execute(query);
    return rows as CentralStudent[];
  } catch (error) {
    throw new Error(`Erro ao buscar alunos do banco centralizado: ${error}`);
  }
}

/**
 * Buscar inteligência do aluno (student_intelligence)
 */
async function fetchStudentIntelligence(
  connection: mysql.Connection,
  studentId: number
): Promise<StudentIntelligence | null> {
  try {
    const query = `
      SELECT *
      FROM student_intelligence
      WHERE student_id = ?
      LIMIT 1
    `;

    const [rows] = await connection.execute(query, [studentId]);
    const result = rows as StudentIntelligence[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar student_intelligence para ${studentId}:`, error);
    return null;
  }
}

// ============================================================================
// DASHBOARD SYNC ROUTER
// ============================================================================

export const dashboardSyncRouter = router({
  /**
   * Sincronizar alunos ativos do banco centralizado
   */
  syncActiveStudents: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }): Promise<SyncResult> => {
      try {
        // Verificar permissão
        if (ctx.user?.role !== 'admin') {
          throw new Error('Apenas administradores podem sincronizar alunos');
        }

        const db = await getDb();
        if (!db) throw new Error('Database local não disponível');

        // Conectar ao banco centralizado
        const centralConnection = await connectToCentralDatabase();

        try {
          // Buscar alunos ativos do banco centralizado
          const centralStudents = await fetchActiveCentralStudents(centralConnection);

          let syncedCount = 0;
          let failedCount = 0;
          const errors: Array<{ studentId: number; error: string }> = [];

          // Sincronizar cada aluno
          for (const centralStudent of centralStudents) {
            try {
              // Buscar inteligência do aluno
              const intelligence = await fetchStudentIntelligence(
                centralConnection,
                centralStudent.id
              );

              // Mapear dados
              const mappedLevel = mapLevelToLocal(intelligence?.current_level);
              const mappedObjective = mapObjectiveToLocal(intelligence?.interest_profile);

              // Verificar se usuário já existe
              const existingUser = await db
                .select()
                .from(users)
                .where(
                  eq(users.email, centralStudent.email)
                )
                .limit(1);

              if (existingUser.length === 0) {
                // Criar novo usuário
                const newUserResult = await db.insert(users).values({
                  openId: `central_${centralStudent.id}_${Date.now()}`,
                  name: centralStudent.name,
                  email: centralStudent.email,
                  loginMethod: 'dashboard_sync',
                  role: 'user',
                  status: 'ativo',
                  studentId: centralStudent.matricula,
                });

                // Buscar o usuário criado para obter o ID
                const createdUser = await db
                  .select()
                  .from(users)
                  .where(eq(users.email, centralStudent.email))
                  .limit(1);

                const userId = createdUser[0]?.id;

                // Criar perfil do aluno
                if (userId) {
                  await db.insert(studentProfiles).values({
                    userId,
                    objective: mapObjectiveToLocal(intelligence?.interest_profile) as any,
                    currentLevel: mappedLevel as any,
                    totalHoursLearned: 0,
                    streakDays: 0,
                    studyDurationYears: null,
                    studyDurationMonths: 0,
                    specificGoals: intelligence?.interest_profile || null,
                    discomfortAreas: intelligence?.struggling_topics
                      ? JSON.stringify(intelligence.struggling_topics)
                      : null,
                    comfortAreas: intelligence?.mastered_topics
                      ? JSON.stringify(intelligence.mastered_topics)
                      : null,
                    englishConsumptionSources: null,
                    improvementAreas: intelligence?.pain_points || null,
                  });
                }

                syncedCount++;
              } else {
                // Atualizar perfil existente
                const userId = existingUser[0].id;

                // Verificar se perfil existe
                const existingProfile = await db
                  .select()
                  .from(studentProfiles)
                  .where(eq(studentProfiles.userId, userId))
                  .limit(1);

                if (existingProfile.length === 0) {
                  // Criar perfil se não existir
                  await db.insert(studentProfiles).values({
                    userId,
                    objective: mappedObjective as any,
                    currentLevel: mappedLevel as any,
                    totalHoursLearned: 0,
                    streakDays: 0,
                    studyDurationYears: null,
                    studyDurationMonths: 0,
                    specificGoals: intelligence?.interest_profile || null,
                    discomfortAreas: intelligence?.struggling_topics
                      ? JSON.stringify(intelligence.struggling_topics)
                      : null,
                    comfortAreas: intelligence?.mastered_topics
                      ? JSON.stringify(intelligence.mastered_topics)
                      : null,
                    englishConsumptionSources: null,
                    improvementAreas: intelligence?.pain_points || null,
                  });
                } else {
                  // Atualizar perfil existente
                  await db
                    .update(studentProfiles)
                    .set({
                      currentLevel: mappedLevel as any,
                      objective: mappedObjective as any,
                      updatedAt: new Date(),
                    })
                    .where(eq(studentProfiles.userId, userId));
                }

                syncedCount++;
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : String(error);
              errors.push({
                studentId: centralStudent.id,
                error: errorMsg,
              });
              failedCount++;
            }
          }

          return {
            success: true,
            totalStudents: centralStudents.length,
            syncedStudents: syncedCount,
            failedSyncs: failedCount,
            errors,
            timestamp: new Date(),
          };
        } finally {
          await centralConnection.end();
        }
      } catch (error) {
        return {
          success: false,
          totalStudents: 0,
          syncedStudents: 0,
          failedSyncs: 0,
          errors: [
            {
              studentId: 0,
              error: error instanceof Error ? error.message : String(error),
            },
          ],
          timestamp: new Date(),
        };
      }
    }),

  /**
   * Obter estatísticas de sincronização
   */
  getSyncStats: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      try {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Apenas administradores podem acessar estatísticas');
        }

        const db = await getDb();
        if (!db) throw new Error('Database não disponível');

        // Contar usuários sincronizados
        const syncedUsers = await db
          .select()
          .from(users)
          .where(eq(users.loginMethod, 'dashboard_sync'));

        // Contar perfis
        const profiles = await db.select().from(studentProfiles);

        // Distribuição por nível
        const levelDistribution = profiles.reduce(
          (acc, profile) => {
            const level = profile.currentLevel || 'unknown';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        return {
          totalSyncedUsers: syncedUsers.length,
          totalProfiles: profiles.length,
          levelDistribution,
          lastSync: new Date(),
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao obter estatísticas');
      }
    }),

  /**
   * Verificar saúde da integração
   */
  healthCheck: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      try {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Apenas administradores podem fazer health check');
        }

        // Testar conexão com banco local
        const db = await getDb();
        if (!db) throw new Error('Database local indisponível');

        // Testar conexão com banco centralizado
        const centralConnection = await connectToCentralDatabase();
        await centralConnection.end();

        return {
          status: 'healthy',
          localDb: 'connected',
          centralDb: 'connected',
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          localDb: 'error',
          centralDb: 'error',
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
        };
      }
    }),
});
