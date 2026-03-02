/**
 * Script de sincronização manual com o Dashboard Central
 * Executa diretamente sem depender da interface web
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const CENTRAL_DATABASE_URL = 'mysql://2T8Mwbb7L99VC4H.root:f7ZQeShfJ94H7Vod4nS6@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/cacyggwz4xtSBdbG2dQaxY?ssl={"rejectUnauthorized":true}';

function mapStatus(centralStatus) {
  const statusMap = {
    'Ativo': 'ativo',
    'Inativo': 'inativo',
    'Desistente': 'desistente',
    'Trancado': 'trancado',
  };
  return statusMap[centralStatus] || 'inativo';
}

async function runSync() {
  console.log('🔄 Iniciando sincronização com Dashboard Central...\n');

  const connection = await mysql.createConnection(CENTRAL_DATABASE_URL);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // 1. Buscar alunos ATIVOS do Dashboard Central sem usuário vinculado
    const [studentsToCreate] = await connection.execute(`
      SELECT s.id, s.matricula, s.name, s.email, s.phone, s.status, s.book_level
      FROM students s
      LEFT JOIN users u ON u.email = s.email AND u.role = 'user'
      WHERE s.status = 'Ativo'
        AND s.email IS NOT NULL
        AND s.email != ''
        AND u.id IS NULL
      ORDER BY s.name
    `);

    console.log(`📊 Alunos ativos sem conta no inFlux: ${studentsToCreate.length}`);

    // 2. Buscar alunos que já têm usuário mas sem student_id vinculado
    const [studentsToLink] = await connection.execute(`
      SELECT s.id as student_id, s.name as student_name, s.email, u.id as user_id
      FROM students s
      INNER JOIN users u ON u.email = s.email AND u.role = 'user'
      WHERE u.student_id IS NULL
      ORDER BY s.name
    `);

    console.log(`🔗 Usuários sem vínculo com student_id: ${studentsToLink.length}`);

    // 3. Criar usuários para alunos ativos sem conta
    console.log('\n--- CRIANDO CONTAS PARA ALUNOS ATIVOS ---');
    for (const student of studentsToCreate) {
      const s = student;
      try {
        const firstName = s.name?.split(' ')[0] || 'Aluno';
        const defaultPassword = `${firstName}@2026`;
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        const openId = crypto.createHash('sha256')
          .update(`student_${s.id}_${s.matricula || ''}_${Date.now()}_${Math.random()}`)
          .digest('hex');

        await connection.execute(
          `INSERT INTO users (openId, name, email, password_hash, role, unidade_id, student_id, createdAt, updatedAt, lastSignedIn)
           VALUES (?, ?, ?, ?, 'user', 1, ?, NOW(), NOW(), NOW())`,
          [openId, s.name, s.email, passwordHash, s.id]
        );

        created++;
        console.log(`  ✓ Criado: ${s.name} (${s.email}) — senha: ${defaultPassword}`);

      } catch (err) {
        errors++;
        console.error(`  ✗ Erro ao criar ${s.name}: ${err.message}`);
      }
    }

    // 4. Vincular usuários existentes ao student_id correto
    console.log('\n--- VINCULANDO USUÁRIOS EXISTENTES ---');
    for (const item of studentsToLink) {
      try {
        await connection.execute(
          `UPDATE users SET student_id = ?, updatedAt = NOW() WHERE id = ?`,
          [item.student_id, item.user_id]
        );
        updated++;
        console.log(`  🔗 Vinculado: ${item.student_name} (${item.email})`);
      } catch (err) {
        errors++;
        console.error(`  ✗ Erro ao vincular ${item.student_name}: ${err.message}`);
      }
    }

    // 5. Estatísticas finais
    const [finalStats] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM students WHERE status = 'Ativo' AND email IS NOT NULL AND email != '') as central_ativos,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND student_id IS NOT NULL) as linked_users
    `);

    const stats = finalStats[0];

    console.log('\n========================================');
    console.log('✅ SINCRONIZAÇÃO CONCLUÍDA!');
    console.log('========================================');
    console.log(`  📌 Contas criadas:    ${created}`);
    console.log(`  🔗 Vínculos criados:  ${updated}`);
    console.log(`  ⚠️  Erros:            ${errors}`);
    console.log('');
    console.log('📊 ESTADO ATUAL DO BANCO:');
    console.log(`  Dashboard Central (ativos): ${stats.central_ativos}`);
    console.log(`  Usuários no inFlux:         ${stats.total_users}`);
    console.log(`  Usuários vinculados:        ${stats.linked_users}`);
    console.log(`  Sem vínculo:                ${stats.total_users - stats.linked_users}`);
    console.log('========================================\n');

  } finally {
    await connection.end();
  }
}

runSync().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
