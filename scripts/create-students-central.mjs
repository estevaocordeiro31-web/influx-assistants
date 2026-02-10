import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const students = [
  {
    name: 'Leonardo Cantone',
    email: 'leonardocantone25@gmail.com',
    password: 'LryzqLsIRw0q',
    role: 'student',
  },
  {
    name: 'Gabriela Cantone',
    email: 'gabicantone@gmail.com',
    password: 'PGVl#YiMQIA$',
    role: 'student',
  },
  {
    name: 'Vitor Emanuel',
    email: 'joloemanuel1@gmail.com',
    password: 'CcU5eFLreuJd',
    role: 'student',
  },
];

async function main() {
  const centralUrl = process.env.CENTRAL_DATABASE_URL;
  if (!centralUrl) {
    console.error('CENTRAL_DATABASE_URL não configurado!');
    process.exit(1);
  }

  const conn = await mysql.createConnection(centralUrl);
  
  // Verificar estrutura da tabela users no banco central
  const [cols] = await conn.query('SHOW COLUMNS FROM users');
  console.log('=== Colunas da tabela users (banco central) ===');
  cols.forEach(c => console.log(`  ${c.Field} - ${c.Type} ${c.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${c.Default || ''}`));
  console.log('');
  
  console.log('🔄 Cadastrando 3 alunos no banco central...\n');
  
  for (const student of students) {
    try {
      // Gerar hash da senha
      const passwordHash = await bcrypt.hash(student.password, 10);
      
      // Gerar openId único
      const openId = crypto.createHash('sha256')
        .update(`student_${student.email}_central_${Date.now()}_${Math.random()}`)
        .digest('hex')
        .substring(0, 40);
      
      // Verificar se já existe
      const [existing] = await conn.query(
        'SELECT id, name, email FROM users WHERE email = ?',
        [student.email]
      );
      
      if (existing.length > 0) {
        // Atualizar senha se já existe
        await conn.execute(
          'UPDATE users SET password_hash = ?, name = ? WHERE email = ?',
          [passwordHash, student.name, student.email]
        );
        console.log(`✅ Atualizado: ${student.name} (${student.email}) - ID: ${existing[0].id}`);
      } else {
        // Inserir novo
        const [result] = await conn.execute(
          `INSERT INTO users (openId, name, email, password_hash, role, createdAt, updatedAt, lastSignedIn)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [openId, student.name, student.email, passwordHash, student.role]
        );
        console.log(`✅ Criado: ${student.name} (${student.email}) - ID: ${result.insertId}`);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao cadastrar ${student.name}: ${error.message}`);
      
      // Se der erro de coluna, tentar sem role
      if (error.message.includes('Unknown column') || error.message.includes('role')) {
        try {
          const passwordHash = await bcrypt.hash(student.password, 10);
          const openId = crypto.createHash('sha256')
            .update(`student_${student.email}_central_${Date.now()}_${Math.random()}`)
            .digest('hex')
            .substring(0, 40);
          
          const [result] = await conn.execute(
            `INSERT INTO users (openId, name, email, password_hash, createdAt, updatedAt, lastSignedIn)
             VALUES (?, ?, ?, ?, NOW(), NOW(), NOW())`,
            [openId, student.name, student.email, passwordHash]
          );
          console.log(`✅ Criado (sem role): ${student.name} (${student.email}) - ID: ${result.insertId}`);
        } catch (err2) {
          console.error(`❌ Erro final: ${err2.message}`);
        }
      }
    }
  }
  
  // Verificar resultado
  const [created] = await conn.query(
    'SELECT id, openId, name, email FROM users WHERE email IN (?, ?, ?)',
    ['leonardocantone25@gmail.com', 'gabicantone@gmail.com', 'joloemanuel1@gmail.com']
  );
  
  console.log('\n📊 Alunos no banco central:');
  console.log('─'.repeat(80));
  created.forEach(r => {
    console.log(`  ID: ${r.id} | ${r.name} | ${r.email}`);
  });
  console.log('─'.repeat(80));
  console.log(`Total: ${created.length} alunos`);
  
  await conn.end();
}

main().catch(console.error);
