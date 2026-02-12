/**
 * Tiago Page
 * 
 * Página personalizada para Tiago Laerte Marques
 * Médico, Book 2 (Elementary), objetivo: Career
 */

import React, { useEffect } from 'react';
import { TiagoPersonalizedTabs } from '@/components/TiagoPersonalizedTabs';
import { CreateTiagoUser } from '@/components/CreateTiagoUser';
import { ProgressTracker, ProgressSummary } from '@/components/ProgressTracker';
import { trpc } from '@/lib/trpc';

export function TiagoPage() {
  const { data: user } = trpc.auth.me.useQuery();
  const isTiago = user?.email === 'tiago.laerte@icloud.com';
  const utils = trpc.useUtils();

  // Polling de progresso a cada 30 segundos
  useEffect(() => {
    if (!isTiago) return;

    const interval = setInterval(() => {
      // Invalidar cache para forçar refetch
      utils.progressTracker.getProgressSummary.invalidate();
      utils.progressTracker.getCategoryProgress.invalidate({ category: 'professional' });
      utils.progressTracker.getCategoryProgress.invalidate({ category: 'traveller' });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isTiago, utils]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Resumo de Progresso Geral */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Seu Progresso</h2>
          <ProgressSummary />
        </div>

        {/* Progresso Profissional */}
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3">Módulo Profissional</h3>
          <ProgressTracker category="professional" title="Medical English" showDetails={true} />
        </div>

        {/* Progresso Traveller */}
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3">Módulo Viajante</h3>
          <ProgressTracker category="traveller" title="Travel English" showDetails={true} />
        </div>

        {/* Abas Personalizadas */}
        <div className="mt-12">
          <TiagoPersonalizedTabs />
        </div>

        {/* Botão de Criar Usuário (apenas para admin) */}
        {user && !isTiago && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Criar Acesso para Tiago</h3>
            <p className="text-yellow-800 mb-4">Se você é administrador, clique no botão abaixo para criar o usuário Tiago Laerte Marques com acesso personalizado.</p>
            <CreateTiagoUser />
          </div>
        )}
      </div>
    </div>
  );
}

export default TiagoPage;
