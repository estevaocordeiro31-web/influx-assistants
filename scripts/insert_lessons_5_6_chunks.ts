import { drizzle } from 'drizzle-orm/mysql2';
import { lessonChunks, lessons } from '../drizzle/schema';

const db = drizzle(process.env.DATABASE_URL!);

// Lesson 6 Chunks (Color Idioms) - only the remaining ones
const lesson6Chunks = [
  { expression: "black eye", portugueseEquivalent: "olho roxo", chunkType: "idiom" as const },
  { expression: "in black and white", portugueseEquivalent: "por escrito, preto no branco", chunkType: "idiom" as const },
  { expression: "in the red", portugueseEquivalent: "no vermelho (devendo)", chunkType: "idiom" as const },
  { expression: "white lie", portugueseEquivalent: "mentira branca/piedosa", chunkType: "idiom" as const },
  { expression: "gray area", portugueseEquivalent: "área cinzenta, zona indefinida", chunkType: "idiom" as const },
  { expression: "red carpet", portugueseEquivalent: "tapete vermelho", chunkType: "idiom" as const },
  { expression: "in the black", portugueseEquivalent: "no azul (com saldo positivo)", chunkType: "idiom" as const },
  { expression: "red with anger", portugueseEquivalent: "vermelho de raiva", chunkType: "idiom" as const },
  { expression: "white as a sheet", portugueseEquivalent: "branco como papel", chunkType: "idiom" as const },
  { expression: "a shade of", portugueseEquivalent: "um tom de (cor)", chunkType: "collocation" as const },
  { expression: "hue", portugueseEquivalent: "cor, tom, matiz", chunkType: "expression" as const },
  { expression: "a lone wolf", portugueseEquivalent: "uma pessoa que prefere ficar sozinha", chunkType: "idiom" as const },
];

async function main() {
  try {
    // Get all lessons
    const allLessons = await db.select().from(lessons);
    
    // Find lesson 6 for Unit 3 (Shapes and Colors)
    const lesson6 = allLessons.find(l => l.lessonNumber === 6 && l.title?.includes('Shapes'));
    
    console.log('Lesson 6:', lesson6);
    
    if (lesson6) {
      console.log(`\nInserting chunks for Lesson 6 (ID: ${lesson6.id})...`);
      for (const chunk of lesson6Chunks) {
        await db.insert(lessonChunks).values({
          lessonId: lesson6.id,
          ...chunk
        });
      }
      console.log(`Inserted ${lesson6Chunks.length} chunks for Lesson 6`);
    } else {
      console.log('Lesson 6 not found');
    }
    
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

main();
