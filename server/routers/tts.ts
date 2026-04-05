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