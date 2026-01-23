import { getSponteStudent } from '../server/sponte.ts';

const STUDENTS = [
  { name: 'Laís Milena Gambini', matricula: '6200', book: 'Book 4' },
  { name: 'Camila Gonsalves da Rosa de Carvalho', matricula: '6220', book: 'Book 4' }
];

async function exportStudentData() {
  console.log('🔍 Iniciando exportação de dados das alunas...\n');

  const results = [];

  for (const student of STUDENTS) {
    try {
      console.log(`\n📚 Aluna: ${student.name}`);
      console.log(`📝 Matrícula: ${student.matricula}`);
      console.log(`📖 ${student.book}`);
      console.log('─'.repeat(60));

      // Buscar dados do Sponte
      const data = await getSponteStudent(student.matricula);

      if (data) {
        console.log('\n✅ Dados encontrados no Sponte:\n');

        // Informações pessoais
        console.log('👤 INFORMAÇÕES PESSOAIS:');
        console.log(`  Nome: ${data.name || 'N/A'}`);
        console.log(`  Email: ${data.email || 'N/A'}`);
        console.log(`  ID: ${data.id || 'N/A'}`);
        console.log(`  Status: ${data.status || 'N/A'}`);

        // Nível
        if (data.level) {
          console.log(`  Nível: ${data.level}`);
        }

        // Horas de aprendizado
        if (data.hoursLearned !== undefined) {
          console.log(`  Horas Aprendidas: ${data.hoursLearned}h`);
        }

        // Último acesso
        if (data.lastAccess) {
          const lastAccessDate = new Date(data.lastAccess);
          console.log(`  Último Acesso: ${lastAccessDate.toLocaleDateString('pt-BR')} ${lastAccessDate.toLocaleTimeString('pt-BR')}`);
        }

        results.push({
          name: student.name,
          matricula: student.matricula,
          book: student.book,
          data: data
        });

        console.log('\n' + '─'.repeat(60));
      } else {
        console.log('⚠️  Nenhum dado encontrado para esta aluna no Sponte');
      }
    } catch (error) {
      console.error(`❌ Erro ao buscar dados de ${student.name}:`, error.message);
    }
  }

  console.log('\n✅ Exportação concluída!');
  console.log(`\n📊 Total de alunas processadas: ${results.length}`);

  return results;
}

exportStudentData().catch(console.error);
