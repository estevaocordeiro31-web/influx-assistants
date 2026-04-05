/**
 * server/utils/sync.ts
 * Utilitários de sincronização entre inFlux Personal Assistants e o banco central.
 * Todos os hooks de propagação importam daqui.
 */

import mysql from "mysql2/promise";

/** Cria conexão direta ao banco central */
async function getCentralConn() {
  return mysql.createConnection(process.env.CENTRAL_DATABASE_URL!);
}

/**
 * Retorna o student_id vinculado ao usuário no banco central, ou null.
 * Todos os hooks devem chamar isso antes de propagar ao banco central.
 */
export async function getStudentId(userId: number): Promise<number | null> {
  const conn = await getCentralConn();
  try {
    const [rows] = await conn.execute(
      "SELECT student_id FROM users WHERE id = ? AND student_id IS NOT NULL",
      [userId]
    ) as [Array<{ student_id: number | null }>, unknown];
    return rows[0]?.student_id ?? null;
  } catch {
    return null;
  } finally {
    await conn.end();
  }
}

/**
 * Propaga last_activity_at para o banco central.
 * Chamado em qualquer ação do aluno (login, exercício, badge, streak).
 */
export async function updateLastActivity(studentId: number): Promise<void> {
  const conn = await getCentralConn();
  try {
    await conn.execute(
      "UPDATE students SET last_activity_at = NOW() WHERE id = ?",
      [studentId]
    );
  } catch {
    // Silencia erros para não quebrar o fluxo principal
  } finally {
    await conn.end();
  }
}

/**
 * Incrementa total_exercises_completed e atualiza avg_exercise_score.
 * Chamado após cada exercício completado com sucesso.
 */
export async function onExerciseCompleted(
  studentId: number,
  score: number
): Promise<void> {
  const conn = await getCentralConn();
  try {
    await conn.execute(
      `UPDATE students SET
        total_exercises_completed = total_exercises_completed + 1,
        avg_exercise_score = CASE
          WHEN avg_exercise_score IS NULL THEN ?
          ELSE ROUND((avg_exercise_score * total_exercises_completed + ?) / (total_exercises_completed + 1), 2)
        END,
        last_activity_at = NOW()
      WHERE id = ?`,
      [score, score, studentId]
    );
    await triggerHealthScoreRecalc(studentId, conn);
  } catch {
    // Silencia erros para não quebrar o fluxo principal
  } finally {
    await conn.end();
  }
}

/**
 * Incrementa total_badges no banco central.
 * Chamado após cada badge concedida ao aluno.
 */
export async function onBadgeAwarded(studentId: number): Promise<void> {
  const conn = await getCentralConn();
  try {
    await conn.execute(
      "UPDATE students SET total_badges = total_badges + 1, last_activity_at = NOW() WHERE id = ?",
      [studentId]
    );
    await triggerHealthScoreRecalc(studentId, conn);
  } catch {
    // Silencia erros para não quebrar o fluxo principal
  } finally {
    await conn.end();
  }
}

/**
 * Atualiza current_streak_days no banco central.
 * Chamado quando o streak do aluno é atualizado.
 */
export async function onStreakUpdated(
  studentId: number,
  streakDays: number
): Promise<void> {
  const conn = await getCentralConn();
  try {
    await conn.execute(
      "UPDATE students SET current_streak_days = ?, last_activity_at = NOW() WHERE id = ?",
      [streakDays, studentId]
    );
    await triggerHealthScoreRecalc(studentId, conn);
  } catch {
    // Silencia erros para não quebrar o fluxo principal
  } finally {
    await conn.end();
  }
}

/**
 * Recalcula o health_score do aluno no banco central.
 * Pode receber uma conexão existente para evitar múltiplas conexões.
 */
export async function triggerHealthScoreRecalc(
  studentId: number,
  existingConn?: mysql.Connection
): Promise<void> {
  const conn = existingConn ?? await getCentralConn();
  const shouldClose = !existingConn;
  try {
    // Tenta stored procedure primeiro
    await conn.execute("CALL recalculate_health_score(?)", [studentId]);
  } catch {
    // Stored procedure não existe — calcula inline
    try {
      await conn.execute(
        `UPDATE students SET
          health_score = LEAST(100, GREATEST(0,
            COALESCE(pa_confidence_score, 50) * 0.40 +
            COALESCE(avg_exercise_score, 50) * 0.30 +
            LEAST(current_streak_days * 2, 20) +
            LEAST(total_badges * 2, 10)
          ))
        WHERE id = ?`,
        [studentId]
      );
    } catch {
      // Silencia erros de recálculo
    }
  } finally {
    if (shouldClose) await conn.end();
  }
}
