/**
 * Script para inserir TODOS os exercícios do Book 1 no banco de dados
 * Unit 1 (Lessons 1-5) + Unit 2 (Lessons 6-10)
 * Uso: node server/run-seed-all-exercises.mjs
 */
import { book1Exercises } from './seed-book1-exercises.mjs';
import { book1Unit2Exercises } from './seed-book1-unit2-exercises.mjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.CENTRAL_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to database...');
  
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected!');

  // Ensure book 1 exists
  const [books] = await connection.execute('SELECT id FROM books WHERE id = 1');
  if (books.length === 0) {
    console.log('Book 1 not found, creating...');
    await connection.execute(
      'INSERT INTO books (id, name, level, total_lessons) VALUES (?, ?, ?, ?)',
      [1, 'Book 1', 'beginner', 10]
    );
    console.log('Book 1 created!');
  }

  // Ensure extra_exercises table exists
  try {
    await connection.execute('SELECT 1 FROM extra_exercises LIMIT 1');
  } catch (e) {
    console.log('Table extra_exercises does not exist. Creating...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS extra_exercises (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        lesson_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking', 'communicative') NOT NULL,
        content LONGTEXT NOT NULL,
        image_url VARCHAR(512),
        difficulty ENUM('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient') NOT NULL DEFAULT 'beginner',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Table created!');
  }

  // Combine all exercises
  const allExercises = [...book1Exercises, ...book1Unit2Exercises];
  
  // Clear existing exercises for book 1
  await connection.execute('DELETE FROM extra_exercises WHERE book_id = ?', [1]);
  console.log('Cleared existing exercises for Book 1');

  // Insert all exercises
  let inserted = 0;
  for (const exercise of allExercises) {
    await connection.execute(
      `INSERT INTO extra_exercises (book_id, lesson_number, title, description, type, content, difficulty) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        exercise.bookId,
        exercise.lessonNumber,
        exercise.title,
        exercise.description,
        exercise.type,
        exercise.content,
        exercise.difficulty
      ]
    );
    inserted++;
    if (inserted % 5 === 0 || inserted === allExercises.length) {
      console.log(`  [${inserted}/${allExercises.length}] Inserted...`);
    }
  }

  console.log(`\nDone! ${inserted} exercises inserted for Book 1.`);
  
  // Show summary
  const [summary] = await connection.execute(
    'SELECT lesson_number, COUNT(*) as count FROM extra_exercises WHERE book_id = ? GROUP BY lesson_number ORDER BY lesson_number',
    [1]
  );
  
  console.log('\nSummary:');
  for (const row of summary) {
    console.log(`  Lesson ${row.lesson_number}: ${row.count} exercises`);
  }

  await connection.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
