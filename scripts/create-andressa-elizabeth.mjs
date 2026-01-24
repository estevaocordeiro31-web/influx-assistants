/**
 * Criar registros de Andressa e Elizabeth no banco centralizado
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const CENTRAL_DB_URL = process.env.CENTRAL_DATABASE_URL;
const LOCAL_DB_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🔄 Criando logins para Andressa e Elizabeth...\n');
  
  const centralConn = await mysql.createConnection(CENTRAL_DB_URL);
  const localConn = await mysql.createConnection(LOCAL_DB_URL);
  
  try {
    // ========================================================================
    // 1. ANDRESSA AMORIM DE ARAÚJO
    // ========================================================================
    console.log('👩‍🎓 Criando ANDRESSA AMORIM DE ARAÚJO...');
    
    // Criar no banco centralizado
    const [andressaResult] = await centralConn.query(`
      INSERT INTO students (
        matricula, name, email, phone, status,
        notes, metadata, unidade_id, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      '5267',
      'Andressa Amorim de Araújo',
      'andressaamorimdearaujo03@gmail.com',
      '11 96372-5419',
      'Ativo',
      'Aluna do inFlux Personal Tutor - Book 4',
      JSON.stringify({
        currentBook: 'Book 4',
        source: 'personal_tutor',
        created_at: new Date().toISOString()
      }),
      1
    ]);
    
    const andressaId = andressaResult.insertId;
    console.log(`   ✅ Andressa criada no banco centralizado (ID: ${andressaId})`);
    
    // Criar student_intelligence
    await centralConn.query(`
      INSERT INTO student_intelligence (
        contact_phone, student_id, interest_profile, pain_points,
        learning_style, current_level, confidence_score,
        mastered_topics, struggling_topics, metadata,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      '11 96372-5419',
      andressaId,
      'Aluna do Book 4, em desenvolvimento',
      'A definir durante acompanhamento',
      'auditivo',
      'Book 4',
      70,
      JSON.stringify(['basic_conversation', 'present_tenses', 'past_tenses', 'future_forms']),
      JSON.stringify([]),
      JSON.stringify({
        currentBook: 'Book 4',
        focus_areas: []
      })
    ]);
    
    console.log('   ✅ Perfil de inteligência criado para Andressa');
    
    // Criar usuário local
    const andressaPassword = 'Andressa@2026';
    const andressaHash = await bcrypt.hash(andressaPassword, 10);
    const andressaOpenId = crypto.randomBytes(32).toString('hex');
    const andressaToken = crypto.randomBytes(32).toString('hex');
    
    const [andressaUserResult] = await localConn.query(`
      INSERT INTO users (
        openId, name, email, passwordHash, role, status, student_id,
        createdAt, updatedAt, lastSignedIn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `, [
      andressaOpenId,
      'Andressa Amorim de Araújo',
      'andressaamorimdearaujo03@gmail.com',
      andressaHash,
      'user',
      'ativo',
      andressaId
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${andressaUserResult.insertId})`);
    console.log(`   🔑 Senha: ${andressaPassword}`);
    console.log(`   🔗 Token: ${andressaToken}`);
    
    // ========================================================================
    // 2. ELIZABETH RODRIGUES DE SOUZA
    // ========================================================================
    console.log('\n👩‍🎓 Criando ELIZABETH RODRIGUES DE SOUZA...');
    
    // Criar no banco centralizado
    const [elizabethResult] = await centralConn.query(`
      INSERT INTO students (
        matricula, name, email, phone, status,
        notes, metadata, unidade_id, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      '6665',
      'Elizabeth Rodrigues De Souza',
      'elizabeth.engenhariaeletrica@gmail.com',
      '11 99170-4180',
      'Ativo',
      'Aluna do inFlux Personal Tutor - Book 5',
      JSON.stringify({
        currentBook: 'Book 5',
        source: 'personal_tutor',
        created_at: new Date().toISOString()
      }),
      1
    ]);
    
    const elizabethId = elizabethResult.insertId;
    console.log(`   ✅ Elizabeth criada no banco centralizado (ID: ${elizabethId})`);
    
    // Criar student_intelligence
    await centralConn.query(`
      INSERT INTO student_intelligence (
        contact_phone, student_id, interest_profile, pain_points,
        learning_style, current_level, confidence_score,
        mastered_topics, struggling_topics, metadata,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      '11 99170-4180',
      elizabethId,
      'Aluna do Book 5, nível avançado',
      'A definir durante acompanhamento',
      'visual',
      'Book 5',
      80,
      JSON.stringify(['advanced_grammar', 'complex_tenses', 'conditionals', 'passive_voice']),
      JSON.stringify([]),
      JSON.stringify({
        currentBook: 'Book 5',
        focus_areas: []
      })
    ]);
    
    console.log('   ✅ Perfil de inteligência criado para Elizabeth');
    
    // Criar usuário local
    const elizabethPassword = 'Elizabeth@2026';
    const elizabethHash = await bcrypt.hash(elizabethPassword, 10);
    const elizabethOpenId = crypto.randomBytes(32).toString('hex');
    const elizabethToken = crypto.randomBytes(32).toString('hex');
    
    const [elizabethUserResult] = await localConn.query(`
      INSERT INTO users (
        openId, name, email, passwordHash, role, status, student_id,
        createdAt, updatedAt, lastSignedIn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `, [
      elizabethOpenId,
      'Elizabeth Rodrigues De Souza',
      'elizabeth.engenhariaeletrica@gmail.com',
      elizabethHash,
      'user',
      'ativo',
      elizabethId
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${elizabethUserResult.insertId})`);
    console.log(`   🔑 Senha: ${elizabethPassword}`);
    console.log(`   🔗 Token: ${elizabethToken}`);
    
    // ========================================================================
    // RESUMO
    // ========================================================================
    console.log('\n' + '='.repeat(70));
    console.log('✅ ALUNAS CRIADAS COM SUCESSO!');
    console.log('='.repeat(70));
    
    const baseUrl = 'https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer';
    
    console.log(`\n📊 ANDRESSA AMORIM DE ARAÚJO:`);
    console.log(`   • ID: ${andressaId}`);
    console.log(`   • Email: andressaamorimdearaujo03@gmail.com`);
    console.log(`   • Senha: ${andressaPassword}`);
    console.log(`   • Matrícula: 5267`);
    console.log(`   • Nível: Book 4`);
    console.log(`   • Login: ${baseUrl}/login`);
    console.log(`   • Link Direto: ${baseUrl}/api/direct-login/${andressaToken}`);
    
    console.log(`\n📊 ELIZABETH RODRIGUES DE SOUZA:`);
    console.log(`   • ID: ${elizabethId}`);
    console.log(`   • Email: elizabeth.engenhariaeletrica@gmail.com`);
    console.log(`   • Senha: ${elizabethPassword}`);
    console.log(`   • Matrícula: 6665`);
    console.log(`   • Nível: Book 5`);
    console.log(`   • Login: ${baseUrl}/login`);
    console.log(`   • Link Direto: ${baseUrl}/api/direct-login/${elizabethToken}`);
    
  } catch (error) {
    console.error('\n❌ Erro:', error);
    throw error;
  } finally {
    await centralConn.end();
    await localConn.end();
  }
}

main().catch(console.error);
