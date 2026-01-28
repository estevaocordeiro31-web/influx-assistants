/**
 * Script para gerar e inserir senhas para todos os usuários
 * Padrão: PrimeiroNome@2026
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const CENTRAL_DATABASE_URL = process.env.CENTRAL_DATABASE_URL;

if (!CENTRAL_DATABASE_URL) {
  console.error('CENTRAL_DATABASE_URL não definida');
  process.exit(1);
}

async function main() {
  console.log('🔐 Conectando ao banco centralizado...');
  const connection = await mysql.createConnection(CENTRAL_DATABASE_URL);
  
  try {
    // Buscar todos os usuários com role 'user' que não têm senha
    const [users] = await connection.execute(
      "SELECT id, name, email FROM users WHERE role = 'user' ORDER BY id"
    );
    
    console.log(`📋 Encontrados ${users.length} usuários para processar\n`);
    
    const results = [];
    
    for (const user of users) {
      // Extrair primeiro nome
      const firstName = user.name ? user.name.split(' ')[0] : 'User';
      
      // Gerar senha no padrão PrimeiroNome@2026
      const password = `${firstName}@2026`;
      
      // Gerar hash bcrypt
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Atualizar no banco
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [passwordHash, user.id]
      );
      
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
        password: password
      });
      
      console.log(`✅ ${user.name} (${user.email}): ${password}`);
    }
    
    console.log(`\n🎉 ${results.length} senhas geradas e inseridas com sucesso!`);
    
    // Salvar credenciais em arquivo
    const credentialsContent = results.map(r => 
      `- **${r.name}** (${r.email}): \`${r.password}\``
    ).join('\n');
    
    console.log('\n📄 Credenciais geradas:');
    console.log(credentialsContent);
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
