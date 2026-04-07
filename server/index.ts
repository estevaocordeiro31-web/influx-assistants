import "dotenv/config";

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
});

import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerTestLoginRoutes } from "./routers/test-login";
import { registerDirectLoginRoutes } from "./routers/direct-login-native";
import { appRouter } from "../routers";
import { createContext } from "./_core/context";
import { serveStatic, setupVite } from "./_core/vite";
import { initializeJobs } from "./_core/init-jobs";
import { handleWebhook, webhookHealthCheck } from "./routers/webhook-handler";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust Nginx reverse proxy
  app.set('trust proxy', 1);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);
  registerTestLoginRoutes(app);
  registerDirectLoginRoutes(app);

  app.post("/api/webhooks/sync", handleWebhook);
  app.get("/api/webhooks/health", webhookHealthCheck);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[Tutor] Server running on http://localhost:${port}/`);
    initializeJobs();
  });
}

startServer().catch(console.error);
