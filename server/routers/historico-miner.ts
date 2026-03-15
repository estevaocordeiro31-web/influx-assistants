import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { miningProgress, miningSession } from "../../drizzle/schema";
import { eq, gte, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";

const ZAPI_INSTANCE_ID = "3ED2E8C4FC5EE20AA41A2287A6CE346F";
const ZAPI_TOKEN = "CB492DBCF177CD6EECF95A7A";
const ZAPI_BASE_URL = "https://api.z-api.io/instances";
const RETIRO_NUMBER = "5511957667482";

const DELAY_ENTRE_CHATS = 500;
const DELAY_ENTRE_PAGINAS = 300;
const LOTE_PROCESSAMENTO_IA = 10;

const MINING_PROMPT = `Você é um analista de CRM da inFlux, escola de inglês em Jundiaí.

Analise essa conversa do WhatsApp e extraia as informações em JSON:

{
  "nome": "nome da pessoa (ou null se não identificado)",
  "interesse": "qual curso/produto demonstrou interesse (ou null)",
  "status": "interessado | ex_aluno | aluno_ativo | sem_interesse | indeterminado",
  "temperatura": 1-10 (1=frio, 10=pronto para matricular),
  "urgencia": "alta | media | baixa | nenhuma",
  "objecoes": ["lista de objeções mencionadas"],
  "melhor_abordagem": "como abordar essa pessoa agora em 1 frase",
  "ultimo_contato": "data aproximada da última mensagem",
  "resumo": "resumo da conversa em 2 linhas"
}

Conversa:
{conversa}`;

interface MiningAnalysis {
  nome: string | null;
  interesse: string | null;
  status: string;
  temperatura: number;
  urgencia: string;
  objecoes: string[];
  melhor_abordagem: string;
  ultimo_contato: string;
  resumo: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function zapiRequest(endpoint: string) {
  const url = `${ZAPI_BASE_URL}/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Z-API error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function listAllChats(): Promise<Array<{ phone: string; name?: string; isGroup: boolean }>> {
  try {
    const data = await zapiRequest("chats");
    if (!Array.isArray(data)) return [];
    return data
      .filter((chat: any) => !chat.isGroup && chat.phone && !chat.phone.includes("@g.us"))
      .map((chat: any) => ({
        phone: chat.phone?.replace(/\D/g, "") || "",
        name: chat.name || chat.pushName || null,
        isGroup: false,
      }))
      .filter((c: any) => c.phone && c.phone !== RETIRO_NUMBER);
  } catch (e) {
    console.error("[Miner] listAllChats error:", e);
    return [];
  }
}

async function getConversationMessages(phone: string, maxPages = 3): Promise<string> {
  const allMessages: string[] = [];
  try {
    for (let page = 1; page <= maxPages; page++) {
      const data = await zapiRequest(`chat-messages?phone=${phone}&page=${page}&pageSize=50`);
      await sleep(DELAY_ENTRE_PAGINAS);
      if (!data || !Array.isArray(data)) break;
      const msgs = data.map((m: any) => {
        const role = m.fromMe ? "Escola" : "Contato";
        const text = m.text?.message || m.caption || "[mídia]";
        return `${role}: ${text}`;
      });
      allMessages.push(...msgs);
      if (data.length < 50) break;
    }
  } catch (e) {
    // silently fail per chat
  }
  return allMessages.slice(-100).join("\n"); // últimas 100 mensagens
}

async function analyzeConversation(messages: string): Promise<MiningAnalysis | null> {
  if (!messages || messages.trim().length < 20) return null;
  try {
    const prompt = MINING_PROMPT.replace("{conversa}", messages.substring(0, 4000));
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Você é um analista de CRM. Responda APENAS com JSON válido." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "mining_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              nome: { type: ["string", "null"] },
              interesse: { type: ["string", "null"] },
              status: { type: "string" },
              temperatura: { type: "number" },
              urgencia: { type: "string" },
              objecoes: { type: "array", items: { type: "string" } },
              melhor_abordagem: { type: "string" },
              ultimo_contato: { type: "string" },
              resumo: { type: "string" },
            },
            required: ["nome", "interesse", "status", "temperatura", "urgencia", "objecoes", "melhor_abordagem", "ultimo_contato", "resumo"],
            additionalProperties: false,
          },
        },
      } as any,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
  } catch (e) {
    return null;
  }
}

// Estado global do job (in-memory para esta instância)
let miningJobRunning = false;
let miningJobPaused = false;

async function runMiningJob() {
  const db = await getDb();
  if (!db) return;

  miningJobRunning = true;
  miningJobPaused = false;

  try {
    // Inicializar/atualizar sessão
    const sessions = await db.select().from(miningSession).limit(1);
    if (sessions.length === 0) {
      await db.insert(miningSession).values({
        status: "running",
        startedAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      await db.update(miningSession).set({ status: "running", startedAt: new Date() });
    }

    // Buscar todos os chats
    const chats = await listAllChats();
    await db.update(miningSession).set({ totalChats: chats.length });

    let processados = 0;
    let novosContatos = 0;
    let contatosAtualizados = 0;
    let followsCriados = 0;
    let leadsQuentes = 0;

    for (let i = 0; i < chats.length; i++) {
      if (miningJobPaused) {
        await db.update(miningSession).set({ status: "paused", lastPhone: chats[i].phone });
        break;
      }

      const chat = chats[i];
      if (!chat.phone) continue;

      // Verificar se já foi processado
      const existing = await db.select().from(miningProgress)
        .where(eq(miningProgress.phone, chat.phone)).limit(1);
      if (existing.length > 0 && existing[0].status === "done") continue;

      // Marcar como processando
      await db.insert(miningProgress).values({
        phone: chat.phone,
        status: "processing",
        createdAt: new Date(),
      }).onDuplicateKeyUpdate({ set: { status: "processing" } });

      // Buscar mensagens
      const messages = await getConversationMessages(chat.phone);
      await sleep(DELAY_ENTRE_CHATS);

      // Analisar com IA
      const analise = await analyzeConversation(messages);

      if (!analise || analise.status === "sem_interesse") {
        await db.update(miningProgress)
          .set({ status: "ignored", acao: "ignorado", processadoEm: new Date() })
          .where(eq(miningProgress.phone, chat.phone));
        processados++;
        continue;
      }

      // Salvar resultado
      await db.update(miningProgress).set({
        status: "done",
        analiseJson: analise as any,
        nome: analise.nome || null,
        interesse: analise.interesse || null,
        leadStatus: analise.status,
        temperatura: Math.round(analise.temperatura),
        urgencia: analise.urgencia,
        melhorAbordagem: analise.melhor_abordagem,
        resumo: analise.resumo,
        acao: "contact_criado",
        processadoEm: new Date(),
      }).where(eq(miningProgress.phone, chat.phone));

      if (analise.temperatura >= 7) leadsQuentes++;
      novosContatos++;
      processados++;

      // Atualizar contadores na sessão a cada 10
      if (processados % 10 === 0) {
        await db.update(miningSession).set({
          processados,
          novosContatos,
          contatosAtualizados,
          followsCriados,
          leadsQuentes,
          lastPhone: chat.phone,
        });
      }
    }

    // Finalizar sessão
    await db.update(miningSession).set({
      status: "completed",
      processados,
      novosContatos,
      contatosAtualizados,
      followsCriados,
      leadsQuentes,
      completedAt: new Date(),
    });

  } catch (e) {
    console.error("[Miner] Job error:", e);
    const db2 = await getDb();
    if (db2) await db2.update(miningSession).set({ status: "error" });
  } finally {
    miningJobRunning = false;
  }
}

export const historicoMinerRouter = router({
  // Iniciar mineração
  startMining: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (miningJobRunning) {
      return { success: false, message: "Mineração já está em andamento" };
    }
    // Rodar em background
    runMiningJob().catch(console.error);
    return { success: true, message: "Mineração iniciada!" };
  }),

  // Pausar mineração
  pauseMining: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    miningJobPaused = true;
    return { success: true, message: "Mineração será pausada após o chat atual" };
  }),

  // Obter progresso atual
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const sessions = await db.select().from(miningSession).limit(1);
    const session = sessions[0] ?? {
      status: "idle",
      totalChats: 0,
      processados: 0,
      novosContatos: 0,
      contatosAtualizados: 0,
      followsCriados: 0,
      leadsQuentes: 0,
    };

    return {
      ...session,
      isRunning: miningJobRunning,
      isPaused: miningJobPaused,
      percentual: session.totalChats > 0
        ? Math.round((session.processados / session.totalChats) * 100)
        : 0,
    };
  }),

  // Obter leads quentes (temperatura >= 7)
  getHotLeads: protectedProcedure
    .input(z.object({ minTemp: z.number().default(7) }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const minTemp = input?.minTemp ?? 7;
      return db.select()
        .from(miningProgress)
        .where(gte(miningProgress.temperatura, minTemp))
        .orderBy(desc(miningProgress.temperatura))
        .limit(100);
    }),

  // Resetar progresso (para reiniciar do zero)
  resetMining: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (miningJobRunning) {
      return { success: false, message: "Pause a mineração antes de resetar" };
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    await db.delete(miningProgress);
    await db.delete(miningSession);
    return { success: true, message: "Progresso resetado" };
  }),
});
