import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL);
const [columns] = await conn.query('DESCRIBE students');
console.log('Colunas da tabela students:');
columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
await conn.end();
