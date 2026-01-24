/**
 * Script para inspecionar schema detalhado das tabelas de alunos
 */

import mysql from "mysql2/promise";

const centralDbUrl = process.env.CENTRAL_DATABASE_URL;

async function inspectStudentTables() {
  const connection = await mysql.createConnection(centralDbUrl);

  console.log("🔍 Investigando tabelas de alunos do banco centralizado...\n");

  // 1. Tabela students
  console.log("\n" + "=".repeat(80));
  console.log("📋 Tabela: students");
  console.log("=".repeat(80));
  
  try {
    const [studentsColumns] = await connection.query("DESCRIBE students");
    console.table(studentsColumns);
    
    // Contar registros
    const [studentsCount] = await connection.query("SELECT COUNT(*) as total FROM students");
    console.log(`\n📊 Total de registros: ${studentsCount[0].total}`);
    
    // Mostrar exemplo de registro
    const [studentsSample] = await connection.query("SELECT * FROM students LIMIT 1");
    if (studentsSample.length > 0) {
      console.log("\n📝 Exemplo de registro:");
      console.log(JSON.stringify(studentsSample[0], null, 2));
    }
  } catch (error) {
    console.error(`❌ Erro ao inspecionar students:`, error.message);
  }

  // 2. Tabela student_intelligence
  console.log("\n" + "=".repeat(80));
  console.log("📋 Tabela: student_intelligence");
  console.log("=".repeat(80));
  
  try {
    const [intelligenceColumns] = await connection.query("DESCRIBE student_intelligence");
    console.table(intelligenceColumns);
    
    // Contar registros
    const [intelligenceCount] = await connection.query("SELECT COUNT(*) as total FROM student_intelligence");
    console.log(`\n📊 Total de registros: ${intelligenceCount[0].total}`);
    
    // Mostrar exemplo de registro
    const [intelligenceSample] = await connection.query("SELECT * FROM student_intelligence LIMIT 1");
    if (intelligenceSample.length > 0) {
      console.log("\n📝 Exemplo de registro:");
      console.log(JSON.stringify(intelligenceSample[0], null, 2));
    }
  } catch (error) {
    console.error(`❌ Erro ao inspecionar student_intelligence:`, error.message);
  }

  // 3. Tabela tutor_interactions
  console.log("\n" + "=".repeat(80));
  console.log("📋 Tabela: tutor_interactions");
  console.log("=".repeat(80));
  
  try {
    const [interactionsColumns] = await connection.query("DESCRIBE tutor_interactions");
    console.table(interactionsColumns);
    
    const [interactionsCount] = await connection.query("SELECT COUNT(*) as total FROM tutor_interactions");
    console.log(`\n📊 Total de registros: ${interactionsCount[0].total}`);
  } catch (error) {
    console.error(`❌ Erro ao inspecionar tutor_interactions:`, error.message);
  }

  // 4. Tabela tutor_blog_tips
  console.log("\n" + "=".repeat(80));
  console.log("📋 Tabela: tutor_blog_tips");
  console.log("=".repeat(80));
  
  try {
    const [tipsColumns] = await connection.query("DESCRIBE tutor_blog_tips");
    console.table(tipsColumns);
    
    const [tipsCount] = await connection.query("SELECT COUNT(*) as total FROM tutor_blog_tips");
    console.log(`\n📊 Total de registros: ${tipsCount[0].total}`);
  } catch (error) {
    console.error(`❌ Erro ao inspecionar tutor_blog_tips:`, error.message);
  }

  await connection.end();
  console.log("\n✅ Inspeção concluída!");
}

inspectStudentTables().catch(console.error);
