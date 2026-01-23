import { drizzle } from 'drizzle-orm/mysql2';
import { users, studentProfiles } from '../drizzle/schema.js';
import mysql from 'mysql2/promise';

async function addTestStudents() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    const testStudents = [
      {
        name: 'João Silva',
        email: 'joao@example.com',
        objective: 'career',
        level: 'intermediate',
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        objective: 'travel',
        level: 'beginner',
      },
      {
        name: 'Pedro Costa',
        email: 'pedro@example.com',
        objective: 'studies',
        level: 'elementary',
      },
      {
        name: 'Fabio Hk',
        email: 'fabio_hk@hotmail.com',
        objective: 'career',
        level: 'upper_intermediate',
      },
    ];

    console.log('Adicionando alunos de teste...\n');

    for (const student of testStudents) {
      const openId = `student-${student.email}-${Date.now()}`;

      // Inserir usuário
      const result = await db.insert(users).values({
        openId,
        name: student.name,
        email: student.email,
        role: 'student',
        status: 'ativo',
        loginMethod: 'test',
      });

      const userId = result[0].insertId;

      // Inserir perfil do aluno
      await db.insert(studentProfiles).values({
        userId,
        objective: student.objective,
        currentLevel: student.level,
        totalHoursLearned: Math.floor(Math.random() * 100),
        streakDays: Math.floor(Math.random() * 30),
      });

      console.log(`✅ ${student.name} (${student.email}) adicionado com sucesso`);
    }

    console.log('\n✅ Todos os alunos de teste foram adicionados!');
  } catch (error) {
    console.error('❌ Erro ao adicionar alunos:', error.message);
  } finally {
    await connection.end();
  }
}

addTestStudents();
