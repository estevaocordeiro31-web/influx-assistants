/**
 * Script para inspecionar o schema das tabelas principais do banco centralizado
 */

import mysql from "mysql2/promise";

const centralDbUrl = process.env.CENTRAL_DATABASE_URL;

async function inspectSchema() {
  const connection = await mysql.createConnection(centralDbUrl);

  const tablesToInspect = [
    "users",
    "students",
    "student_intelligence",
    "tutor_blog_tips",
    "tutor_interactions",
    "pedagogical_reports",
    "conversation_metrics",
  ];

  console.log("🔍 Inspecionando schema do banco centralizado...\n");

  for (const table of tablesToInspect) {
    console.log(`\n📋 Tabela: ${table}`);
    console.log("=".repeat(60));

    try {
      const [columns] = await connection.query(`DESCRIBE ${table}`);
      console.table(columns);
    } catch (error) {
      console.error(`❌ Erro ao inspecionar ${table}:`, error.message);
    }
  }

  await connection.end();
  console.log("\n✅ Inspeção concluída!");
}

inspectSchema().catch(console.error);
