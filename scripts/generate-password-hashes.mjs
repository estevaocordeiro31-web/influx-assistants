/**
 * Script para gerar hashes de senhas
 * Uso: node scripts/generate-password-hashes.mjs
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Senhas das alunas
const passwords = {
  lais: 'Lais@2026',
  camila: 'Camila@2026',
};

async function generateHashes() {
  console.log('🔐 Gerando hashes de senhas...\n');

  for (const [name, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(`${name}:`);
    console.log(`  Senha: ${password}`);
    console.log(`  Hash: ${hash}\n`);
  }

  console.log('✅ Hashes gerados com sucesso!');
}

generateHashes().catch(console.error);
