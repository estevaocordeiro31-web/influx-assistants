// Template: Router tRPC para gerenciar IDs de usuários
// Adicionar ao arquivo server/routers.ts ou criar server/routers/unique-id.ts

import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { assignStudentId, assignStudentIdsToAllUsers } from "./db";

export const uniqueIdRouter = router({
  // Atribuir ID a um usuário específico
  assignId: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const studentId = await assignStudentId(input.userId);
      if (!studentId) {
        throw new Error("Falha ao gerar ID");
      }
      return { studentId };
    }),

  // Atribuir IDs a todos os usuários sem ID
  assignAllIds: protectedProcedure
    .mutation(async () => {
      const count = await assignStudentIdsToAllUsers();
      return { 
        success: true, 
        count,
        message: count > 0 
          ? `${count} usuário(s) receberam IDs` 
          : "Todos os usuários já possuem IDs"
      };
    }),
});

// Adicionar ao appRouter:
// uniqueId: uniqueIdRouter,
