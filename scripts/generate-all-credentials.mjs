import mysql from 'mysql2/promise';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const CENTRAL_DB_URL = process.env.CENTRAL_DATABASE_URL;

if (!CENTRAL_DB_URL) {
  console.error('❌ CENTRAL_DATABASE_URL não configurada');
  process.exit(1);
}

// Parse connection string
const url = new URL(CENTRAL_DB_URL);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: url.hostname.includes('tidb') || url.hostname.includes('rds') ? { rejectUnauthorized: false } : undefined,
};

async function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  const connection = await mysql.createConnection(config);

  try {
    console.log('📊 Puxando lista de alunos ativos...\n');

    // Puxar alunos ativos
    const [students] = await connection.query(
      `SELECT id, email, name FROM users 
       WHERE role = 'user' AND email IS NOT NULL AND email != ''
       ORDER BY name ASC`
    );

    console.log(`✅ Total de alunos encontrados: ${students.length}\n`);

    const credentials = [];
    let updated = 0;
    let errors = 0;

    for (const student of students) {
      try {
        const password = await generatePassword(12);
        const passwordHash = await bcrypt.hash(password, 10);

        // Atualizar password_hash no banco
        await connection.query(
          `UPDATE users SET password_hash = ? WHERE id = ?`,
          [passwordHash, student.id]
        );

        credentials.push({
          id: student.id,
          name: student.name,
          email: student.email,
          password: password,
        });

        updated++;
        if (updated % 20 === 0) {
          console.log(`⏳ Processados ${updated} alunos...`);
        }
      } catch (err) {
        console.error(`❌ Erro ao processar aluno ${student.id}: ${err.message}`);
        errors++;
      }
    }

    console.log(`\n✅ Credenciais geradas: ${updated}`);
    console.log(`❌ Erros: ${errors}`);

    // Salvar em arquivo JSON
    const fs = await import('fs').then(m => m.promises);
    await fs.writeFile(
      '/home/ubuntu/student_credentials.json',
      JSON.stringify(credentials, null, 2)
    );

    console.log('\n📄 Arquivo salvo: /home/ubuntu/student_credentials.json');

    // Exibir primeiros 5 alunos como exemplo
    console.log('\n📋 Primeiros 5 alunos:');
    credentials.slice(0, 5).forEach(c => {
      console.log(`  ${c.id} | ${c.name} | ${c.email} | Senha: ${c.password}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
