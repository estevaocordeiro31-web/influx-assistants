/**
 * Run Seed: Insere exercícios do Book 2 no banco de dados
 */
import mysql from 'mysql2/promise';
import { book2Exercises } from './seed-book2-exercises.mjs';

async function seedBook2() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Verificar se já existem exercícios do Book 2
  const [existing] = await conn.query('SELECT COUNT(*) as count FROM extra_exercises WHERE book_id = 2');
  if (existing[0].count > 0) {
    console.log(`⚠️  Já existem ${existing[0].count} exercícios do Book 2. Removendo para reinserir...`);
    await conn.query('DELETE FROM extra_exercises WHERE book_id = 2');
  }
  
  let inserted = 0;
  for (const ex of book2Exercises) {
    await conn.query(
      'INSERT INTO extra_exercises (book_id, lesson_number, title, description, type, difficulty, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ex.bookId, ex.lessonNumber, ex.title, ex.description, ex.type, ex.difficulty, ex.content]
    );
    inserted++;
  }
  
  console.log(`✅ ${inserted} exercícios do Book 2 inseridos com sucesso!`);
  
  // Resumo por lição
  const [summary] = await conn.query(
    'SELECT lesson_number, COUNT(*) as count FROM extra_exercises WHERE book_id = 2 GROUP BY lesson_number ORDER BY lesson_number'
  );
  console.log('\n📊 Resumo por lição:');
  for (const row of summary) {
    console.log(`  Lesson ${row.lesson_number}: ${row.count} exercícios`);
  }
  
  // Total geral
  const [total] = await conn.query('SELECT COUNT(*) as count FROM extra_exercises');
  console.log(`\n📚 Total geral de exercícios (todos os books): ${total[0].count}`);
  
  conn.end();
}

seedBook2().catch(e => { console.error('❌ Erro:', e.message); process.exit(1); });
