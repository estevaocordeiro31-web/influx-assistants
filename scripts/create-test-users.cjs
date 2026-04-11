const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const hash = await bcrypt.hash('tutor2026', 10);

  await conn.execute(
    "INSERT INTO users (openId, name, email, passwordHash, role, status) VALUES ('test-student-001', 'Aluno Teste', 'aluno@teste.com', ?, 'user', 'ativo') ON DUPLICATE KEY UPDATE passwordHash = ?",
    [hash, hash]
  );

  await conn.execute(
    "INSERT INTO users (openId, name, email, passwordHash, role, status) VALUES ('test-admin-001', 'Admin Teste', 'admin@teste.com', ?, 'admin', 'ativo') ON DUPLICATE KEY UPDATE passwordHash = ?",
    [hash, hash]
  );

  console.log('Contas criadas!');
  console.log('Aluno: aluno@teste.com / tutor2026');
  console.log('Admin: admin@teste.com / tutor2026');
  await conn.end();
}

run().catch(e => console.error(e));
