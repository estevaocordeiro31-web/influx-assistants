import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export function registerTestLoginRoutes(app: Express) {
  /**
   * Endpoint de teste para login com email/senha
   * APENAS PARA DESENVOLVIMENTO - não use em produção!
   */
  app.post("/api/test-login", async (req: Request, res: Response) => {
    // Verificar se está em modo desenvolvimento
    if (process.env.NODE_ENV === "production") {
      res.status(403).json({ error: "Test login not available in production" });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    try {
      // Credenciais de teste permitidas
      const testAccounts = [
        {
          email: "direcaojundiairetiro@influx.com.br",
          password: "inFlux123!@#",
        },
        {
          email: "fabio_hk@hotmail.com",
          password: "fabio123",
        },
      ];

      const account = testAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (!account) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Buscar ou criar usuário
      const database = await db.getDb();
      if (!database) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      // Gerar openId único
      const openId = `test-${email}-${Date.now()}`;

      // Upsert do usuário
      await db.upsertUser({
        openId,
        name: email.split("@")[0],
        email,
        loginMethod: "test",
        lastSignedIn: new Date(),
      });

      // Criar session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name: email.split("@")[0],
        expiresInMs: ONE_YEAR_MS,
      });

      // Definir cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({
        success: true,
        message: "Login successful",
        email,
      });
    } catch (error) {
      console.error("[Test Login] Failed", error);
      res.status(500).json({ error: "Test login failed" });
    }
  });

  /**
   * Endpoint para logout de teste
   */
  app.post("/api/test-logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie("manus-session", cookieOptions);
    res.json({ success: true, message: "Logout successful" });
  });
}
