const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL || '');

  // Verificar coluna de senha
  const [cols] = await conn.execute('DESCRIBE users');
  const passwordCol = cols.find(c => c.Field.toLowerCase().includes('password'));
  console.log('Coluna de senha no banco:', passwordCol ? passwordCol.Field : 'NÃO ENCONTRADA');

  // Buscar usuário admin
  const [rows] = await conn.execute(
    `SELECT id, name, email, role, ${passwordCol ? passwordCol.Field : 'password_hash'} as pwd FROM users WHERE email = ?`,
    ['estevaocordeiro31@gmail.com']
  );

  if (rows.length === 0) {
    console.log('ERRO: Usuário não encontrado!');
    await conn.end();
    return;
  }

  const user = rows[0];
  console.log('Usuário:', user.name, '|', user.email, '|', user.role);
  console.log('Tem senha:', !!user.pwd);

  if (user.pwd) {
    const isValid = await bcrypt.compare('inFlux@2026', user.pwd);
    console.log('Senha "inFlux@2026" válida:', isValid);
    
    if (!isValid) {
      console.log('Redefinindo senha...');
      const newHash = await bcrypt.hash('inFlux@2026', 10);
      const colName = passwordCol ? passwordCol.Field : 'password_hash';
      await conn.execute(`UPDATE users SET ${colName} = ? WHERE id = ?`, [newHash, user.id]);
      console.log('✅ Senha redefinida com sucesso!');
    }
  } else {
    console.log('Sem senha - definindo agora...');
    const newHash = await bcrypt.hash('inFlux@2026', 10);
    const colName = passwordCol ? passwordCol.Field : 'password_hash';
    await conn.execute(`UPDATE users SET ${colName} = ? WHERE id = ?`, [newHash, user.id]);
    console.log('✅ Senha definida com sucesso!');
  }

  // Verificar como o router de auth busca a senha
  const [authRows] = await conn.execute(
    `SELECT id, name, email, role, ${passwordCol ? passwordCol.Field : 'password_hash'} as pwd FROM users WHERE email = ?`,
    ['estevaocordeiro31@gmail.com']
  );
  const authUser = authRows[0];
  const finalCheck = await bcrypt.compare('inFlux@2026', authUser.pwd);
  console.log('Verificação final:', finalCheck ? '✅ OK' : '❌ FALHOU');

  await conn.end();
}

main().catch(e => console.error('Erro:', e.message));
