import { router, adminProcedure } from '../_core/trpc';
import { notifyOwner } from '../_core/notification';
import mysql from 'mysql2/promise';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb, assignStudentId, assignStudentIdsToAllUsers } from '../db';
import { users, studentProfiles } from '../../drizzle/schema';
import { eq, isNull } from 'drizzle-orm';
import { createStudentSchema } from '../../shared/validation-schemas';
import { hashPassword } from '../auth-password';

export const adminStudentsRouter = router({
  /**
   * Obter lista de alunos (admin only)
   */
  getStudents: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        // Buscar todos os usuários com role 'user' (alunos)
        let query = database
          .select({
            id: users.id,
            studentId: users.studentId,
            name: users.name,
            email: users.email,
            status: users.status,
            createdAt: users.createdAt,
            lastSignedIn: users.lastSignedIn,
          })
          .from(users)
          .where(eq(users.role, 'user'));

        // Aplicar filtro de busca se fornecido
        if (input.search) {
          const searchTerm = `%${input.search}%`;
          // Nota: Drizzle não suporta LIKE diretamente, então fazemos a filtragem em memória
        }

        const allStudents = await query;

        // Filtrar em memória se necessário
        let filteredStudents = allStudents;
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filteredStudents = allStudents.filter(
            (s) =>
              s.name?.toLowerCase().includes(searchLower) ||
              s.email?.toLowerCase().includes(searchLower)
          );
        }

        // Aplicar paginação
        const students = filteredStudents.slice(input.offset, input.offset + input.limit);

        // Enriquecer com dados de perfil
        const enrichedStudents = await Promise.all(
          students.map(async (student) => {
            const profile = await database
              .select()
              .from(studentProfiles)
              .where(eq(studentProfiles.userId, student.id))
              .then((rows) => rows[0] || null);

            return {
              id: student.id,
              studentId: student.studentId || null,
              name: student.name || 'Sem nome',
              email: student.email || 'Sem email',
              level: profile?.currentLevel || 'beginner',
              objective: profile?.objective || 'other',
              hoursLearned: profile?.totalHoursLearned || 0,
              streakDays: profile?.streakDays || 0,
              lastActivity: student.lastSignedIn
                ? new Date(student.lastSignedIn).toLocaleDateString('pt-BR')
                : 'Nunca',
              status: student.status || 'ativo',
              createdAt: student.createdAt,
            };
          })
        );

        return {
          success: true,
          students: enrichedStudents,
          total: filteredStudents.length,
          hasMore: input.offset + input.limit < filteredStudents.length,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar alunos: ${error}`,
        });
      }
    }),

  /**
   * Obter detalhes de um aluno específico
   */
  getStudentDetail: adminProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const [student] = await database
          .select()
          .from(users)
          .where(eq(users.id, input.studentId));

        if (!student) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        const [profile] = await database
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.userId, input.studentId));

        return {
          success: true,
          student: {
            id: student.id,
            studentId: (student as any).studentId || null,
            name: student.name,
            email: student.email,
            createdAt: student.createdAt,
            lastSignedIn: student.lastSignedIn,
            profile: profile || null,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar detalhes do aluno: ${error}`,
        });
      }
    }),

  /**
   * Gerar/atribuir studentId para um aluno específico
   */
  assignStudentId: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const newStudentId = await assignStudentId(input.userId);
        if (!newStudentId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao gerar ID do aluno',
          });
        }
        return {
          success: true,
          studentId: newStudentId,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao atribuir ID: ${error}`,
        });
      }
    }),

  /**
   * Gerar/atribuir studentId para todos os alunos sem ID
   */
  assignAllStudentIds: adminProcedure
    .mutation(async () => {
      try {
        const count = await assignStudentIdsToAllUsers();
        return {
          success: true,
          message: `${count} alunos receberam IDs`,
          count,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao atribuir IDs: ${error}`,
        });
      }
    }),

  /**
   * Criar novo aluno
   */
  createStudent: adminProcedure
    .input(createStudentSchema)
    .mutation(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados nao disponivel',
          });
        }

        // Verificar se email ja existe
        const existingUser = await database
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .then((rows) => rows[0] || null);

        if (existingUser) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Este email ja esta cadastrado',
          });
        }

        // Gerar senha temporaria aleatoria
        const tempPassword = Math.random().toString(36).slice(-12);
        const passwordHash = await hashPassword(tempPassword);

        // Gerar openId unico
        const openId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Criar usuario
        const result = await database
          .insert(users)
          .values({
            openId,
            name: input.name,
            email: input.email,
            passwordHash,
            role: 'user',
            loginMethod: 'password',
          });

        const userId = (result as any).insertId || (result as any)[0]?.insertId;

        if (!userId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao criar usuario',
          });
        }

        // Criar perfil do aluno
        await database
          .insert(studentProfiles)
          .values({
            userId,
            currentLevel: input.level,
            objective: input.objective,
            totalHoursLearned: 0,
            streakDays: 0,
            createdAt: new Date(),
          });

        // Gerar studentId
        const studentId = await assignStudentId(userId);

        return {
          success: true,
          student: {
            id: userId,
            studentId,
            name: input.name,
            email: input.email,
            level: input.level,
            objective: input.objective,
            tempPassword,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao criar aluno: ${error}`,
        });
      }
    }),

  /**
   * Resetar senha de um aluno (admin only)
   */
  resetStudentPassword: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        sendEmail: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        // Buscar usuário
        const userResult = await database
          .select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1);

        if (!userResult || userResult.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Aluno não encontrado',
          });
        }

        const user = userResult[0];
        const firstName = user.name?.split(' ')[0] || 'Aluno';

        // Gerar nova senha no padrão PrimeiroNome@2026
        const newPassword = `${firstName}@2026`;
        const passwordHash = await hashPassword(newPassword);

        // Atualizar senha no banco local e marcar para troca obrigatória
        await database
          .update(users)
          .set({ passwordHash, mustChangePassword: true })
          .where(eq(users.id, input.userId));

        // Atualizar senha no banco central também
        try {
          const centralConn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
          await centralConn.execute(
            'UPDATE users SET password_hash = ?, must_change_password = TRUE WHERE email = ?',
            [passwordHash, user.email]
          );
          await centralConn.end();
        } catch (centralError) {
          console.error('[Reset] Erro ao atualizar banco central:', centralError);
          // Não falhar se banco central não atualizar
        }

        console.log(`[Admin] Senha resetada para: ${user.name} (${user.email})`);

        // Enviar notificação ao owner com as credenciais (fallback enquanto email real não está configurado)
        if (input.sendEmail && user.email) {
          try {
            await notifyOwner({
              title: `[inFlux] Senha resetada: ${user.name}`,
              content: `Credenciais resetadas para o aluno:\n\nNome: ${user.name}\nEmail: ${user.email}\nNova senha: ${newPassword}\n\nLink de acesso: https://influxassist-2anfqga4.manus.space/login`,
            });
          } catch (notifyError) {
            console.error('[Reset] Erro ao notificar:', notifyError);
          }
        }

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          newPassword,
          emailSent: input.sendEmail && !!user.email,
          message: `Senha resetada com sucesso para ${user.name}. Nova senha: ${newPassword}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao resetar senha: ${error}`,
        });
      }
    }),

  /**
   * Buscar usuários sem vínculo com student_id (para reconciliação)
   */
  getUnlinkedUsers: adminProcedure.query(async () => {
    try {
      const centralConn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
      try {
        // Buscar usuários sem student_id no banco central
        const [rows] = await centralConn.execute(`
          SELECT u.id, u.name, u.email, u.created_at, u.status
          FROM users u
          WHERE u.student_id IS NULL
          AND u.role = 'user'
          ORDER BY u.name ASC
          LIMIT 50
        `);
        return { users: rows as any[] };
      } finally {
        await centralConn.end();
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Erro ao buscar usuários sem vínculo: ${error}`,
      });
    }
  }),

  /**
   * Buscar candidatos no banco central para reconciliação
   */
  searchStudentCandidates: adminProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input }) => {
      try {
        const centralConn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
        try {
          const searchTerm = `%${input.query}%`;
          const [rows] = await centralConn.execute(`
            SELECT s.id, s.name, s.email, s.book_level, s.status, s.matricula
            FROM students s
            WHERE (s.name LIKE ? OR s.email LIKE ? OR s.matricula LIKE ?)
            AND s.status = 'Ativo'
            ORDER BY s.name ASC
            LIMIT 20
          `, [searchTerm, searchTerm, searchTerm]);
          return { students: rows as any[] };
        } finally {
          await centralConn.end();
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao buscar candidatos: ${error}`,
        });
      }
    }),

  /**
   * Vincular usuário a um student_id do banco central
   */
  linkUserToStudent: adminProcedure
    .input(z.object({
      userId: z.number(),
      studentId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const centralConn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
        try {
          // Verificar se o student_id já está vinculado
          const [existing] = await centralConn.execute(
            'SELECT id FROM users WHERE student_id = ? AND id != ?',
            [input.studentId, input.userId]
          );
          if (Array.isArray(existing) && existing.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Este student_id já está vinculado a outro usuário',
            });
          }
          // Atualizar o student_id do usuário
          await centralConn.execute(
            'UPDATE users SET student_id = ? WHERE id = ?',
            [input.studentId, input.userId]
          );
          console.log(`[Admin] Usuário ${input.userId} vinculado ao student ${input.studentId}`);
          return { success: true, message: 'Usuário vinculado com sucesso' };
        } finally {
          await centralConn.end();
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao vincular usuário: ${error}`,
        });
      }
    }),
});
