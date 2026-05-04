/**
 * Setup Tutor Users — Sincroniza alunos do Brain para o Tutor
 *
 * 1. Garante que colunas extras do tutor existem na tabela users
 * 2. Cria conta admin (Estevão) com senha
 * 3. Cria contas de alunos ativos a partir da tabela students
 * 4. Cria tabelas do tutor (student_profiles etc.) se não existirem
 *
 * Uso: node scripts/setup-tutor-users.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const DB_URL = (process.env.DATABASE_URL || process.env.CENTRAL_DATABASE_URL || '')
  .replace(/\?ssl=.*$/, '');

async function main() {
  const conn = await mysql.createConnection({
    uri: DB_URL,
    ssl: { rejectUnauthorized: true },
  });

  console.log('🎓 SETUP TUTOR USERS');
  console.log('═══════════════════════════════════════════════════\n');

  // ═══ 0. GARANTIR COLUNAS EXTRAS DO TUTOR NA TABELA USERS ═══
  console.log('0️⃣  Verificando colunas extras na tabela users...');

  const columnsToAdd = [
    { name: 'student_id', sql: 'ADD COLUMN student_id VARCHAR(20) UNIQUE AFTER openId' },
    { name: 'passwordHash', sql: 'ADD COLUMN passwordHash TEXT AFTER email' },
    { name: 'loginMethod', sql: "ADD COLUMN loginMethod VARCHAR(64) AFTER passwordHash" },
    { name: 'status', sql: "ADD COLUMN status ENUM('ativo','inativo','desistente','trancado') AFTER role" },
    { name: 'must_change_password', sql: 'ADD COLUMN must_change_password TINYINT(1) NOT NULL DEFAULT 0 AFTER lastSignedIn' },
    { name: 'unidade_id', sql: 'ADD COLUMN unidade_id INT NOT NULL DEFAULT 1 AFTER role' },
  ];

  for (const col of columnsToAdd) {
    try {
      const [existing] = await conn.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
        [col.name]
      );
      if (existing.length === 0) {
        await conn.execute(`ALTER TABLE users ${col.sql}`);
        console.log(`   ✅ Coluna '${col.name}' adicionada`);
      } else {
        console.log(`   ✔️  Coluna '${col.name}' já existe`);
      }
    } catch (e) {
      console.log(`   ⚠️  ${col.name}: ${e.message.substring(0, 80)}`);
    }
  }

  // ═══ 1. CRIAR TABELA student_profiles ═══
  console.log('\n1️⃣  Criando tabela student_profiles...');
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      objective ENUM('career','travel','studies','other') NOT NULL DEFAULT 'career',
      current_level ENUM('beginner','elementary','intermediate','upper_intermediate','advanced','proficient') NOT NULL DEFAULT 'beginner',
      total_hours_learned INT NOT NULL DEFAULT 0,
      streak_days INT NOT NULL DEFAULT 0,
      last_activity_at TIMESTAMP NULL,
      study_duration_years DECIMAL(3,1),
      study_duration_months INT,
      specific_goals TEXT,
      discomfort_areas TEXT,
      comfort_areas TEXT,
      english_consumption_sources JSON,
      improvement_areas TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ student_profiles OK');

  // ═══ 2. CRIAR CONTA ADMIN ═══
  console.log('\n2️⃣  Criando conta admin (Estevão)...');

  const adminEmail = 'estevao@influxjundiai.com.br';
  const adminPassword = 'Admin@inFlux2026';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const [existingAdmin] = await conn.execute(
    'SELECT id, email, role FROM users WHERE email = ? OR role = "owner" LIMIT 1',
    [adminEmail]
  );

  if (existingAdmin.length > 0) {
    // Atualizar senha e role
    await conn.execute(
      'UPDATE users SET passwordHash = ?, role = "admin", loginMethod = "password" WHERE email = ? OR role = "owner" LIMIT 1',
      [adminHash, adminEmail]
    );
    console.log(`   ✅ Admin atualizado: ${existingAdmin[0].email} (id=${existingAdmin[0].id})`);
  } else {
    // Criar novo
    const openId = `admin_estevao_${Date.now()}`;
    await conn.execute(
      `INSERT INTO users (openId, name, email, passwordHash, role, loginMethod, createdAt, updatedAt, lastSignedIn)
       VALUES (?, 'Estevão Cordeiro', ?, ?, 'admin', 'password', NOW(), NOW(), NOW())`,
      [openId, adminEmail, adminHash]
    );
    console.log(`   ✅ Admin criado: ${adminEmail}`);
  }
  console.log(`   📧 Login: ${adminEmail}`);
  console.log(`   🔑 Senha: ${adminPassword}`);

  // ═══ 3. CRIAR CONTA TESTE ALUNO ═══
  console.log('\n3️⃣  Criando conta de teste (aluno)...');

  const testEmail = 'aluno.teste@influxjundiai.com.br';
  const testPassword = 'Aluno@2026';
  const testHash = await bcrypt.hash(testPassword, 10);

  const [existingTest] = await conn.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1', [testEmail]
  );

  if (existingTest.length === 0) {
    const openId = `test_student_${Date.now()}`;
    await conn.execute(
      `INSERT INTO users (openId, name, email, passwordHash, role, loginMethod, createdAt, updatedAt, lastSignedIn)
       VALUES (?, 'Aluno Teste', ?, ?, 'user', 'password', NOW(), NOW(), NOW())`,
      [openId, testEmail, testHash]
    );
    console.log(`   ✅ Aluno teste criado`);
  } else {
    await conn.execute(
      'UPDATE users SET passwordHash = ?, loginMethod = "password" WHERE email = ?',
      [testHash, testEmail]
    );
    console.log(`   ✅ Aluno teste atualizado`);
  }
  console.log(`   📧 Login: ${testEmail}`);
  console.log(`   🔑 Senha: ${testPassword}`);

  // ═══ 4. SINCRONIZAR ALUNOS ATIVOS DO BRAIN ═══
  console.log('\n4️⃣  Sincronizando alunos ativos da tabela students...');

  const [activeStudents] = await conn.execute(`
    SELECT id, name, email, phone, status
    FROM students
    WHERE status IN ('Ativo','Bolsista','OnBusiness1','OnBusiness2','Travel')
      AND email IS NOT NULL AND email != ''
    ORDER BY name
  `);

  console.log(`   Encontrados ${activeStudents.length} alunos ativos com email`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const student of activeStudents) {
    try {
      // Verificar se já existe
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1', [student.email]
      );

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      // Criar usuário com senha padrão (telefone sem DDD ou últimos 6 dígitos)
      const phone = (student.phone || '').replace(/\D/g, '');
      const defaultPassword = phone.length >= 6 ? phone.slice(-6) : 'inFlux2026';
      const hash = await bcrypt.hash(defaultPassword, 10);

      const openId = `student_${student.id}_${Date.now()}`;
      const studentId = `INF-2026-${String(student.id).padStart(4, '0')}`;

      await conn.execute(
        `INSERT INTO users (openId, student_id, name, email, passwordHash, role, loginMethod, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, ?, ?, 'user', 'password', NOW(), NOW(), NOW())`,
        [openId, studentId, student.name, student.email, hash]
      );
      created++;
    } catch (e) {
      if (errors < 3) console.log(`   ❌ ${student.name}: ${e.message.substring(0, 80)}`);
      errors++;
    }
  }

  console.log(`   ✅ Criados: ${created} | Já existiam: ${skipped} | Erros: ${errors}`);

  // ═══ 5. RESUMO FINAL ═══
  console.log('\n5️⃣  Resumo:');
  console.log('─────────────────────────────────────');

  const [userCount] = await conn.execute('SELECT role, COUNT(*) as cnt FROM users GROUP BY role ORDER BY role');
  for (const r of userCount) {
    console.log(`   ${r.role}: ${r.cnt} usuários`);
  }

  const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM users');
  console.log(`   TOTAL: ${total[0].cnt} usuários`);

  console.log('\n═══════════════════════════════════════════════════');
  console.log('🎓 Pronto! Acesse https://tutor.imaind.tech');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`   Teste: ${testEmail} / ${testPassword}`);
  console.log('   Alunos: email cadastrado / últimos 6 dígitos do telefone');

  await conn.end();
}

main().catch(err => {
  console.error('💥 Erro:', err.message);
  process.exit(1);
});
