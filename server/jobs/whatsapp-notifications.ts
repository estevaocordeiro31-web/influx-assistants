/**
 * WhatsApp Notifications Job — TUTOR → BRAiN (Elie)
 *
 * Sends study reminders, streak milestones, and inactivity alerts
 * to students via Elie's WhatsApp through BRAiN's notification API.
 *
 * Cron: Daily at 18:00 (São Paulo) — lembrete de estudo
 * Cron: Daily at 09:00 (São Paulo) — streak milestones & inactivity alerts
 *
 * BRAiN endpoint: POST https://brain.influxjundiai.com.br/api/tutor-notification
 */

import { getDb } from "../db";
import { sql } from "drizzle-orm";

// BRAiN notification endpoint
const BRAIN_API_URL = process.env.BRAIN_API_URL || "https://brain.influxjundiai.com.br";
const TUTOR_SECRET = process.env.TUTOR_NOTIFICATION_SECRET || "tutor-brain-2026";

let studyReminderTimer: NodeJS.Timeout | null = null;
let milestoneTimer: NodeJS.Timeout | null = null;

interface NotificationPayload {
  phone: string;
  type: string;
  studentName: string;
  data?: Record<string, any>;
}

async function sendToElie(payload: NotificationPayload): Promise<boolean> {
  try {
    const resp = await fetch(`${BRAIN_API_URL}/api/tutor-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tutor-Secret": TUTOR_SECRET,
      },
      body: JSON.stringify(payload),
    });
    const data = await resp.json() as any;
    return data.success === true;
  } catch (e: any) {
    console.error(`[WhatsAppNotif] Failed to send to BRAiN: ${e.message}`);
    return false;
  }
}

/**
 * Send study reminders to students who haven't studied today.
 * Runs daily at 18:00.
 */
async function sendStudyReminders(): Promise<void> {
  console.log("[WhatsAppNotif] 📚 Sending study reminders...");
  const db = getDb();
  if (!db) return;

  try {
    // Find students with phone who haven't had activity today
    const rows = await db.execute(sql`
      SELECT u.id, u.name, u.phone, sp.streak_days, sp.last_activity_at
      FROM users u
      JOIN student_profiles sp ON sp.user_id = u.id
      WHERE u.phone IS NOT NULL
        AND u.phone != ''
        AND u.role = 'user'
        AND (sp.last_activity_at IS NULL OR sp.last_activity_at < CURDATE())
      LIMIT 50
    `) as any[];
    const students = Array.isArray(rows[0]) ? rows[0] : rows;

    if (students.length === 0) {
      console.log("[WhatsAppNotif] No students to remind today.");
      return;
    }

    let sent = 0;
    for (const student of students) {
      const success = await sendToElie({
        phone: student.phone,
        type: "study_reminder",
        studentName: student.name?.split(" ")[0] || "Aluno",
      });
      if (success) sent++;
      // Rate limit: 1 msg per second
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`[WhatsAppNotif] ✅ Study reminders: ${sent}/${students.length} sent`);
  } catch (e: any) {
    console.error("[WhatsAppNotif] Study reminders error:", e.message);
  }
}

/**
 * Check and notify streak milestones and inactivity.
 * Runs daily at 09:00.
 */
async function checkMilestonesAndInactivity(): Promise<void> {
  console.log("[WhatsAppNotif] 🔥 Checking milestones & inactivity...");
  const db = getDb();
  if (!db) return;

  try {
    // Streak milestones: 7, 14, 30, 60, 100, 365 days
    const milestones = [7, 14, 30, 60, 100, 365];
    const milestoneRows = await db.execute(sql`
      SELECT u.id, u.name, u.phone, sp.streak_days
      FROM users u
      JOIN student_profiles sp ON sp.user_id = u.id
      WHERE u.phone IS NOT NULL
        AND u.phone != ''
        AND u.role = 'user'
        AND sp.streak_days IN (7, 14, 30, 60, 100, 365)
    `) as any[];
    const milestoneStudents = Array.isArray(milestoneRows[0]) ? milestoneRows[0] : milestoneRows;

    for (const student of milestoneStudents) {
      await sendToElie({
        phone: student.phone,
        type: "streak_milestone",
        studentName: student.name?.split(" ")[0] || "Aluno",
        data: { days: student.streak_days },
      });
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Inactivity alerts: students inactive for 3+ days
    const inactiveRows = await db.execute(sql`
      SELECT u.id, u.name, u.phone, sp.last_activity_at,
             DATEDIFF(NOW(), sp.last_activity_at) as days_inactive
      FROM users u
      JOIN student_profiles sp ON sp.user_id = u.id
      WHERE u.phone IS NOT NULL
        AND u.phone != ''
        AND u.role = 'user'
        AND sp.last_activity_at IS NOT NULL
        AND sp.last_activity_at < DATE_SUB(NOW(), INTERVAL 3 DAY)
        AND sp.last_activity_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
      LIMIT 30
    `) as any[];
    const inactiveStudents = Array.isArray(inactiveRows[0]) ? inactiveRows[0] : inactiveRows;

    for (const student of inactiveStudents) {
      await sendToElie({
        phone: student.phone,
        type: "inactivity_alert",
        studentName: student.name?.split(" ")[0] || "Aluno",
        data: { days: student.days_inactive },
      });
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(
      `[WhatsAppNotif] ✅ Milestones: ${milestoneStudents.length} | Inactivity: ${inactiveStudents.length}`
    );
  } catch (e: any) {
    console.error("[WhatsAppNotif] Milestones/inactivity error:", e.message);
  }
}

/**
 * Schedule-based runner using setInterval + hour check
 */
function scheduleDaily(hour: number, fn: () => Promise<void>, label: string): NodeJS.Timeout {
  // Check every 30 minutes if it's the right time
  let lastRunDate = "";
  return setInterval(() => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    );
    const currentHour = now.getHours();
    const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hour}`;

    if (currentHour === hour && lastRunDate !== dateKey) {
      lastRunDate = dateKey;
      console.log(`[WhatsAppNotif] ⏰ Running ${label} (${hour}h BRT)`);
      fn().catch((e) => console.error(`[WhatsAppNotif] ${label} error:`, e.message));
    }
  }, 30 * 60 * 1000); // Check every 30 min
}

/**
 * Start all WhatsApp notification jobs
 */
export function startWhatsAppNotifications(): void {
  // Study reminders at 18:00 BRT
  studyReminderTimer = scheduleDaily(18, sendStudyReminders, "study-reminders");

  // Milestones & inactivity at 09:00 BRT
  milestoneTimer = scheduleDaily(9, checkMilestonesAndInactivity, "milestones");

  console.log("[WhatsAppNotif] ✅ Jobs agendados: 09:00 (milestones) + 18:00 (study reminders)");
}

/**
 * Stop all WhatsApp notification jobs
 */
export function stopWhatsAppNotifications(): void {
  if (studyReminderTimer) { clearInterval(studyReminderTimer); studyReminderTimer = null; }
  if (milestoneTimer) { clearInterval(milestoneTimer); milestoneTimer = null; }
  console.log("[WhatsAppNotif] ⏹️ Jobs parados");
}

/**
 * Manual triggers for testing
 */
export { sendStudyReminders, checkMilestonesAndInactivity, sendToElie };
