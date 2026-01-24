/**
 * Migrar Laís e Camila para o banco centralizado
 * 
 * Este script cria registros das alunas nas tabelas centralizadas:
 * - students (dados cadastrais)
 * - student_intelligence (perfil de aprendizado)
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const CENTRAL_DB_URL = process.env.CENTRAL_DATABASE_URL;

async function main() {
  console.log('🔄 Iniciando migração de alunas para banco centralizado...\n');
  
  const conn = await mysql.createConnection(CENTRAL_DB_URL);
  
  try {
    // ========================================================================
    // 1. LAÍS MILENA GAMBINI
    // ========================================================================
    console.log('👩‍🎓 Migrando LAÍS MILENA GAMBINI...');
    
    // Verificar se já existe
    const [existingLais] = await conn.query(
      'SELECT id FROM students WHERE name = ? AND email = ?',
      ['Laís Milena Gambini', 'lais.gambini@example.com']
    );
    
    let laisId;
    
    if (existingLais.length > 0) {
      laisId = existingLais[0].id;
      console.log(`   ✅ Laís já existe no banco (ID: ${laisId})`);
    } else {
      // Criar registro
      const [result] = await conn.query(`
        INSERT INTO students (
          matricula, name, email, phone, status, 
          notes, metadata, unidade_id, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        '6200',
        'Laís Milena Gambini',
        'lais.gambini@example.com',
        '(11) 98765-4321',
        'Ativo',
        'Aluna do inFlux Personal Tutor - Foco: Reuniões de trabalho, conectivos, tempos verbais',
        JSON.stringify({
          objective: 'career',
          specificGoals: 'Reuniões de trabalho, conectivos, tempos verbais, escrita profissional',
          source: 'personal_tutor',
          migrated_at: new Date().toISOString()
        }),
        1
      ]);
      
      laisId = result.insertId;
      console.log(`   ✅ Laís criada no banco (ID: ${laisId})`);
    }
    
    // Criar student_intelligence
    const [existingLaisIntel] = await conn.query(
      'SELECT id FROM student_intelligence WHERE student_id = ?',
      [laisId]
    );
    
    if (existingLaisIntel.length === 0) {
      await conn.query(`
        INSERT INTO student_intelligence (
          contact_phone, student_id, interest_profile, pain_points,
          learning_style, current_level, confidence_score,
          mastered_topics, struggling_topics, metadata,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        '(11) 98765-4321',
        laisId,
        'Profissional focada em carreira, interessada em reuniões de trabalho e comunicação corporativa',
        'Dificuldade com conectivos e tempos verbais em contextos profissionais',
        'leitura_escrita',
        'Book 4',
        65,
        JSON.stringify(['basic_conversation', 'present_simple', 'past_simple']),
        JSON.stringify(['connectives', 'verb_tenses', 'formal_writing']),
        JSON.stringify({
          objective: 'career',
          focus_areas: ['meetings', 'connectives', 'verb_tenses', 'professional_writing']
        })
      ]);
      
      console.log('   ✅ Perfil de inteligência criado para Laís');
    } else {
      console.log('   ✅ Perfil de inteligência já existe para Laís');
    }
    
    // ========================================================================
    // 2. CAMILA GONSALVES
    // ========================================================================
    console.log('\n👩‍🎓 Migrando CAMILA GONSALVES...');
    
    // Verificar se já existe
    const [existingCamila] = await conn.query(
      'SELECT id FROM students WHERE name = ? AND email = ?',
      ['Camila Gonsalves', 'camiladarosa@outlook.com']
    );
    
    let camilaId;
    
    if (existingCamila.length > 0) {
      camilaId = existingCamila[0].id;
      console.log(`   ✅ Camila já existe no banco (ID: ${camilaId})`);
    } else {
      // Criar registro
      const [result] = await conn.query(`
        INSERT INTO students (
          matricula, name, email, phone, status,
          notes, metadata, unidade_id, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        '6220',
        'Camila Gonsalves',
        'camiladarosa@outlook.com',
        '41 8468-9753',
        'Ativo',
        'Aluna do inFlux Personal Tutor - Foco: Viagens (Europa), séries (Friends), músicas',
        JSON.stringify({
          objective: 'travel',
          specificGoals: 'Viagens para Europa, assistir Friends sem legendas, entender músicas',
          interests: ['travel', 'series', 'music'],
          source: 'personal_tutor',
          migrated_at: new Date().toISOString()
        }),
        1
      ]);
      
      camilaId = result.insertId;
      console.log(`   ✅ Camila criada no banco (ID: ${camilaId})`);
    }
    
    // Criar student_intelligence
    const [existingCamilaIntel] = await conn.query(
      'SELECT id FROM student_intelligence WHERE student_id = ?',
      [camilaId]
    );
    
    if (existingCamilaIntel.length === 0) {
      await conn.query(`
        INSERT INTO student_intelligence (
          contact_phone, student_id, interest_profile, pain_points,
          learning_style, current_level, confidence_score,
          mastered_topics, struggling_topics, metadata,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        '41 8468-9753',
        camilaId,
        'Interessada em viagens, séries (Friends) e músicas. Foco em conversação para turismo',
        'Dificuldade em formação de frases e compreensão auditiva (listening)',
        'auditivo',
        'Book 1',
        45,
        JSON.stringify(['basic_greetings', 'numbers', 'colors']),
        JSON.stringify(['sentence_formation', 'listening_comprehension', 'verb_conjugation']),
        JSON.stringify({
          objective: 'travel',
          interests: ['travel_europe', 'friends_series', 'music'],
          focus_areas: ['conversation', 'listening', 'sentence_building']
        })
      ]);
      
      console.log('   ✅ Perfil de inteligência criado para Camila');
    } else {
      console.log('   ✅ Perfil de inteligência já existe para Camila');
    }
    
    // ========================================================================
    // 3. ATUALIZAR TABELA USERS (adicionar referência ao student_id)
    // ========================================================================
    console.log('\n🔗 Atualizando referências na tabela users...');
    
    // Verificar se coluna student_id existe em users
    const [columns] = await conn.query(`
      SHOW COLUMNS FROM users LIKE 'student_id'
    `);
    
    if (columns.length === 0) {
      // Adicionar coluna student_id
      await conn.query(`
        ALTER TABLE users 
        ADD COLUMN student_id INT NULL
      `);
      console.log('   ✅ Coluna student_id adicionada à tabela users');
      
      // Adicionar foreign key
      await conn.query(`
        ALTER TABLE users
        ADD CONSTRAINT fk_users_students
        FOREIGN KEY (student_id) REFERENCES students(id)
      `);
      console.log('   ✅ Foreign key adicionada');
    }
    
    // Atualizar user da Laís
    await conn.query(`
      UPDATE users 
      SET student_id = ? 
      WHERE email = ?
    `, [laisId, 'lais.gambini@example.com']);
    
    // Atualizar user da Camila
    await conn.query(`
      UPDATE users 
      SET student_id = ? 
      WHERE email = ?
    `, [camilaId, 'camiladarosa@outlook.com']);
    
    console.log('   ✅ Referências atualizadas na tabela users');
    
    // ========================================================================
    // RESUMO
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`\n📊 Resumo:`);
    console.log(`   • Laís Milena Gambini (ID: ${laisId}) - Book 4, Foco: Carreira`);
    console.log(`   • Camila Gonsalves (ID: ${camilaId}) - Book 1, Foco: Viagens`);
    console.log(`\n🔗 Links de acesso:`);
    console.log(`   • Laís: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/1b79abbadd043bef01841a07bf000c10fdb3eabcf765ebf9070c935ec31c7e2f`);
    console.log(`   • Camila: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/d80e078ddb9ce0e237a67b4e00f09fddc762cc5ee9eadb3e9938cd4b19b81d08`);
    
  } catch (error) {
    console.error('\n❌ Erro durante migração:', error);
    throw error;
  } finally {
    await conn.end();
  }
}

main().catch(console.error);
