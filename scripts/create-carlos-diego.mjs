import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const CENTRAL_DB_URL = process.env.CENTRAL_DATABASE_URL;
const LOCAL_DB_URL = process.env.DATABASE_URL;

async function createCarlosAndDiego() {
  console.log('🔄 Criando logins para Carlos Alberto e Diego Bim...\n');

  const centralConn = await mysql.createConnection(CENTRAL_DB_URL);
  const localConn = await mysql.createConnection(LOCAL_DB_URL);

  try {
    // ========== CARLOS ALBERTO PIRANI JÚNIOR ==========
    console.log('👨‍🎓 Criando CARLOS ALBERTO PIRANI JÚNIOR...');
    
    // 1. Criar student no banco centralizado
    const [carlosResult] = await centralConn.query(`
      INSERT INTO students (
        name, email, phone, matricula, status, metadata, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Carlos Alberto Pirani Júnior',
      'carlos_junior_707@hotmail.com',
      '11969156025',
      '6399',
      'Ativo',
      JSON.stringify({ current_book: 'Book 3', current_unit: 'Unit 1', role: 'supervisor_comercial' })
    ]);
    
    const carlosStudentId = carlosResult.insertId;
    console.log(`   ✅ Carlos criado no banco centralizado (ID: ${carlosStudentId})`);

    // 2. Criar student_intelligence
    await centralConn.query(`
      INSERT INTO student_intelligence (
        student_id, contact_phone, learning_style, confidence_score, interest_profile,
        pain_points, mastered_topics, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      carlosStudentId,
      '11969156025-carlos',
      'visual',
      65,
      'Aluno Book 3. Supervisor Comercial com interesse em se tornar franqueado.',
      'A definir - aguardando coleta de dados sobre objetivos e dificuldades',
      JSON.stringify(['basic_conversation', 'present_simple', 'past_simple']),
      JSON.stringify({
        role: 'supervisor_comercial',
        future_franqueado: true,
        objective: 'to_be_defined',
        main_difficulty: 'to_be_defined'
      })
    ]);
    console.log('   ✅ Perfil de inteligência criado para Carlos');

    // 3. Criar user local
    const carlosPassword = 'Carlos@2026';
    const carlosHash = await bcrypt.hash(carlosPassword, 10);
    const carlosToken = crypto.randomBytes(32).toString('hex');

    const [carlosUserResult] = await localConn.query(`
      INSERT INTO users (
        name, email, openId, role, status, passwordHash, student_id, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Carlos Alberto Pirani Júnior',
      'carlos_junior_707@hotmail.com',
      carlosToken,
      'user',
      'Ativo',
      carlosHash,
      carlosStudentId
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${carlosUserResult.insertId})`);
    console.log(`   🔑 Senha: ${carlosPassword}`);
    console.log(`   🔗 Token: ${carlosToken}\n`);

    // ========== DIEGO BIM (FRANQUEADO OSASCO - TESTE) ==========
    console.log('👨‍💼 Criando DIEGO BIM (Franqueado Osasco - Teste)...');
    
    // 1. Criar student no banco centralizado
    const [diegoResult] = await centralConn.query(`
      INSERT INTO students (
        name, email, phone, matricula, status, metadata, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Diego Bim',
      'direcaoosasco@influx.com.br',
      '11995253784',
      'TESTE-FRANQ',
      'Ativo',
      JSON.stringify({ current_book: 'Book 4', current_unit: 'Unit 1', role: 'franqueado_teste', unit: 'Osasco' })
    ]);
    
    const diegoStudentId = diegoResult.insertId;
    console.log(`   ✅ Diego criado no banco centralizado (ID: ${diegoStudentId})`);

    // 2. Criar student_intelligence
    await centralConn.query(`
      INSERT INTO student_intelligence (
        student_id, contact_phone, learning_style, confidence_score, interest_profile,
        pain_points, mastered_topics, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      diegoStudentId,
      '11995253784-diego',
      'visual',
      70,
      'Franqueado da unidade Osasco. Testando solução inFlux Personal Tutor para implementar na unidade.',
      'Acesso de teste - avaliar funcionalidades, UX e potencial pedagógico',
      JSON.stringify(['intermediate_conversation', 'business_english', 'present_perfect']),
      JSON.stringify({
        role: 'franqueado_teste',
        unit: 'Osasco',
        objective: 'evaluate_solution',
        test_purpose: 'implementation_assessment'
      })
    ]);
    console.log('   ✅ Perfil de inteligência criado para Diego');

    // 3. Criar user local
    const diegoPassword = 'Diego@2026';
    const diegoHash = await bcrypt.hash(diegoPassword, 10);
    const diegoToken = crypto.randomBytes(32).toString('hex');

    const [diegoUserResult] = await localConn.query(`
      INSERT INTO users (
        name, email, openId, role, status, passwordHash, student_id, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Diego Bim',
      'direcaoosasco@influx.com.br',
      diegoToken,
      'user',
      'Ativo',
      diegoHash,
      diegoStudentId
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${diegoUserResult.insertId})`);
    console.log(`   🔑 Senha: ${diegoPassword}`);
    console.log(`   🔗 Token: ${diegoToken}\n`);

    // ========== RESUMO ==========
    console.log('='.repeat(70));
    console.log('✅ ALUNOS CRIADOS COM SUCESSO!');
    console.log('='.repeat(70));
    
    console.log('\n📊 CARLOS ALBERTO PIRANI JÚNIOR:');
    console.log(`   • ID: ${carlosStudentId}`);
    console.log(`   • Email: carlos_junior_707@hotmail.com`);
    console.log(`   • Senha: ${carlosPassword}`);
    console.log(`   • Matrícula: 6399`);
    console.log(`   • Nível: Book 3`);
    console.log(`   • Função: Supervisor Comercial (futuro franqueado)`);
    console.log(`   • Login: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/login`);
    console.log(`   • Link Direto: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/${carlosToken}`);
    
    console.log('\n📊 DIEGO BIM (Franqueado Osasco):');
    console.log(`   • ID: ${diegoStudentId}`);
    console.log(`   • Email: direcaoosasco@influx.com.br`);
    console.log(`   • Senha: ${diegoPassword}`);
    console.log(`   • Telefone: 11 99525-3784`);
    console.log(`   • Nível: Book 4 (teste)`);
    console.log(`   • Unidade: Osasco`);
    console.log(`   • Login: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/login`);
    console.log(`   • Link Direto: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/${diegoToken}`);

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await centralConn.end();
    await localConn.end();
  }
}

createCarlosAndDiego().catch(console.error);
