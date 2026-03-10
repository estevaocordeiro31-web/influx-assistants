/**
 * server/routers/student-data.ts
 * 
 * Fornece ao aluno logado os dados consolidados do Dashboard Central:
 * - Dados cadastrais (nome, nível, turma, matrícula)
 * - Dados de saúde (health_score, churn_risk_level)
 * - Dados da Elie (pa_confidence_score, last_elie_session)
 * - Dados de progresso (total_exercises, avg_score, streak, badges)
 * - Perfil de inteligência (student_intelligence)
 */

import { router, protectedProcedure } from "../_core/trpc";
import mysql from "mysql2/promise";

async function getCentralConnection() {
  return mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
}

export const studentDataRouter = router({
  /**
   * Retorna todos os dados do aluno logado vindos do Dashboard Central.
   * Usado pelo StudentDashboard para exibir informações consolidadas.
   */
  getMyStudentData: protectedProcedure.query(async ({ ctx }) => {
    const conn = await getCentralConnection();
    try {
      // Buscar student_id do usuário logado
      const [userRows] = await conn.execute(
        `SELECT student_id FROM users WHERE id = ? AND student_id IS NOT NULL`,
        [ctx.user.id]
      ) as [Array<{ student_id: number }>, unknown];

      if (!userRows.length || !userRows[0].student_id) {
        return null; // Aluno não vinculado ao Dashboard Central
      }

      const studentId = userRows[0].student_id;

      // Buscar dados completos do aluno na tabela students
      const [studentRows] = await conn.execute(
        `SELECT 
          id, matricula, name, email, phone, status, book_level,
          schedule, health_score, churn_risk_level,
          pa_confidence_score, last_elie_session, last_activity_at,
          total_exercises_completed, avg_exercise_score,
          current_streak_days, total_badges
        FROM students WHERE id = ?`,
        [studentId]
      ) as [Array<Record<string, unknown>>, unknown];

      if (!studentRows.length) return null;
      const student = studentRows[0];

      // Buscar perfil de inteligência (se existir)
      const [intelRows] = await conn.execute(
        `SELECT interest_profile, pain_points, learning_style, current_level,
                mastered_topics, struggling_topics, confidence_score, last_tutor_sync
         FROM student_intelligence WHERE student_id = ? LIMIT 1`,
        [studentId]
      ).catch(() => [[], null] as unknown as [Array<Record<string, unknown>>, unknown]) as [Array<Record<string, unknown>>, unknown];

      const intel = intelRows[0] || null;

      // Buscar turma
      const [classRows] = await conn.execute(
        `SELECT cg.name as class_name, cg.level as class_level, cg.schedule as class_schedule
         FROM class_groups cg
         WHERE cg.id = (SELECT class_group_id FROM students WHERE id = ?)
         LIMIT 1`,
        [studentId]
      ).catch(() => [[], null] as unknown as [Array<Record<string, unknown>>, unknown]) as [Array<Record<string, unknown>>, unknown];

      const classInfo = classRows[0] || null;

      return {
        studentId,
        // Dados cadastrais
        matricula: student.matricula as string | null,
        name: student.name as string,
        email: student.email as string | null,
        phone: student.phone as string | null,
        status: student.status as string,
        bookLevel: student.book_level as string | null,
        schedule: student.schedule as string | null,
        // Turma
        className: classInfo?.class_name as string | null,
        classLevel: classInfo?.class_level as string | null,
        classSchedule: classInfo?.class_schedule as string | null,
        // Saúde e risco
        healthScore: student.health_score as number | null,
        churnRiskLevel: student.churn_risk_level as string | null,
        // Dados da Elie
        paConfidenceScore: student.pa_confidence_score as number | null,
        lastElieSession: student.last_elie_session as Date | null,
        lastActivityAt: student.last_activity_at as Date | null,
        // Progresso
        totalExercisesCompleted: (student.total_exercises_completed as number) || 0,
        avgExerciseScore: student.avg_exercise_score as number | null,
        currentStreakDays: (student.current_streak_days as number) || 0,
        totalBadges: (student.total_badges as number) || 0,
        // Perfil de inteligência
        intelligence: intel ? {
          interestProfile: intel.interest_profile as string | null,
          painPoints: intel.pain_points as string | null,
          learningStyle: intel.learning_style as string | null,
          currentLevel: intel.current_level as string | null,
          masteredTopics: typeof intel.mastered_topics === 'string'
            ? JSON.parse(intel.mastered_topics as string || '[]')
            : (intel.mastered_topics || []),
          strugglingTopics: typeof intel.struggling_topics === 'string'
            ? JSON.parse(intel.struggling_topics as string || '[]')
            : (intel.struggling_topics || []),
          confidenceScore: intel.confidence_score as number | null,
          lastTutorSync: intel.last_tutor_sync as Date | null,
        } : null,
      };
    } finally {
      await conn.end();
    }
  }),
});
