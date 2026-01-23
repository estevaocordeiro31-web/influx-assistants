#!/usr/bin/env tsx

/**
 * Script para gerar link personalizado para Fabio (teste)
 * Uso: pnpm tsx scripts/generate-fabio-link.ts
 */

import { getDb } from '../server/db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { createPersonalizedLink } from '../server/personalized-access';

async function generateFabioLink() {
  try {
    console.log('🔗 Gerando link personalizado para Fabio...\n');
    
    const db = await getDb();
    if (!db) {
      throw new Error('Falha ao conectar ao banco de dados');
    }

    // Buscar Fabio no banco de dados
    const fabioUser = await db
      .select()
      .from(users)
      .where(eq(users.email, 'fabio_hk@hotmail.com'))
      .limit(1);

    if (!fabioUser || fabioUser.length === 0) {
      console.log('❌ Fabio não encontrado no banco de dados');
      console.log('📝 Criando usuário Fabio...\n');
      
      // Criar usuário Fabio
      const result = await db.insert(users).values({
        openId: `fabio_${Date.now()}`,
        name: 'Fabio',
        email: 'fabio_hk@hotmail.com',
        loginMethod: 'oauth',
        role: 'student',
      });

      console.log('✅ Usuário Fabio criado com sucesso!\n');
    
    // Aguardar um pouco para garantir que o usuário foi criado
    await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Buscar novamente para pegar o ID
    const fabio = await db
      .select()
      .from(users)
      .where(eq(users.email, 'fabio_hk@hotmail.com'))
      .limit(1);

    if (!fabio || fabio.length === 0) {
      throw new Error('Falha ao encontrar usuário Fabio após criação');
    }

    const fabioId = (fabio[0] as any).id;
    console.log(`📌 ID do Fabio: ${fabioId}`);
    console.log(`📧 Email: fabio_hk@hotmail.com\n`);

    // Gerar link personalizado
    const link = await createPersonalizedLink(fabioId);
    
    console.log('✅ Link gerado com sucesso!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔗 LINK PERSONALIZADO PARA FABIO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\n📋 URL para compartilhar:\n`);
    console.log(`${process.env.VITE_APP_URL || 'http://localhost:3000'}/access/${link.linkHash}\n`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`⏰ Válido até: ${link.expiresAt.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`);
    console.log(`🔐 Hash: ${link.linkHash}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📝 Instruções para Fabio:');
    console.log('1. Clique no link acima');
    console.log('2. Você será redirecionado automaticamente para o dashboard');
    console.log('3. Não é necessário fazer login - o link valida automaticamente');
    console.log('4. O link é válido por 7 meses\n');

  } catch (error) {
    console.error('❌ Erro ao gerar link:', error);
    process.exit(1);
  }
}

generateFabioLink();
