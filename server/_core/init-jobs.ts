/**
 * Initialize background jobs
 */

import { startDailySyncJob } from '../jobs/daily-sync';
import { startWhatsAppNotifications } from '../jobs/whatsapp-notifications';

export function initializeJobs() {
  console.log('[Jobs] Inicializando jobs em background...');

  // Iniciar job de sincronização diária às 18h
  startDailySyncJob();

  // WhatsApp notifications via BRAiN (Elie): 09:00 milestones + 18:00 study reminders
  startWhatsAppNotifications();

  console.log('[Jobs] Todos os jobs foram inicializados');
}
