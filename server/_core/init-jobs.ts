/**
 * Initialize background jobs
 */

import { startDailySyncJob } from '../jobs/daily-sync';

export function initializeJobs() {
  console.log('[Jobs] Inicializando jobs em background...');
  
  // Iniciar job de sincronização diária às 18h
  startDailySyncJob();
  
  console.log('[Jobs] Todos os jobs foram inicializados');
}
