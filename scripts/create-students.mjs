import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const students = [
  {
    name: 'Leonardo Cantone',
    email: 'leonardocantone25@gmail.com',
    whatsapp: '11941177986',
    level: 'advanced',
    book: 'Book 4+',
    objective: 'career',
    password: 'LryzqLsIRw0q',
    studentIdNum: 60003,
  },
  {
    name: 'Gabriela Cantone',
    email: 'gabicantone@gmail.com',
    whatsapp: '11996905948',
    level: 'beginner',
    book: 'Book 1',
    objective: 'studies',
    password: 'PGVl#YiMQIA$',
    studentIdNum: 60004,
  },
  {
    name: 'Vitor Emanuel',
    email: 'joloemanuel1@gmail.com',
    whatsapp: '11993113854',
    level: 'beginner',
    book: 'Book 1',
    objective: 'studies',
    password: 'CcU5eFLreuJd',
    studentIdNum: 60005,
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('🔄 Cadastrando 3 alunos no Personal Assistants...\n');
  
  for (const student of students) {
    try {
      // Gerar hash da senha
      const passwordHash = await bcrypt.hash(student.password, 10);
      
      // Gerar openId único
      const openId = crypto.createHash('sha256')
        .update(`student_${student.email}_${Date.now()}_${Math.random()}`)
        .digest('hex')
        .substring(0, 40);
      
      // Inserir usuário
      const [result] = await conn.execute(
        `INSERT INTO users (openId, student_id, name, email, password_hash, role, status, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, ?, ?, 'student', 'ativo', NOW(), NOW(), NOW())`,
        [openId, student.studentIdNum, student.name, student.email, passwordHash]
      );
      
      const userId = result.insertId;
      console.log(`✅ Usuário criado: ${student.name} (ID: ${userId}, Student ID: ${student.studentIdNum})`);
      
      // Criar perfil do aluno
      try {
        await conn.execute(
          `INSERT INTO student_profiles (user_id, objective, current_level, total_hours_learned, streak_days, created_at, updated_at)
           VALUES (?, ?, ?, 0, 0, NOW(), NOW())`,
          [userId, student.objective, student.level]
        );
        console.log(`   📋 Perfil criado: Nível ${student.level}, Objetivo: ${student.objective}`);
      } catch (profileErr) {
        console.log(`   ⚠️ Perfil não criado (pode já existir): ${profileErr.message}`);
      }
      
      
      console.log(`   📧 Email: ${student.email}`);
      console.log(`   📱 WhatsApp: ${student.whatsapp}`);
      console.log(`   📚 Livro: ${student.book}`);
      console.log(`   🔑 Senha: ${student.password}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erro ao cadastrar ${student.name}: ${error.message}`);
    }
  }
  
  // Verificar alunos criados
  const [created] = await conn.query(
    'SELECT id, student_id, name, email, role, status FROM users WHERE email IN (?, ?, ?)',
    ['leonardocantone25@gmail.com', 'gabicantone@gmail.com', 'joloemanuel1@gmail.com']
  );
  
  console.log('\n📊 Resumo dos alunos criados:');
  console.log('─'.repeat(80));
  created.forEach(r => {
    console.log(`  ID: ${r.id} | Student ID: ${r.student_id} | ${r.name} | ${r.email} | ${r.role} | ${r.status}`);
  });
  console.log('─'.repeat(80));
  console.log(`Total: ${created.length} alunos cadastrados com sucesso!`);
  
  await conn.end();
}

main().catch(console.error);
