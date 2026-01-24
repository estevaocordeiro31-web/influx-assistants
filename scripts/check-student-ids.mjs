/**
 * Verificar se student_id está populado na tabela users local
 */

import mysql from 'mysql2/promise';

const LOCAL_DB_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🔍 Verificando student_ids na tabela users local...\n');
  
  const conn = await mysql.createConnection(LOCAL_DB_URL);
  
  try {
    // Verificar estrutura da tabela
    const [columns] = await conn.query(`
      SHOW COLUMNS FROM users
    `);
    
    console.log('📋 Colunas da tabela users:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Buscar usuários das alunas
    console.log('\n👥 Usuários cadastrados:');
    const [users] = await conn.query(`
      SELECT id, name, email, student_id, role, status
      FROM users
      WHERE email IN ('lais.gambini@example.com', 'camiladarosa@outlook.com')
    `);
    
    if (users.length === 0) {
      console.log('   ❌ Nenhum usuário encontrado com esses emails');
    } else {
      users.forEach(user => {
        console.log(`\n   📝 ${user.name}:`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Student ID: ${user.student_id || '❌ NULL'}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      Status: ${user.status}`);
      });
    }
    
    // Verificar se coluna student_id existe
    const hasStudentId = columns.some(col => col.Field === 'student_id');
    
    if (!hasStudentId) {
      console.log('\n⚠️  PROBLEMA: Coluna student_id não existe na tabela users local!');
      console.log('   Solução: Adicionar coluna student_id à tabela users local');
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await conn.end();
  }
}

main().catch(console.error);
