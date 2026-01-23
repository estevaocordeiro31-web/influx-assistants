import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";
import crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;

async function addStudents() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log("🎓 Adicionando alunas Laís e Camila...\n");

    // Adicionar Laís Milena Gambini
    const laisResult = await db.insert(schema.users).values({
      name: "Laís Milena Gambini",
      email: "lais.gambini@example.com",
      book: "Book 4",
      level: "Intermediário",
      objective: "Fluência em conversas de dia a dia",
      studyHours: 0,
      streak: 0,
      lastActivity: new Date(),
      status: "ativo",
      openId: `sponte-6200-${Date.now()}`,
    });

    const laisId = laisResult[0].insertId;
    console.log(`✅ Laís adicionada com ID: ${laisId}`);

    // Adicionar Camila Gonsalves da Rosa de Carvalho
    const camilaResult = await db.insert(schema.users).values({
      name: "Camila Gonsalves da Rosa de Carvalho",
      email: "camila.gonsalves@example.com",
      book: "Book 4",
      level: "Intermediário",
      objective: "Fluência em conversas de dia a dia",
      studyHours: 0,
      streak: 0,
      lastActivity: new Date(),
      status: "ativo",
      openId: `sponte-6220-${Date.now()}`,
    });

    const camilaId = camilaResult[0].insertId;
    console.log(`✅ Camila adicionada com ID: ${camilaId}\n`);

    // Criar perfis detalhados para Laís
    await db.insert(schema.studentProfiles).values({
      userId: laisId,
      studyDurationYears: 2,
      studyDurationMonths: 6,
      specificGoals: "Atingir fluência em conversas de dia a dia, entender filmes e séries sem legendas",
      discomfortAreas: "Listening, pronúncia de palavras complexas",
      comfortAreas: "Leitura, escrita, estruturas gramaticais",
      englishConsumptionSources: JSON.stringify(["músicas", "séries", "filmes", "redes sociais"]),
      improvementAreas: "Listening, conversação natural, compreensão de sotaques diferentes",
    });

    console.log("✅ Perfil detalhado de Laís criado");

    // Criar perfis detalhados para Camila
    await db.insert(schema.studentProfiles).values({
      userId: camilaId,
      studyDurationYears: 2,
      studyDurationMonths: 6,
      specificGoals: "Atingir fluência em conversas de dia a dia, entender filmes e séries sem legendas",
      discomfortAreas: "Listening, pronúncia de palavras complexas",
      comfortAreas: "Leitura, escrita, estruturas gramaticais",
      englishConsumptionSources: JSON.stringify(["músicas", "séries", "filmes", "redes sociais"]),
      improvementAreas: "Listening, conversação natural, compreensão de sotaques diferentes",
    });

    console.log("✅ Perfil detalhado de Camila criado\n");

    // Gerar links personalizados
    const generateLink = () => crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 30 * 24 * 60 * 60 * 1000); // 7 meses

    const laisLink = generateLink();
    const camilaLink = generateLink();

    await db.insert(schema.personalizedLinks).values({
      studentId: laisId,
      linkHash: laisLink,
      expiresAt,
      isActive: true,
      accessCount: 0,
    });

    console.log(`✅ Link de Laís gerado: ${laisLink}`);
    console.log(`   Válido até: ${expiresAt.toLocaleDateString("pt-BR")}\n`);

    await db.insert(schema.personalizedLinks).values({
      studentId: camilaId,
      linkHash: camilaLink,
      expiresAt,
      isActive: true,
      accessCount: 0,
    });

    console.log(`✅ Link de Camila gerado: ${camilaLink}`);
    console.log(`   Válido até: ${expiresAt.toLocaleDateString("pt-BR")}\n`);

    // Exibir resumo
    console.log("=" + "=".repeat(79));
    console.log("📊 RESUMO - ALUNAS ADICIONADAS");
    console.log("=" + "=".repeat(79));
    console.log("\n👩‍🎓 LAÍS MILENA GAMBINI");
    console.log(`   Matrícula: 6200`);
    console.log(`   Email: lais.gambini@example.com`);
    console.log(`   Livro: Book 4`);
    console.log(`   ID no Sistema: ${laisId}`);
    console.log(`   Link de Acesso: /access/${laisLink}`);
    console.log(`   Válido até: ${expiresAt.toLocaleDateString("pt-BR")}`);

    console.log("\n👩‍🎓 CAMILA GONSALVES DA ROSA DE CARVALHO");
    console.log(`   Matrícula: 6220`);
    console.log(`   Email: camila.gonsalves@example.com`);
    console.log(`   Livro: Book 4`);
    console.log(`   ID no Sistema: ${camilaId}`);
    console.log(`   Link de Acesso: /access/${camilaLink}`);
    console.log(`   Válido até: ${expiresAt.toLocaleDateString("pt-BR")}`);

    console.log("\n" + "=".repeat(80));
    console.log("✨ Alunas adicionadas com sucesso!");
    console.log("=".repeat(80) + "\n");

  } catch (error) {
    console.error("❌ Erro ao adicionar alunas:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

addStudents().catch(console.error);
