#!/usr/bin/env node

/**
 * Script para gerar link personalizado para Fabio (teste)
 * Uso: node scripts/generate-fabio-link.mjs
 */

import { createPersonalizedLink } from '../server/personalized-access.js';

// Fabio é um aluno de teste
const fabioStudentId = 1; // Será sincronizado do Sponte

async function generateFabioLink() {
  try {
    console.log('🔗 Gerando link personalizado para Fabio...');
    const link = await createPersonalizedLink(fabioStudentId);
    
    console.log('\n✅ Link gerado com sucesso!\n');
    console.log(`📧 Email: fabio_hk@hotmail.com`);
    console.log(`🔗 Link: http://localhost:3000/access/${link.linkHash}`);
    console.log(`⏰ Válido até: ${link.expiresAt.toLocaleDateString('pt-BR')}`);
    console.log(`\n📋 URL completa para compartilhar:`);
    console.log(`${process.env.VITE_APP_URL || 'http://localhost:3000'}/access/${link.linkHash}`);
  } catch (error) {
    console.error('❌ Erro ao gerar link:', error);
    process.exit(1);
  }
}

generateFabioLink();
