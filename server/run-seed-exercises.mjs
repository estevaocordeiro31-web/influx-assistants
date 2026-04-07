/**
 * Script para inserir exercícios do Book 1 no banco de dados
 * Uso: node server/run-seed-exercises.mjs
 */
import { book1Exercises } from './seed-book1-exercises.mjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.CENTRAL_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to database...');
  
  // Parse connection string
  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected! Inserting exercises...');

  // First check if books table has book 1
  const [books] = await connection.execute('SELECT id FROM books WHERE id = 1');
  
  let bookId = 1;
  if (books.length === 0) {
    console.log('Book 1 not found, creating...');
    await connection.execute(
      'INSERT INTO books (id, name, level, total_lessons) VALUES (?, ?, ?, ?)',
      [1, 'Book 1 - At School', 'beginner', 10]
    );
    console.log('Book 1 created!');
  }

  // Check if extra_exercises table exists
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

  // Clear existing exercises for book 1
  await connection.execute('DELETE FROM extra_exercises WHERE book_id = ?', [bookId]);
  console.log('Cleared existing exercises for Book 1');

  // Insert exercises
  let inserted = 0;
  for (const exercise of book1Exercises) {
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
    console.log(`  [${inserted}/${book1Exercises.length}] Inserted: ${exercise.title}`);
  }

  console.log(`\nDone! ${inserted} exercises inserted for Book 1.`);
  
  // Show summary
  const [summary] = await connection.execute(
    'SELECT lesson_number, COUNT(*) as count FROM extra_exercises WHERE book_id = ? GROUP BY lesson_number ORDER BY lesson_number',
    [bookId]
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
