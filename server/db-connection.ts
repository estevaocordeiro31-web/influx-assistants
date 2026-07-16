/**
 * Dual Database Connection Manager
 * 
 * Provides connections to both local (development) and central (production) databases.
 * Use local DB for testing and prototyping, central DB for real student data.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import type { MySql2Database } from "drizzle-orm/mysql2";

let localConnection: Pool;
let centralConnection: Pool;
let prodConnection: Pool;
let localDb: MySql2Database;
let centralDb: MySql2Database;
let prodDb: MySql2Database;

// Initialize connections lazily
let initialized = false;

export function buildConnectionConfig(url: string) {
  const cleanUrl = url.replace(/\?ssl=.*$/, '');
  const isTiDB = url.includes('tidbcloud.com');
  return {
    uri: cleanUrl,
    ...(isTiDB ? { ssl: { rejectUnauthorized: true } } : {}),
  };
}

// Pools instead of single connections: TiDB Cloud closes idle connections,
// so a long-lived single connection eventually throws "connection is in
// closed state". Pools transparently re-open connections.
const POOL_OPTS = { connectionLimit: 5, enableKeepAlive: true, keepAliveInitialDelay: 10000 } as const;

async function initializeConnections() {
  if (initialized) return;

  localConnection = mysql.createPool({
    ...buildConnectionConfig(process.env.DATABASE_URL!),
    ...POOL_OPTS,
  });
  localDb = drizzle(localConnection);

  centralConnection = mysql.createPool({
    ...buildConnectionConfig(process.env.CENTRAL_DATABASE_URL!),
    ...POOL_OPTS,
  });
  centralDb = drizzle(centralConnection);

  // Fix parcial seguro (2026-07-15): CENTRAL_DATABASE_URL aponta pra um
  // snapshot congelado desde 22/05 (achado real: 20% dos IDs já divergiram
  // da producao real ao comparar amostra). PROD_DATABASE_URL e' a conexao
  // NOVA, so' de leitura, pro mesmo banco real que o Brain usa — usada so'
  // pelas 2 telas de admin que exibem lista/detalhe de aluno
  // (admin-students.ts). Os caminhos de ESCRITA (elie-sync.ts, sync.ts,
  // db-central.ts) continuam em centralConnection de proposito — escrever
  // na producao real exige reconciliar antes os 232 vinculos users.student_id
  // por telefone/CPF (nao por ID), projeto separado, ainda nao feito. Ver
  // docs/plans/TUTOR_DEFASAGEM_2026-07-15.md no repo do Brain.
  if (process.env.PROD_DATABASE_URL) {
    prodConnection = mysql.createPool({
      ...buildConnectionConfig(process.env.PROD_DATABASE_URL),
      ...POOL_OPTS,
    });
    prodDb = drizzle(prodConnection);
  }

  initialized = true;
}

/**
 * Get database connection based on environment or explicit choice
 * @param useCentral - Force use of central database (default: true for production)
 */
export async function getDb(useCentral: boolean = process.env.NODE_ENV === "production") {
  await initializeConnections();
  return useCentral ? centralDb : localDb;
}

/**
 * Get raw MySQL connection for direct queries
 * @param useCentral - Force use of central database
 */
export async function getConnection(useCentral: boolean = process.env.NODE_ENV === "production") {
  await initializeConnections();
  return useCentral ? centralConnection : localConnection;
}

/**
 * Get local database (for development/testing)
 */
export async function getLocalDb() {
  await initializeConnections();
  return localDb;
}

/**
 * Get central database (for production)
 */
export async function getCentralDb() {
  await initializeConnections();
  return centralDb;
}

/**
 * Get PROD (real production) database — read-only por convenção de uso.
 * So' pra telas que exibem dado real de aluno (admin-students.ts). NAO usar
 * pra escrever progresso/inteligencia da Elie ate a reconciliacao dos
 * vinculos users.student_id acontecer — ver
 * docs/plans/TUTOR_DEFASAGEM_2026-07-15.md no repo do Brain.
 */
export async function getProdDb() {
  await initializeConnections();
  if (!prodDb) throw new Error('PROD_DATABASE_URL não configurada');
  return prodDb;
}
