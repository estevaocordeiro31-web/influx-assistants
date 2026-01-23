import { drizzle } from 'drizzle-orm/mysql2';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';

async function createAdmin() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    const email = 'direcaojundiairetiro@influx.com.br';
    const name = 'Adm inFlux';
    const openId = `admin-${Date.now()}`;

    // Verificar se já existe
    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length > 0) {
      console.log('❌ Admin já existe com este email');
      return;
    }

    // Criar admin
    const result = await db.insert(users).values({
      openId,
      name,
      email,
      role: 'admin',
      status: 'ativo',
      loginMethod: 'oauth',
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Senha: inFlux123');
    console.log('👤 Nome:', name);
    console.log('');
    console.log('💡 Nota: Este admin foi criado no banco de dados.');
    console.log('   Para testar, faça login com o email acima.');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await connection.end();
  }
}

createAdmin();
