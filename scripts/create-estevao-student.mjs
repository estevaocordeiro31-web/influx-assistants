import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const CENTRAL_DB_URL = process.env.CENTRAL_DATABASE_URL;

async function createEstevaoStudent() {
  const connection = await mysql.createConnection(CENTRAL_DB_URL);
  
  try {
    console.log('🔍 Criando acesso de aluno para Estevão Cordeiro (Book 5)...\n');
    
    // 1. Criar registro em students
    const studentData = {
      name: 'Estevão Cordeiro',
      email: 'direcaojundiairetiro@influx.com.br',
      phone: '11957667480',
      matricula: 'TESTE-ADMIN',
      status: 'Ativo',
      metadata: JSON.stringify({ current_book: 'Book 5', current_unit: 1, is_test_account: true })
    };
    
    const [studentResult] = await connection.execute(
      `INSERT INTO students (name, email, phone, matricula, status, metadata, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [studentData.name, studentData.email, studentData.phone, studentData.matricula, 
       studentData.status, studentData.metadata]
    );
    
    const studentId = studentResult.insertId;
    console.log(`✅ Student criado: ID ${studentId}`);
    
    // 2. Criar registro em student_intelligence (apenas campos obrigatórios)
    await connection.execute(
      `INSERT INTO student_intelligence (student_id, contact_phone, learning_style, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [studentId, '11957667480-admin', 'visual']
    );
    
    console.log(`✅ Student intelligence criado`);
    
    // 3. Criar usuário local
    const password = 'Estevao@2026';
    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    
    await connection.execute(
      `INSERT INTO users (open_id, name, email, password_hash, role, status, student_id, access_token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE student_id = ?, access_token = ?, password_hash = ?, updated_at = NOW()`,
      [
        `student_${studentId}`,
        studentData.name,
        studentData.email,
        passwordHash,
        'user',
        'Ativo',
        studentId,
        token,
        studentId,
        token,
        passwordHash
      ]
    );
    
    console.log(`✅ Usuário local criado/atualizado`);
    console.log(`\n📧 Email: ${studentData.email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log(`🔗 Token: ${token}`);
    console.log(`\n🎓 Student ID: ${studentId}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createEstevaoStudent();
