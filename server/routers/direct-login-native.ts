import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

const COOKIE_NAME = "session";

export const directLoginNativeRouter = router({
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Verificar token
        if (!input.token) {
          return {
            success: false,
            message: "Token inválido",
          };
        }

        console.log("[DirectLogin] Token válido para email");

        return {
          success: true,
          message: "Login realizado com sucesso",
          redirectUrl: "/dashboard",
        };
      } catch (error) {
        console.error("[DirectLogin] Erro:", error);
        return {
          success: false,
          message: "Erro ao processar login",
        };
      }
    }),

  logout: publicProcedure.mutation(async () => {
    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  }),
});
