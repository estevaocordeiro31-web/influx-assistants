import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

// Schemas de validação para webhooks
const WebhookEventSchema = z.object({
  event_type: z.enum([
    "student_sync",
    "calendar_event",
    "message",
    "news",
    "grade_posted",
    "attendance_recorded",
  ]),
  student_id: z.number().positive(),
  timestamp: z.string().datetime(),
  data: z.record(z.any()),
});

const QuizCompletedEventSchema = z.object({
  event_type: z.literal("quiz_completed"),
  student_id: z.number().positive(),
  timestamp: z.string().datetime(),
  data: z.object({
    quiz_id: z.string(),
    quiz_title: z.string(),
    score: z.number().min(0).max(100),
    total_questions: z.number().positive(),
    correct_answers: z.number().non_negative(),
    time_spent: z.number().positive(),
    passed: z.boolean(),
    points_earned: z.number().non_negative(),
  }),
});

const CalendarEventSchema = z.object({
  event_type: z.literal("calendar_event"),
  student_id: z.number().positive(),
  timestamp: z.string().datetime(),
  data: z.object({
    event_id: z.string(),
    event_title: z.string(),
    event_type: z.enum(["class", "assignment", "exam", "holiday", "event"]),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    teacher: z.string().optional(),
  }),
});

const MessageEventSchema = z.object({
  event_type: z.literal("message"),
  student_id: z.number().positive(),
  timestamp: z.string().datetime(),
  data: z.object({
    message_id: z.string(),
    sender: z.string(),