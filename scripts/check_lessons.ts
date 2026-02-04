import { drizzle } from 'drizzle-orm/mysql2';
import { lessonChunks, lessons, lessonVocabulary, lessonExamples } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  try {
    // Get lessons 1-6
    const allLessons = await db.select().from(lessons).where(
      inArray(lessons.lessonNumber, [1, 2, 3, 4, 5, 6])
    );
    
    console.log('Lessons 1-6:');
    for (const lesson of allLessons.sort((a, b) => a.lessonNumber - b.lessonNumber)) {
      const vocabCount = await db.select().from(lessonVocabulary).where(eq(lessonVocabulary.lessonId, lesson.id));
      const chunksCount = await db.select().from(lessonChunks).where(eq(lessonChunks.lessonId, lesson.id));
      const examplesCount = await db.select().from(lessonExamples).where(eq(lessonExamples.lessonId, lesson.id));
      
      console.log(`\nLesson ${lesson.lessonNumber}: ${lesson.title} (ID: ${lesson.id}, Book: ${lesson.bookId}, Unit: ${lesson.unitId})`);
      console.log(`  - Vocabulary: ${vocabCount.length} items`);
      console.log(`  - Chunks: ${chunksCount.length} items`);
      console.log(`  - Examples: ${examplesCount.length} items`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

main();
