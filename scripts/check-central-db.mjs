import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('CENTRAL_DATABASE_URL exists:', !!process.env.CENTRAL_DATABASE_URL);
  console.log('Same DB:', process.env.DATABASE_URL === process.env.CENTRAL_DATABASE_URL);
  
  const centralUrl = process.env.CENTRAL_DATABASE_URL;
  if (centralUrl) {
    try {
      const conn = await mysql.createConnection(centralUrl);
      const [rows] = await conn.query(
        'SELECT id, openId, name, email, password_hash FROM users WHERE email IN (?, ?, ?)',
        ['leonardocantone25@gmail.com', 'gabicantone@gmail.com', 'joloemanuel1@gmail.com']
      );
      console.log('\nAlunos no banco central:');
      rows.forEach(r => console.log(r.name, '-', r.email, '- Has password:', !!r.password_hash));
      
      if (rows.length === 0) {
        console.log('Nenhum aluno encontrado no banco central!');
        console.log('Os alunos precisam ser criados no banco central também.');
      }
      
      await conn.end();
    } catch (err) {
      console.log('Erro ao conectar ao banco central:', err.message);
    }
  } else {
    console.log('CENTRAL_DATABASE_URL não configurado');
  }
}

main().catch(console.error);
