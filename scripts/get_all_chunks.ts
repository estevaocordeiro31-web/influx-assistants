import { drizzle } from 'drizzle-orm/mysql2';
import { lessonChunks, lessons, lessonVocabulary } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  try {
    // Get lessons 1-6
    const allLessons = await db.select().from(lessons).where(
      inArray(lessons.lessonNumber, [1, 2, 3, 4, 5, 6])
    );
    
    const uniqueLessons = allLessons.filter((l, i, arr) => 
      arr.findIndex(x => x.lessonNumber === l.lessonNumber && x.unitId === l.unitId) === i
    ).sort((a, b) => a.lessonNumber - b.lessonNumber);
    
    console.log('=== CHUNKS POR LESSON ===\n');
    
    for (const lesson of uniqueLessons) {
      const chunks = await db.select().from(lessonChunks).where(eq(lessonChunks.lessonId, lesson.id));
      const vocab = await db.select().from(lessonVocabulary).where(eq(lessonVocabulary.lessonId, lesson.id));
      
      console.log(`\n### LESSON ${lesson.lessonNumber}: ${lesson.title}`);
      console.log(`ID: ${lesson.id} | Unit: ${lesson.unitId}`);
      console.log(`Vocabulário: ${vocab.length} | Chunks: ${chunks.length}`);
      
      if (chunks.length > 0) {
        console.log('\nChunks:');
        chunks.forEach((c, i) => {
          console.log(`  ${i+1}. "${c.expression}" = ${c.portugueseEquivalent} [${c.chunkType}]`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

main();
