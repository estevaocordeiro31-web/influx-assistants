import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'influx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {},
});

async function createAdmin() {
  const connection = await pool.getConnection();

  try {
    const email = 'direcaojundiairetiro@influx.com.br';
    const password = 'inFlux123';
    const name = 'Adm inFlux';
    const openId = `admin-${Date.now()}`;

    // Nota: Senha armazenada em texto plano para teste
    // Em produção, usar bcrypt ou outro método seguro

    // Verificar se já existe
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('❌ Admin já existe com este email');
      return;
    }

    // Criar admin
    const [result] = await connection.query(
      'INSERT INTO users (openId, name, email, role, status, loginMethod, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
      [openId, name, email, 'admin', 'ativo', 'oauth']
    );

    const adminId = result.insertId;

    console.log('✅ Admin criado com sucesso!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 Nome:', name);
    console.log('🆔 ID:', adminId);
    console.log('');
    console.log('💡 Nota: O login é feito via OAuth Manus. Este admin foi criado no banco de dados.');
    console.log('   Para testar, você pode usar o email acima para fazer login.');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

createAdmin();
