import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.CENTRAL_DATABASE_URL || process.env.DATABASE_URL;

async function main() {
  const conn = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  // Count total users
  const [totalRows] = await conn.execute('SELECT COUNT(*) as total FROM users');
  console.log(`\n=== Total de usuários no banco central: ${totalRows[0].total} ===\n`);

  // Count users with password
  const [withPwd] = await conn.execute('SELECT COUNT(*) as total FROM users WHERE password_hash IS NOT NULL AND password_hash != ""');
  console.log(`Usuários COM senha: ${withPwd[0].total}`);

  // Count users without password
  const [withoutPwd] = await conn.execute('SELECT COUNT(*) as total FROM users WHERE password_hash IS NULL OR password_hash = ""');
  console.log(`Usuários SEM senha: ${withoutPwd[0].total}`);

  // List all users with their details
  const [users] = await conn.execute(`
    SELECT id, name, email, role, 
           CASE WHEN password_hash IS NOT NULL AND password_hash != '' THEN 'SIM' ELSE 'NÃO' END as tem_senha
    FROM users 
    ORDER BY name ASC
  `);

  console.log(`\n=== Lista de todos os ${users.length} usuários ===\n`);
  console.log('ID | Nome | Email | Role | Tem Senha');
  console.log('---|------|-------|------|----------');
  
  for (const u of users) {
    console.log(`${u.id} | ${u.name || 'N/A'} | ${u.email || 'N/A'} | ${u.role} | ${u.tem_senha}`);
  }

  await conn.end();
}

main().catch(console.error);
