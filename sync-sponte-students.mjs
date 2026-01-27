import axios from 'axios';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const SPONTE_API_URL = process.env.SPONTE_API_URL;
const SPONTE_LOGIN = process.env.SPONTE_LOGIN;
const SPONTE_PASSWORD = process.env.SPONTE_PASSWORD;
const CENTRAL_DATABASE_URL = process.env.CENTRAL_DATABASE_URL;

async function syncSponteStudents() {
  console.log('🔄 Iniciando sincronização com Sponte...\n');
  
  try {
    // 1. Autenticar no Sponte
    console.log('1️⃣ Autenticando no Sponte...');
    const authResponse = await axios.post(`${SPONTE_API_URL}/Login`, {
      usuario: SPONTE_LOGIN,
      senha: SPONTE_PASSWORD
    });
    
    const token = authResponse.data.access_token;
    console.log('✅ Autenticado com sucesso!\n');
    
    // 2. Buscar alunos ativos
    console.log('2️⃣ Buscando alunos ativos...');
    const studentsResponse = await axios.get(`${SPONTE_API_URL}/Alunos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const activeStudents = studentsResponse.data.filter(s => s.Situacao === 'Ativo');
    console.log(`✅ Encontrados ${activeStudents.length} alunos ativos\n`);
    
    // 3. Conectar ao banco centralizado
    console.log('3️⃣ Conectando ao banco centralizado...');
    const connection = await mysql.createConnection(CENTRAL_DATABASE_URL);
    console.log('✅ Conectado ao banco!\n');
    
    // 4. Sincronizar cada aluno
    console.log('4️⃣ Sincronizando alunos...');
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    for (const student of activeStudents) {
      try {
        const email = student.Email || `aluno${student.AlunoId}@influx.com.br`;
        const firstName = student.Nome?.split(' ')[0] || 'Aluno';
        const defaultPassword = `${firstName}@2026`;
        const passwordHash = await bcrypt.hash(defaultPassword, 10);
        
        // Verificar se já existe
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );
        
        if (existing.length > 0) {
          // Atualizar
          await connection.execute(
            'UPDATE users SET name = ?, unidade_id = ? WHERE email = ?',
            [student.Nome, 1, email]
          );
          updated++;
        } else {
          // Criar usuário
          const openId = `sponte_${student.AlunoId}`;
          await connection.execute(
            `INSERT INTO users (openId, name, email, password_hash, role, unidade_id, createdAt, updatedAt, lastSignedIn)
             VALUES (?, ?, ?, ?, 'user', 1, NOW(), NOW(), NOW())`,
            [openId, student.Nome, email, passwordHash]
          );
          
          // Buscar ID do usuário criado
          const [newUser] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
          );
          
          // Criar student
          await connection.execute(
            `INSERT INTO students (user_id, matricula, nivel, objetivo, status, createdAt, updatedAt)
             VALUES (?, ?, 'Iniciante', 'Outro', 'ativo', NOW(), NOW())`,
            [newUser[0].id, student.AlunoId.toString()]
          );
          
          created++;
        }
        
        console.log(`  ✓ ${student.Nome} (${email})`);
        
      } catch (error) {
        console.error(`  ✗ Erro ao sincronizar ${student.Nome}:`, error.message);
        errors++;
      }
    }
    
    await connection.end();
    
    console.log('\n📊 Resultado da sincronização:');
    console.log(`  - Criados: ${created}`);
    console.log(`  - Atualizados: ${updated}`);
    console.log(`  - Erros: ${errors}`);
    console.log(`  - Total: ${activeStudents.length}`);
    
  } catch (error) {
    console.error('\n❌ Erro na sincronização:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

syncSponteStudents();
