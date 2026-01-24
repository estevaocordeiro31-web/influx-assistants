import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.CENTRAL_DATABASE_URL);
const [cols] = await connection.execute('SHOW COLUMNS FROM students');
console.log('Colunas da tabela students:');
cols.forEach(c => console.log(`- ${c.Field} (${c.Type})`));
await connection.end();
