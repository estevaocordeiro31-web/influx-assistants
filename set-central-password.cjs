const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function main() {
  // Conectar ao banco CENTRAL (onde o login busca)
  const centralConn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL || '');
  
  // Verificar estrutura da tabela users no banco central
  const [cols] = await centralConn.execute('DESCRIBE users');
  const passwordCol = cols.find(c => c.Field.toLowerCase().includes('password'));
  console.log('Coluna de senha no banco CENTRAL:', passwordCol ? passwordCol.Field : 'NÃO ENCONTRADA');
  
  if (!passwordCol) {
    console.log('Colunas disponíveis:', cols.map(c => c.Field).join(', '));
    await centralConn.end();
    return;
  }

  const colName = passwordCol.Field;

  // Verificar usuário admin no banco central
  const [rows] = await centralConn.execute(
    `SELECT id, name, email, role, ${colName} as pwd FROM users WHERE email = ?`,
    ['estevaocordeiro31@gmail.com']
  );

  if (rows.length === 0) {
    console.log('Usuário NÃO encontrado no banco central!');
    // Listar admins disponíveis
    const [admins] = await centralConn.execute('SELECT id, name, email, role FROM users WHERE role = "admin" LIMIT 5');
    console.log('Admins no banco central:', JSON.stringify(admins, null, 2));
    await centralConn.end();
    return;
  }

  const user = rows[0];
  console.log('Usuário no banco central:', user.name, '|', user.email, '|', user.role);
  console.log('Tem senha:', !!user.pwd);

  // Definir/atualizar senha
  const newHash = await bcrypt.hash('inFlux@2026', 10);
  await centralConn.execute(`UPDATE users SET ${colName} = ? WHERE email = ?`, [newHash, 'estevaocordeiro31@gmail.com']);
  console.log('✅ Senha definida no banco CENTRAL para Estevao!');

  // Fazer o mesmo para o segundo admin
  await centralConn.execute(`UPDATE users SET ${colName} = ? WHERE email = ?`, [newHash, 'direcaojundiairetiro@influx.com.br']);
  console.log('✅ Senha definida no banco CENTRAL para Adm inFlux!');

  // Verificação final
  const [check] = await centralConn.execute(
    `SELECT ${colName} as pwd FROM users WHERE email = ?`,
    ['estevaocordeiro31@gmail.com']
  );
  const valid = await bcrypt.compare('inFlux@2026', check[0].pwd);
  console.log('Verificação final:', valid ? '✅ Login vai funcionar!' : '❌ Ainda com problema');

  await centralConn.end();
}

main().catch(e => console.error('Erro:', e.message, e.stack));
