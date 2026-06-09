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
let localDb: MySql2Database;
let centralDb: MySql2Database;

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
