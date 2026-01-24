/**
 * Script para definir senhas iniciais para as alunas
 * Uso: node scripts/set-student-passwords.mjs
 */

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const SALT_ROUNDS = 10;

// Configuração do banco de dados
const DB_CONFIG = {
  host: process.env.DATABASE_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true,
  },
};

// Senhas das alunas (ALTERAR ANTES DE RODAR)
const STUDENTS = [
  {
    email: 'lais.gambini@example.com',
    password: 'Lais@2026',
    name: 'Laís Milena Gambini',
  },
  {
    email: 'camiladarosa@outlook.com',
    password: 'Camila@2026',
    name: 'Camila Gonsalves',
  },
];

async function setStudentPasswords() {
  let connection;

  try {
    console.log('🔌 Conectando ao banco de dados...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado com sucesso!\n');

    for (const student of STUDENTS) {
      console.log(`📝 Processando: ${student.name} (${student.email})`);

      // Verificar se o usuário existe
      const [users] = await connection.execute(
        'SELECT id, name, email FROM users WHERE email = ?',
        [student.email]
      );

      if (users.length === 0) {
        console.log(`❌ Usuário não encontrado: ${student.email}\n`);
        continue;
      }

      const user = users[0];
      console.log(`   Usuário encontrado: ID ${user.id}`);

      // Gerar hash da senha
      console.log(`   Gerando hash da senha...`);
      const passwordHash = await bcrypt.hash(student.password, SALT_ROUNDS);

      // Atualizar senha no banco
      await connection.execute(
        'UPDATE users SET passwordHash = ? WHERE id = ?',
        [passwordHash, user.id]
      );

      console.log(`✅ Senha definida com sucesso!`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Senha: ${student.password}\n`);
    }

    console.log('🎉 Todas as senhas foram definidas com sucesso!');
    console.log('\n📋 CREDENCIAIS PARA ENVIAR ÀS ALUNAS:\n');
    console.log('─'.repeat(60));

    for (const student of STUDENTS) {
      console.log(`\n${student.name}`);
      console.log(`Email: ${student.email}`);
      console.log(`Senha: ${student.password}`);
      console.log(`URL: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/login`);
    }

    console.log('\n' + '─'.repeat(60));
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão fechada.');
    }
  }
}

// Executar script
setStudentPasswords().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
