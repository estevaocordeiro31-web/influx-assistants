import { db } from "../server/db.ts";
import { users, studentProfiles } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

/**
 * Script para atualizar perfil de Camila com dados reais do Sponte
 */

async function updateCamilaProfile() {
  console.log("🔄 Atualizando perfil de Camila...\n");

  try {
    // Dados de Camila do Sponte
    const camilaData = {
      name: "Camila Gonsalves da Rosa de Carvalho",
      email: "camiladarosa@outlook.com",
      matricula: "6220",
      cpf: "104.113.229-82",
      phone: "41 8468-9753",
      city: "Jundiai",
      neighborhood: "Cidade Nova",
      address: "Avenida Doutor Gilberto Luiz Pereira da Silva, 16",
      birthDate: "29/05/2001",
      
      // Perfil personalizado
      objective: "travel", // Gosta de viajar
      specificGoals: "Entender séries e filmes sem legendas, conversar com pessoas em viagens, fazer amizades internacionais",
      discomfortAreas: "Listening, pronúncia de palavras complexas, conversação espontânea",
      comfortAreas: "Leitura, escrita, compreensão de textos escritos",
      englishConsumptionSources: ["séries", "filmes", "podcasts", "livros"],
      improvementAreas: "Conversação natural, pronúncia, listening compreensivo",
      
      // Histórico acadêmico
      studyDurationYears: 2.5,
      studyDurationMonths: 6,
      booksCompleted: ["Book 2", "Book 3"],
      currentBook: "Book 4",
      semester: 2,
    };

    // 1. Buscar usuário de Camila (ID 390198)
    console.log("1️⃣ Buscando usuário de Camila (ID: 390198)...");
    const camilaUser = await db
      .select()
      .from(users)
      .where(eq(users.id, 390198))
      .limit(1);

    if (!camilaUser || camilaUser.length === 0) {
      console.error("❌ Usuário de Camila não encontrado!");
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${camilaUser[0].name}`);

    // 2. Atualizar perfil de Camila
    console.log("\n2️⃣ Atualizando perfil de Camila...");
    
    const updatedProfile = await db
      .update(studentProfiles)
      .set({
        objective: camilaData.objective,
        specificGoals: camilaData.specificGoals,
        discomfortAreas: camilaData.discomfortAreas,
        comfortAreas: camilaData.comfortAreas,
        englishConsumptionSources: camilaData.englishConsumptionSources,
        improvementAreas: camilaData.improvementAreas,
        studyDurationYears: camilaData.studyDurationYears,
        studyDurationMonths: camilaData.studyDurationMonths,
      })
      .where(eq(studentProfiles.userId, 390198));

    console.log("✅ Perfil atualizado com sucesso!");

    // 3. Exibir resumo
    console.log("\n📋 Resumo do Perfil de Camila:");
    console.log("================================");
    console.log(`Nome: ${camilaData.name}`);
    console.log(`Email: ${camilaData.email}`);
    console.log(`Matrícula: ${camilaData.matricula}`);
    console.log(`Telefone: ${camilaData.phone}`);
    console.log(`Cidade: ${camilaData.city}`);
    console.log(`\n📚 Histórico Acadêmico:`);
    console.log(`   - Livros Completados: ${camilaData.booksCompleted.join(", ")}`);
    console.log(`   - Livro Atual: ${camilaData.currentBook}`);
    console.log(`   - Semestre: ${camilaData.semester}º`);
    console.log(`   - Tempo de Estudo: ${camilaData.studyDurationYears} anos e ${camilaData.studyDurationMonths} meses`);
    console.log(`\n🎯 Objetivo: ${camilaData.objective === 'travel' ? 'Viajar' : camilaData.objective}`);
    console.log(`\n💭 Metas Específicas:`);
    console.log(`   ${camilaData.specificGoals}`);
    console.log(`\n😰 Áreas de Desconforto:`);
    console.log(`   ${camilaData.discomfortAreas}`);
    console.log(`\n😊 Áreas de Conforto:`);
    console.log(`   ${camilaData.comfortAreas}`);
    console.log(`\n📺 Fontes de Consumo de Inglês:`);
    camilaData.englishConsumptionSources.forEach(source => {
      console.log(`   - ${source}`);
    });
    console.log(`\n🚀 Áreas de Melhoria:`);
    console.log(`   ${camilaData.improvementAreas}`);

    console.log("\n✨ Perfil de Camila atualizado com sucesso!");
    console.log("Ela agora terá recomendações personalizadas baseadas em seus interesses!");

  } catch (error) {
    console.error("❌ Erro ao atualizar perfil de Camila:", error);
    process.exit(1);
  }
}

updateCamilaProfile();
