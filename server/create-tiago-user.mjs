/**
 * Script para criar usuário Tiago Laerte Marques no banco de dados
 * 
 * Execução: node server/create-tiago-user.mjs
 */

import { createConnection } from 'mysql2/promise';
import crypto from 'crypto';

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'influx_tutor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function createTiagoUser() {
  let connection;
  try {
    connection = await createConnection(config);
    console.log('✅ Conectado ao banco de dados');

    // Gerar openId único para Tiago
    const openId = crypto.randomBytes(32).toString('hex');
    
    // Dados do Tiago
    const tiagoData = {
      openId,
      name: 'Tiago Laerte Marques',
      email: 'tiago.laerte@icloud.com',
      role: 'user',
      status: 'ativo',
      loginMethod: 'oauth',
    };

    // Inserir usuário
    const [userResult] = await connection.execute(
      `INSERT INTO users (openId, name, email, role, status, loginMethod, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      [
        tiagoData.openId,
        tiagoData.name,
        tiagoData.email,
        tiagoData.role,
        tiagoData.status,
        tiagoData.loginMethod,
      ]
    );

    const userId = userResult.insertId;
    console.log(`✅ Usuário criado com ID: ${userId}`);

    // Criar perfil do aluno
    const [profileResult] = await connection.execute(
      `INSERT INTO student_profiles (user_id, objective, current_level, total_hours_learned, streak_days, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        'career', // Objetivo: Career (Medical English)
        'elementary', // Book 2 = Elementary
        0, // Horas: 0 (iniciando)
        0, // Streak: 0 (iniciando)
      ]
    );

    console.log(`✅ Perfil do aluno criado com ID: ${profileResult.insertId}`);

    // Exibir informações
    console.log('\n📋 Usuário Tiago Criado com Sucesso!\n');
    console.log('Informações:');
    console.log(`  Nome: ${tiagoData.name}`);
    console.log(`  Email: ${tiagoData.email}`);
    console.log(`  ID no Sistema: ${userId}`);
    console.log(`  OpenID: ${openId}`);
    console.log(`  Nível: Elementary (Book 2)`);
    console.log(`  Objetivo: Career (Medical English)`);
    console.log(`  Status: Ativo`);
    console.log(`\n✅ Tiago pode fazer login e acessar /tiago\n`);

    // Verificar se foi criado
    const [users] = await connection.execute(
      'SELECT id, name, email, role, status FROM users WHERE email = ?',
      [tiagoData.email]
    );

    if (users.length > 0) {
      console.log('✅ Verificação: Usuário encontrado no banco!');
      console.log(users[0]);
    }

    await connection.end();
    console.log('\n✅ Script concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createTiagoUser();
