  // Obter leaderboard (top 10)
  getLeaderboard: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const leaders = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.totalPoints))
      .limit(10);

    return leaders.map((leader: any, index: number) => ({
      ...leader,
      rank: index + 1,
    }));
  }),

  // Obter posição do aluno no leaderboard
  getStudentRank: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const studentId = ctx.user.id;

    const studentLeaderboard = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.studentId, studentId))
      .limit(1);

    if (!studentLeaderboard.length) {
      return null;
    }

    return studentLeaderboard[0];