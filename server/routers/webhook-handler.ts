import { Request, Response } from 'express';
import crypto from 'crypto';
import { getDb } from '../db';
import { studentTopicProgress } from '../../drizzle/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Webhook Handler para sincronização com Dashboard
 */

interface WebhookPayload {
  type: 'student_added' | 'grade_updated' | 'attendance_recorded';
  data: Record<string, any>;
  signature?: string;
  timestamp?: number;
}

/**
 * Validar assinatura HMAC-SHA256 do webhook
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

/**
 * Handler para evento: Aluno Adicionado
 */
async function handleStudentAdded(data: any) {
  try {
    console.log('[Webhook] Aluno adicionado:', data);
    // Aqui você pode sincronizar dados do aluno
    return { success: true, message: 'Aluno sincronizado com sucesso' };
  } catch (error) {
    console.error('[Webhook] Erro ao processar aluno adicionado:', error);
    throw error;
  }
}

/**
 * Handler para evento: Nota Atualizada
 */
async function handleGradeUpdated(data: any) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database não disponível');

    const { studentId, topicId, topicName, grade, category } = data;

    console.log('[Webhook] Nota atualizada:', { studentId, topicId, grade });

    const progressPercentage = Math.round(grade);

    // Verificar se já existe
    const existing = await db
      .select()
      .from(studentTopicProgress)
      .where(
        and(
          eq(studentTopicProgress.studentId, studentId),
          eq(studentTopicProgress.topicId, topicId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Atualizar progresso existente
      await db
        .update(studentTopicProgress)
        .set({
          progressPercentage,
          completed: progressPercentage === 100,
          completedAt: progressPercentage === 100 ? new Date() : null,
          lastAccessedAt: new Date(),
        })
        .where(
          and(
            eq(studentTopicProgress.studentId, studentId),
            eq(studentTopicProgress.topicId, topicId)
          )
        );
    } else {
      // Inserir novo progresso
      await db.insert(studentTopicProgress).values({
        studentId,
        topicId,
        topicName,
        category,
        progressPercentage,
        completed: progressPercentage === 100,
        completedAt: progressPercentage === 100 ? new Date() : null,
      });
    }

    return { success: true, message: `Progresso atualizado: ${progressPercentage}%` };
  } catch (error) {
    console.error('[Webhook] Erro ao processar nota atualizada:', error);
    throw error;
  }
}

/**
 * Handler para evento: Presença Registrada
 */
async function handleAttendanceRecorded(data: any) {
  try {
    console.log('[Webhook] Presença registrada:', data);
    // Aqui você pode registrar presença do aluno
    return { success: true, message: 'Presença registrada com sucesso' };
  } catch (error) {
    console.error('[Webhook] Erro ao processar presença:', error);
    throw error;
  }
}

/**
 * Endpoint principal para receber webhooks
 */
export async function handleWebhook(req: Request, res: Response) {
  try {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-webhook-signature'] as string;
    const webhookSecret = process.env.WEBHOOK_SECRET || 'default-secret';

    // Validar assinatura (se fornecida)
    if (signature) {
      if (!validateWebhookSignature(payload, signature, webhookSecret)) {
        console.warn('[Webhook] Assinatura inválida');
        return res.status(401).json({ error: 'Assinatura de webhook inválida' });
      }
    }

    const webhookData: WebhookPayload = req.body;

    console.log('[Webhook] Recebido evento:', webhookData.type);

    let result;

    switch (webhookData.type) {
      case 'student_added':
        result = await handleStudentAdded(webhookData.data);
        break;
      case 'grade_updated':
        result = await handleGradeUpdated(webhookData.data);
        break;
      case 'attendance_recorded':
        result = await handleAttendanceRecorded(webhookData.data);
        break;
      default:
        return res.status(400).json({ error: 'Tipo de evento desconhecido' });
    }

    console.log('[Webhook] Evento processado com sucesso:', webhookData.type);

    res.json({
      success: true,
      message: result.message,
      type: webhookData.type,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[Webhook] Erro ao processar webhook:', error);
    res.status(500).json({
      error: 'Erro ao processar webhook',
      message: error instanceof Error ? error.message : 'Desconhecido',
    });
  }
}

/**
 * Health check para webhook
 */
export async function webhookHealthCheck(req: Request, res: Response) {
  try {
    const db = await getDb();

    if (!db) {
      return res.status(503).json({
        status: 'error',
        message: 'Database não disponível',
      });
    }

    res.json({
      status: 'healthy',
      message: 'Webhook sincronizado e pronto para receber eventos',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Desconhecido',
    });
  }
}
