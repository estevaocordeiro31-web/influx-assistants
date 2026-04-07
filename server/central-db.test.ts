/**
 * Teste de conexão com o banco de dados centralizado
 */

import { describe, it, expect } from "vitest";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

describe("Central Database Connection", () => {
  it("should connect to central database successfully", async () => {
    const centralDbUrl = process.env.CENTRAL_DATABASE_URL;
    
    expect(centralDbUrl).toBeDefined();
    expect(centralDbUrl).toContain("tidbcloud.com");

    // Tentar conectar
    const connection = await mysql.createConnection(centralDbUrl!);
    const db = drizzle(connection);

    // Executar query simples para validar conexão
    const result = await connection.query("SELECT 1 as test");
    
    expect(result).toBeDefined();
    expect(Array.isArray(result[0])).toBe(true);

    await connection.end();
  }, 10000); // 10s timeout

  it("should list tables in central database", async () => {
    const centralDbUrl = process.env.CENTRAL_DATABASE_URL;
    const connection = await mysql.createConnection(centralDbUrl!);

    // Listar tabelas disponíveis
    const [tables] = await connection.query("SHOW TABLES");
    
    console.log("📊 Tabelas disponíveis no banco centralizado:", tables);
    
    expect(Array.isArray(tables)).toBe(true);

    await connection.end();
  }, 10000);
});
