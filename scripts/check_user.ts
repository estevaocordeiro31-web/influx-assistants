import { getDb } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('DB not available');
    return;
  }
  
  const users = await db.execute(
    sql`SELECT id, name, email, role, student_id FROM users WHERE email = 'direcaojundiairetiro@influx.com.br' OR name LIKE '%Estevao%'`
  );
  
  console.log('Users found:');
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error);
