import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1).split('?')[0],
  ssl: { rejectUnauthorized: false }
};

async function seed() {
  const conn = await createConnection(config);
  
  try {
    const data = JSON.parse(readFileSync('/home/ubuntu/influx-assistants/content/book5/book5_seed.json', 'utf-8'));
    
    // Insert lessons
    console.log('Inserting lessons...');
    for (const lesson of data.lessons) {
      await conn.execute(
        'INSERT INTO lessons (book_id, unit_id, lesson_number, title, audio_count) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title)',
        [5, lesson.unit_id, lesson.number, lesson.title, lesson.audio_count]
      );
    }
    console.log(`  - Inserted ${data.lessons.length} lessons`);
    
    // Get lesson IDs
    const [rows] = await conn.execute('SELECT id, lesson_number FROM lessons WHERE book_id = 5');
    const lessonIds = {};
    for (const row of rows) {
      lessonIds[row.lesson_number] = row.id;
    }
    
    // Insert vocabulary
    console.log('Inserting vocabulary...');
    let vocabCount = 0;
    for (const vocab of data.vocabulary) {
      const lessonId = lessonIds[vocab.lesson_id];
      if (lessonId) {
        await conn.execute(
          'INSERT INTO lesson_vocabulary (lesson_id, word) VALUES (?, ?)',
          [lessonId, vocab.word]
        );
        vocabCount++;
      }
    }
    console.log(`  - Inserted ${vocabCount} vocabulary items`);
    
    // Insert chunks
    console.log('Inserting chunks...');
    let chunkCount = 0;
    for (const chunk of data.chunks) {
      const lessonId = lessonIds[chunk.lesson_id];
      if (lessonId) {
        await conn.execute(
          "INSERT INTO lesson_chunks (lesson_id, expression, chunk_type) VALUES (?, ?, 'expression')",
          [lessonId, chunk.expression]
        );
        chunkCount++;
      }
    }
    console.log(`  - Inserted ${chunkCount} chunks`);
    
    // Insert examples
    console.log('Inserting examples...');
    let exampleCount = 0;
    for (const example of data.examples) {
      const lessonId = lessonIds[example.lesson_id];
      if (lessonId) {
        await conn.execute(
          'INSERT INTO lesson_examples (lesson_id, sentence) VALUES (?, ?)',
          [lessonId, example.sentence]
        );
        exampleCount++;
      }
    }
    console.log(`  - Inserted ${exampleCount} examples`);
    
    console.log('\n✅ Book 5 data seeded successfully!');
    
  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  } finally {
    await conn.end();
  }
}

seed().catch(console.error);
