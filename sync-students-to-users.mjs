import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const CENTRAL_DATABASE_URL = process.env.CENTRAL_DATABASE_URL;

async function syncStudentsToUsers() {
  console.log('🔄 Iniciando sincronização de students para users...\n');
  
  const connection = await mysql.createConnection(CENTRAL_DATABASE_URL);
  
  try {
    // 1. Buscar todos os students ativos
    console.log('1️⃣ Buscando students ativos...');
    const [students] = await connection.execute(
      'SELECT * FROM students WHERE status = "Ativo"'
    );
    
    console.log(`✅ Encontrados ${students.length} students ativos\n`);
    
    // 2. Sincronizar cada student
    console.log('2️⃣ Criando usuários...');
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const student of students) {
      try {
        const email = student.email || `aluno${student.matricula}@influx.com.br`;
        
        // Verificar se já existe usuário
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );
        
        if (existingUsers.length > 0) {
          skipped++;
          continue;
        }
        
        // Gerar senha padrão
        const firstName = student.name?.split(' ')[0] || 'Aluno';
        const defaultPassword = `${firstName}@2026`;
        const passwordHash = await bcrypt.hash(defaultPassword, 10);
        
        // Gerar openId único
        const openId = crypto.createHash('sha256')
          .update(`student_${student.id}_${student.matricula}`)
          .digest('hex');
        
        // Criar usuário
        await connection.execute(
          `INSERT INTO users (openId, name, email, password_hash, role, unidade_id, createdAt, updatedAt, lastSignedIn)
           VALUES (?, ?, ?, ?, 'user', 1, NOW(), NOW(), NOW())`,
          [openId, student.name, email, passwordHash]
        );
        
        created++;
        console.log(`  ✓ ${student.name} (${email}) - Senha: ${defaultPassword}`);
        
      } catch (error) {
        console.error(`  ✗ Erro ao criar usuário para ${student.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resultado da sincronização:');
    console.log(`  - Criados: ${created}`);
    console.log(`  - Já existiam: ${skipped}`);
    console.log(`  - Erros: ${errors}`);
    console.log(`  - Total: ${students.length}`);
    
  } catch (error) {
    console.error('\n❌ Erro na sincronização:', error.message);
  } finally {
    await connection.end();
  }
}

syncStudentsToUsers();
