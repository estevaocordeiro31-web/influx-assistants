#!/usr/bin/env node

/**
 * Script para criar usuário Tiago Laerte Marques no banco de dados
 * Execução: node server/scripts/create-tiago.mjs
 */

import pkg from 'mysql2/promise';
const { createConnection } = pkg;
import crypto from 'crypto';

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'influx_tutor',
};

async function createTiagoUser() {
  let connection;

  try {
    console.log('🔌 Conectando ao banco de dados...');
    connection = await createConnection(config);

    // Dados do Tiago
    const tiagoData = {
      name: 'Tiago Laerte Marques',
      email: 'tiago.laerte@icloud.com',
      openId: `tiago-${crypto.randomBytes(8).toString('hex')}`,
      phone: '11920409000',
      currentLevel: 'elementary',
      objective: 'career',
      profession: 'Médico',
    };

    console.log('\n📝 Dados do Tiago:');
    console.log(`  Nome: ${tiagoData.name}`);
    console.log(`  Email: ${tiagoData.email}`);
    console.log(`  Telefone: ${tiagoData.phone}`);
    console.log(`  Nível: ${tiagoData.currentLevel}`);
    console.log(`  Objetivo: ${tiagoData.objective}`);
    console.log(`  Profissão: ${tiagoData.profession}`);

    // Verificar se usuário já existe
    console.log('\n🔍 Verificando se usuário já existe...');
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [tiagoData.email]
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Usuário já existe no banco!');
      console.log(`   ID: ${existingUsers[0].id}`);
      process.exit(0);
    }

    // Inserir usuário
    console.log('\n➕ Criando usuário...');
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, openId) VALUES (?, ?, ?)',
      [tiagoData.name, tiagoData.email, tiagoData.openId]
    );

    const userId = userResult.insertId;
    console.log(`✅ Usuário criado com ID: ${userId}`);

    // Inserir perfil do aluno
    console.log('\n➕ Criando perfil do aluno...');
    const [profileResult] = await connection.execute(
      'INSERT INTO student_profiles (userId, objective, currentLevel, profession, phone) VALUES (?, ?, ?, ?, ?)',
      [userId, tiagoData.objective, tiagoData.currentLevel, tiagoData.profession, tiagoData.phone]
    );

    const profileId = profileResult.insertId;
    console.log(`✅ Perfil criado com ID: ${profileId}`);

    console.log('\n🎉 Usuário Tiago criado com sucesso!');
    console.log(`\n📋 Resumo:`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Profile ID: ${profileId}`);
    console.log(`   Email: ${tiagoData.email}`);
    console.log(`   Nível: ${tiagoData.currentLevel}`);
    console.log(`   Objetivo: ${tiagoData.objective}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTiagoUser();
