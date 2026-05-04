import { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { getDb } from "../db";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./env";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sdk } from "./sdk";

// Cookie name para sessão
const COOKIE_NAME = "manus_session_token";

// Mapeamento de tokens para emails
const DIRECT_LOGIN_TOKENS: Record<string, string> = {
  // Laís Milena Gambini
  "1b79abbadd043bef01841a07bf000c10fdb3eabcf765ebf9070c935ec31c7e2f":
    "lais.gambini@example.com",
  // Camila Gonsalves
  "d80e078ddb9ce0e237a67b4e00f09fddc762cc5ee9eadb3e9938cd4b19b81d08":
    "camiladarosa@outlook.com",
  // Andressa Amorim de Araújo
  "711b17885385ec86441dbf8da9980df3e5f627d7be9f6272bed35525e34f2c2f":
    "andressaamorimdearaujo03@gmail.com",
  // Elizabeth Rodrigues de Souza
  "958261bbf38afd1ec8d83b83e5e40f363c97d1b673f51e3dada43b0e369bbe6f":
    "elizabeth.engenhariaeletrica@gmail.com",
  // Carlos Alberto Pirani Júnior
  "439e0189686a35da5cb61447eab54a27a67e424a18c8582d2352b316333f9989":
    "carlos_junior_707@hotmail.com",
  // Diego Bim (Franqueado Osasco)
  "564ecec8776ab92eda92512735ff8b46c11ececd920886505742769e57514265":
    "direcaoosasco@influx.com.br",
  // Estevão Cordeiro (Admin - Teste de Aluno)
  "f8e9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8":
    "direcaojundiairetiro@influx.com.br",
  // Estevão Cordeiro (Teste Aluno - Book 5)
  "6ad492015f0016276cad0278bc6aeaedbba9d0dc00bc8e91f9b569f4bf631fbb":
    "estevao.teste.aluno@influx.com.br",
  // Fábio Hideki Kiyohashi (Conversação Avançada)
  "81a58e1f73ecdeb88e4d69dbc7ca26e9dc5246f501cd684095e33cc07a713682":
    "fabio_hkl@hotmail.com",
};

/**
 * Registra rota de login direto via URL
 * Endpoint GET nativo do Express (não usa tRPC)
 */
export function registerDirectLoginRoutes(app: Express) {
  // Garantir que cookie-parser está instalado
  app.use(cookieParser());

  app.get("/api/direct-login/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      console.log("[DirectLogin] Tentativa de login com token:", token.substring(0, 16) + "...");

      // 1. Validar token
      const userEmail = DIRECT_LOGIN_TOKENS[token];
      if (!userEmail) {
        console.error("[DirectLogin] Token inválido ou não encontrado");
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Token Inválido</title>
              <style>
                body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1f3a; color: white; }
                .container { text-align: center; max-width: 400px; padding: 2rem; background: white; color: #1a1f3a; border-radius: 12px; }
                h1 { color: #ef4444; }
                a { color: #39ff14; text-decoration: none; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>❌ Token Inválido</h1>
                <p>O link de acesso fornecido é inválido ou expirou.</p>
                <p>Por favor, entre em contato com a coordenação para obter um novo link.</p>
                <p><a href="/login">← Voltar para Login</a></p>
              </div>
            </body>
          </html>
        `);
      }

      console.log("[DirectLogin] Token válido para email:", userEmail);

      // 2. Buscar usuário no banco CENTRALIZADO
      const connection = await mysql.createConnection(ENV.centralDatabaseUrl);
      const db = drizzle(connection);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail))
        .limit(1);

      await connection.end();

      if (!user) {
        console.error("[DirectLogin] Usuário não encontrado:", userEmail);
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Usuário Não Encontrado</title>
              <style>
                body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1f3a; color: white; }
                .container { text-align: center; max-width: 400px; padding: 2rem; background: white; color: #1a1f3a; border-radius: 12px; }
                h1 { color: #ef4444; }
                a { color: #39ff14; text-decoration: none; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>❌ Usuário Não Encontrado</h1>
                <p>Não foi possível encontrar um usuário com este link.</p>
                <p>Entre em contato com a coordenação.</p>
                <p><a href="/login">← Voltar para Login</a></p>
              </div>
            </body>
          </html>
        `);
      }

      console.log("[DirectLogin] Usuário encontrado:", user.name, "Role:", user.role);

      // 4. LIMPAR COMPLETAMENTE cookies antigos
      // Tentar deletar com todas as combinações possíveis
      res.clearCookie(COOKIE_NAME, { path: "/" });
      res.clearCookie(COOKIE_NAME, { path: "/", domain: undefined });
      res.clearCookie(COOKIE_NAME);

      console.log("[DirectLogin] Cookies antigos limpos");

      // 5. Criar nova sessão JWT
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "Student",
      });

      console.log("[DirectLogin] Nova sessão criada para:", user.name);

      // 6. Definir novo cookie de sessão
      res.cookie(COOKIE_NAME, sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
        path: "/",
      });

      console.log("[DirectLogin] Novo cookie definido");

      // 7. Determinar página de redirecionamento
      const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

      console.log("[DirectLogin] Redirecionando para:", redirectTo);

      // 8. Redirecionar com código 302 (redirect temporário)
      // Adicionar timestamp para forçar reload completo
      res.redirect(302, `${redirectTo}?_login=${Date.now()}`);

    } catch (error) {
      console.error("[DirectLogin] Erro durante login:", error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Erro no Login</title>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #1a1f3a; color: white; }
              .container { text-align: center; max-width: 400px; padding: 2rem; background: white; color: #1a1f3a; border-radius: 12px; }
              h1 { color: #ef4444; }
              a { color: #39ff14; text-decoration: none; font-weight: bold; }
              pre { text-align: left; background: #f3f4f6; padding: 1rem; border-radius: 4px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Erro no Login</h1>
              <p>Ocorreu um erro ao processar seu login.</p>
              <pre>${error instanceof Error ? error.message : String(error)}</pre>
              <p>Tente novamente ou entre em contato com o suporte.</p>
              <p><a href="/login">← Voltar para Login</a></p>
            </div>
          </body>
        </html>
      `);
    }
  });

  console.log("[DirectLogin] Rota registrada: GET /api/direct-login/:token");
}
