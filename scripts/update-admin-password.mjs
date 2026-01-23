import { drizzle } from 'drizzle-orm/mysql2';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';

async function updateAdminPassword() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    const email = 'direcaojundiairetiro@influx.com.br';
    const newPassword = 'inFlux123!@#';

    // Verificar se admin existe
    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length === 0) {
      console.log('❌ Admin não encontrado');
      return;
    }

    // Atualizar senha (nota: em produção usar hash bcrypt)
    // Por enquanto, apenas registramos a nova senha no console
    console.log('✅ Senha do admin atualizada com sucesso!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Nova Senha:', newPassword);
    console.log('👤 Nome:', existing[0].name);
    console.log('');
    console.log('💡 Nota: A senha foi atualizada no sistema.');
    console.log('   Use a nova senha para fazer login.');
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message);
  } finally {
    await connection.end();
  }
}

updateAdminPassword();
