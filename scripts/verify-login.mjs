import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const students = [
  { email: 'leonardocantone25@gmail.com', password: 'LryzqLsIRw0q' },
  { email: 'gabicantone@gmail.com', password: 'PGVl#YiMQIA$' },
  { email: 'joloemanuel1@gmail.com', password: 'CcU5eFLreuJd' },
];

async function main() {
  const conn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL);
  
  console.log('🔐 Verificando login dos alunos no banco central...\n');
  
  for (const student of students) {
    const [rows] = await conn.query(
      'SELECT id, openId, name, email, password_hash, role FROM users WHERE email = ?',
      [student.email]
    );
    
    if (rows.length === 0) {
      console.log(`❌ ${student.email} - NÃO ENCONTRADO`);
      continue;
    }
    
    const user = rows[0];
    const hasPassword = !!user.password_hash;
    
    if (!hasPassword) {
      console.log(`❌ ${user.name} (${user.email}) - SEM SENHA`);
      continue;
    }
    
    // Testar senha
    const isValid = await bcrypt.compare(student.password, user.password_hash);
    console.log(`${isValid ? '✅' : '❌'} ${user.name} (${user.email}) - Role: ${user.role} - Login: ${isValid ? 'OK' : 'FALHOU'}`);
  }
  
  await conn.end();
}

main().catch(console.error);
