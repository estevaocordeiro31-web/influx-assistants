import { drizzle } from 'drizzle-orm/mysql2';
import { lessonChunks, lessons, lessonVocabulary, lessonExamples } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

// Get lesson IDs for lessons 5 and 6 in Unit 3 (Shapes and Colors)
async function getLessonIds() {
  const allLessons = await db.select().from(lessons).where(
    eq(lessons.lessonNumber, 5)
  );
  console.log('Lessons with number 5:', allLessons);
  
  const allLessons6 = await db.select().from(lessons).where(
    eq(lessons.lessonNumber, 6)
  );
  console.log('Lessons with number 6:', allLessons6);
  
  return { lesson5: allLessons, lesson6: allLessons6 };
}

async function main() {
  try {
    const { lesson5, lesson6 } = await getLessonIds();
    
    // Find the correct lesson 5 (Unit 3 - Shapes and Colors)
    const lesson5Unit3 = lesson5.find(l => l.title?.includes('Shapes') || l.unitId === 3);
    const lesson6Unit3 = lesson6.find(l => l.title?.includes('Shapes') || l.unitId === 3);
    
    console.log('Lesson 5 Unit 3:', lesson5Unit3);
    console.log('Lesson 6 Unit 3:', lesson6Unit3);
    
    if (!lesson5Unit3) {
      console.log('Creating Lesson 5 for Unit 3...');
      // We need to insert it
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

main();
