/**
 * Tiago Page
 * 
 * Página personalizada para Tiago Laerte Marques
 * Médico, Book 2 (Elementary), objetivo: Career
 */

import React from 'react';
import { TiagoPersonalizedTabs } from '@/components/TiagoPersonalizedTabs';

export function TiagoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <TiagoPersonalizedTabs />
    </div>
  );
}

export default TiagoPage;
