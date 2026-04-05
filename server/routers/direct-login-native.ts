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