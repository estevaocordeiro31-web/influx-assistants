import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const LOCAL_DB_URL = process.env.DATABASE_URL;
const CARLOS_STUDENT_ID = 19; // Já existe no banco centralizado
const DIEGO_STUDENT_ID = 30010; // Já existe no banco centralizado

async function createUsers() {
  console.log('🔄 Criando usuários locais para Carlos e Diego...\n');

  const localConn = await mysql.createConnection(LOCAL_DB_URL);

  try {
    // ========== CARLOS ALBERTO ==========
    console.log('👨‍🎓 Criando usuário local para CARLOS ALBERTO...');
    
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
      CARLOS_STUDENT_ID
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${carlosUserResult.insertId})`);
    console.log(`   🔑 Senha: ${carlosPassword}`);
    console.log(`   🔗 Token: ${carlosToken}\n`);

    // ========== DIEGO BIM ==========
    console.log('👨‍💼 Criando usuário local para DIEGO BIM...');
    
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
      DIEGO_STUDENT_ID
    ]);
    
    console.log(`   ✅ Usuário local criado (ID: ${diegoUserResult.insertId})`);
    console.log(`   🔑 Senha: ${diegoPassword}`);
    console.log(`   🔗 Token: ${diegoToken}\n`);

    // ========== RESUMO ==========
    console.log('='.repeat(70));
    console.log('✅ USUÁRIOS CRIADOS COM SUCESSO!');
    console.log('='.repeat(70));
    
    console.log('\n📊 CARLOS ALBERTO PIRANI JÚNIOR:');
    console.log(`   • Email: carlos_junior_707@hotmail.com`);
    console.log(`   • Senha: ${carlosPassword}`);
    console.log(`   • Matrícula: 6399`);
    console.log(`   • Nível: Book 3`);
    console.log(`   • Login: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/login`);
    console.log(`   • Link Direto: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/${carlosToken}`);
    
    console.log('\n📊 DIEGO BIM (Franqueado Osasco):');
    console.log(`   • Email: direcaoosasco@influx.com.br`);
    console.log(`   • Senha: ${diegoPassword}`);
    console.log(`   • Nível: Book 4 (teste)`);
    console.log(`   • Login: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/login`);
    console.log(`   • Link Direto: https://3000-ika8diba6pltkh83ptna9-1a02583d.us1.manus.computer/api/direct-login/${diegoToken}`);

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await localConn.end();
  }
}

createUsers().catch(console.error);
