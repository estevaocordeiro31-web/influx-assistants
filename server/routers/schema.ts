import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, date, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  studentId: varchar("student_id", { length: 20 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  avatarUrl: text("avatarUrl"),
  role: mysqlEnum("role", ["user", "admin", "owner", "teacher"]).default("user").notNull(),
  unidadeId: int("unidade_id").notNull().default(1),
  status: mysqlEnum("status", ["ativo", "inativo", "desistente", "trancado"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  mustChangePassword: boolean("must_change_password").default(false).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Student profiles table
export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  objective: mysqlEnum("objective", ["career", "travel", "studies", "other"]).notNull(),
  currentLevel: mysqlEnum("current_level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).default("beginner").notNull(),
  totalHoursLearned: int("total_hours_learned").default(0).notNull(),
  streakDays: int("streak_days").default(0).notNull(),
  lastActivityAt: timestamp("last_activity_at"),
  
  // Detailed profile information
  studyDurationYears: decimal("study_duration_years", { precision: 3, scale: 1 }),
  studyDurationMonths: int("study_duration_months"),
  specificGoals: text("specific_goals"),
  discomfortAreas: text("discomfort_areas"),
  comfortAreas: text("comfort_areas"),
  englishConsumptionSources: json("english_consumption_sources"),
  improvementAreas: text("improvement_areas"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

// Chunks library table
export const chunks = mysqlTable("chunks", {
  id: int("id").autoincrement().primaryKey(),
  englishChunk: text("english_chunk").notNull(),
  portugueseEquivalent: text("portuguese_equivalent").notNull(),
  level: mysqlEnum("level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  context: mysqlEnum("context", ["career", "travel", "studies", "daily_life", "general"]).notNull(),
  example: text("example"),
  nativeUsageFrequency: mysqlEnum("native_usage_frequency", ["very_common", "common", "occasional", "rare"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Chunk = typeof chunks.$inferSelect;
export type InsertChunk = typeof chunks.$inferInsert;

// Conversations table
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  simulationType: mysqlEnum("simulation_type", ["career", "travel", "studies", "free_chat", "pronunciation_practice"]).notNull(),
  title: varchar("title", { length: 255 }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages table
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversation_id").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  chunksUsed: json("chunks_used"),
  audioUrl: varchar("audio_url", { length: 512 }),
  audioTranscription: text("audio_transcription"),
  pronunciationScore: decimal("pronunciation_score", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Student progress on chunks
export const studentChunkProgress = mysqlTable("student_chunk_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  masteryLevel: mysqlEnum("mastery_level", ["not_started", "learning", "practicing", "mastered"]).default("not_started").notNull(),
  correctAnswers: int("correct_answers").default(0).notNull(),
  totalAttempts: int("total_attempts").default(0).notNull(),
  lastPracticedAt: timestamp("last_practiced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentChunkProgress = typeof studentChunkProgress.$inferSelect;
export type InsertStudentChunkProgress = typeof studentChunkProgress.$inferInsert;

// Exercises table
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  chunkId: int("chunk_id").notNull(),
  level: mysqlEnum("level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  exerciseType: mysqlEnum("exercise_type", ["fill_blank", "multiple_choice", "translation", "sentence_building", "conversation"]).notNull(),
  question: text("question").notNull(),
  options: json("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

// Student exercise results
export const exerciseResults = mysqlTable("exercise_results", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  exerciseId: int("exercise_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  studentAnswer: text("student_answer"),
  timeSpentSeconds: int("time_spent_seconds"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExerciseResult = typeof exerciseResults.$inferSelect;
export type InsertExerciseResult = typeof exerciseResults.$inferInsert;

// Alerts for coordinators
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  coordinatorId: int("coordinator_id").notNull(),
  studentId: int("student_id").notNull(),
  alertType: mysqlEnum("alert_type", ["milestone_reached", "recurring_difficulty", "low_engagement", "high_progress"]).notNull(),
  chunkId: int("chunk_id"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;
// Books table (inFlux curriculum)
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  bookId: varchar("book_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  level: mysqlEnum("level", ["starter", "beginner", "elementary", "pre_intermediate", "intermediate", "upper_intermediate", "advanced"]).notNull(),
  category: mysqlEnum("category", ["junior", "regular"]).notNull(),
  stages: int("stages").default(2).notNull(),
  totalUnits: int("total_units").notNull(),
  description: text("description"),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

// Units table (units within each book)
export const units = mysqlTable("units", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("book_id").notNull(),
  unitNumber: int("unit_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  stage: int("stage").notNull(),
  lessons: int("lessons").notNull(),
  description: text("description"),
  learningObjectives: json("learning_objectives"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;

// Chunks by unit table (chunks specific to each unit)
export const chunksByUnit = mysqlTable("chunks_by_unit", {
  id: int("id").autoincrement().primaryKey(),
  unitId: int("unit_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  chunkType: mysqlEnum("chunk_type", ["phrasal_verb", "collocation", "expression", "grammar_structure", "vocabulary_set", "conversational_pattern"]).notNull(),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChunkByUnit = typeof chunksByUnit.$inferSelect;
export type InsertChunkByUnit = typeof chunksByUnit.$inferInsert;

// Student book progress table
export const studentBookProgress = mysqlTable("student_book_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  bookId: int("book_id").notNull(),
  currentUnit: int("current_unit").default(1).notNull(),
  completedUnits: int("completed_units").default(0).notNull(),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentBookProgress = typeof studentBookProgress.$inferSelect;
export type InsertStudentBookProgress = typeof studentBookProgress.$inferInsert;

// Spaced repetition schedule table
export const spacedRepetitionSchedule = mysqlTable("spaced_repetition_schedule", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  chunkId: int("chunk_id").notNull(),
  nextReviewAt: timestamp("next_review_at").notNull(),
  interval: int("interval").default(1).notNull(),
  easeFactor: decimal("ease_factor", { precision: 3, scale: 2 }).default("2.5").notNull(),
  repetitions: int("repetitions").default(0).notNull(),
  lastReviewAt: timestamp("last_review_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SpacedRepetitionSchedule = typeof spacedRepetitionSchedule.$inferSelect;
export type InsertSpacedRepetitionSchedule = typeof spacedRepetitionSchedule.$inferInsert;

// Blog tips badges table
export const blogTipsBadges = mysqlTable("blog_tips_badges", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  badgeName: varchar("badge_name", { length: 100 }).notNull(),
  badgeDescription: text("badge_description").notNull(),
  badgeIcon: varchar("badge_icon", { length: 255 }),
  tipsCompleted: int("tips_completed").default(0).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsBadge = typeof blogTipsBadges.$inferSelect;
export type InsertBlogTipsBadge = typeof blogTipsBadges.$inferInsert;

// Blog tips favorites table
export const blogTipsFavorites = mysqlTable("blog_tips_favorites", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tipId: varchar("tip_id", { length: 255 }).notNull(),
  tipTitle: varchar("tip_title", { length: 255 }).notNull(),
  tipCategory: varchar("tip_category", { length: 100 }).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsFavorite = typeof blogTipsFavorites.$inferSelect;
export type InsertBlogTipsFavorite = typeof blogTipsFavorites.$inferInsert;

// Blog tips feedback table
export const blogTipsFeedback = mysqlTable("blog_tips_feedback", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tipId: varchar("tip_id", { length: 255 }).notNull(),
  tipTitle: varchar("tip_title", { length: 255 }).notNull(),
  feedback: mysqlEnum("feedback", ["useful", "not_useful"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogTipsFeedback = typeof blogTipsFeedback.$inferSelect;
export type InsertBlogTipsFeedback = typeof blogTipsFeedback.$inferInsert;


// ==================== LINKS PERSONALIZADOS E MATERIAIS ====================
// Personalized links for student access
export const personalizedLinks = mysqlTable("personalized_links", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  linkHash: varchar("link_hash", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  accessedAt: timestamp("accessed_at"),
  accessCount: int("access_count").default(0),
  isActive: boolean("is_active").default(true),
});

export type PersonalizedLink = typeof personalizedLinks.$inferSelect;
export type InsertPersonalizedLink = typeof personalizedLinks.$inferInsert;

// Exclusive materials table
export const exclusiveMaterials = mysqlTable("exclusive_materials", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 512 }).notNull(),
  fileKey: varchar("file_key", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }),
  fileSize: int("file_size"),
  createdBy: int("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
  isActive: boolean("is_active").default(true),
});

export type ExclusiveMaterial = typeof exclusiveMaterials.$inferSelect;
export type InsertExclusiveMaterial = typeof exclusiveMaterials.$inferInsert;

// Material sharing by class
export const materialClassShare = mysqlTable("material_class_share", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("material_id").notNull().references(() => exclusiveMaterials.id),
  classId: int("class_id").notNull(),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});

export type MaterialClassShare = typeof materialClassShare.$inferSelect;
export type InsertMaterialClassShare = typeof materialClassShare.$inferInsert;

// Material sharing by individual student
export const materialStudentShare = mysqlTable("material_student_share", {
  id: int("id").autoincrement().primaryKey(),
  materialId: int("material_id").notNull().references(() => exclusiveMaterials.id),
  studentId: int("student_id").notNull().references(() => users.id),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
  accessedAt: timestamp("accessed_at"),
});

export type MaterialStudentShare = typeof materialStudentShare.$inferSelect;
export type InsertMaterialStudentShare = typeof materialStudentShare.$inferInsert;


// ==================== DADOS DE ALUNOS IMPORTADOS ====================
// Student imported data from external sources (Sponte, etc)
export const studentImportedData = mysqlTable("student_imported_data", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  matricula: varchar("matricula", { length: 50 }).notNull(),
  book: varchar("book", { length: 50 }),
  className: varchar("class_name", { length: 100 }),
  schedule: varchar("schedule", { length: 100 }),
  teacher: varchar("teacher", { length: 100 }),
  
  // Grades data (JSON array of semesters)
  gradesData: json("grades_data"), // [{semester: 1, grade: 8.5, period: "2024-01"}, ...]
  
  // Attendance data (JSON array of semesters)
  attendanceData: json("attendance_data"), // [{semester: 1, rate: 95, absences: 2, period: "2024-01"}, ...]
  
  // Average grade
  averageGrade: decimal("average_grade", { precision: 4, scale: 2 }),
  
  // Overall attendance rate
  overallAttendanceRate: decimal("overall_attendance_rate", { precision: 5, scale: 2 }),
  
  // Notes and observations
  notes: text("notes"),
  
  importedAt: timestamp("imported_at").defaultNow().notNull(),
  importedBy: int("imported_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentImportedData = typeof studentImportedData.$inferSelect;
export type InsertStudentImportedData = typeof studentImportedData.$inferInsert;


// ==================== READING CLUB ====================
// Reading Club posts (compartilhamentos de livros, revistas, gibis, podcasts)
export const readingClubPosts = mysqlTable("rc_posts", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  contentType: mysqlEnum("content_type", ["book", "magazine", "comic", "podcast", "article"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"), // Trecho ou expressão compartilhada
  imageUrl: varchar("image_url", { length: 255 }),
  sourceUrl: varchar("source_url", { length: 255 }),
  notes: text("notes"), // Notas pessoais do aluno
  likes: int("likes").default(0).notNull(),
  commentsCount: int("comments_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ReadingClubPost = typeof readingClubPosts.$inferSelect;
export type InsertReadingClubPost = typeof readingClubPosts.$inferInsert;

// Reading Club comments
export const readingClubComments = mysqlTable("rc_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").notNull().references(() => readingClubPosts.id),
  studentId: int("student_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ReadingClubComment = typeof readingClubComments.$inferSelect;
export type InsertReadingClubComment = typeof readingClubComments.$inferInsert;

// Reading Club badges (Leitor Ativo, Compartilhador, Participante de Evento, etc)
export const readingClubBadges = mysqlTable("rc_badges", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  badgeType: mysqlEnum("badge_type", [
    "active_reader",      // Compartilhou 5+ posts
    "sharer",             // Compartilhou 10+ posts
    "commenter",          // Comentou em 10+ posts
    "event_participant",  // Participou de 1+ evento presencial
    "book_master",        // Completou leitura de um livro
    "weekly_warrior",     // Participou 4+ semanas consecutivas
  ]).notNull(),
  influxDollars: int("influx_dollars").default(10).notNull(), // Recompensa em inFlux Dollars
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export type ReadingClubBadge = typeof readingClubBadges.$inferSelect;
export type InsertReadingClubBadge = typeof readingClubBadges.$inferInsert;

// Reading Club events (encontros presenciais)
export const readingClubEvents = mysqlTable("rc_events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: mysqlEnum("event_type", ["discussion", "dramatization", "book_club", "library_visit"]).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  location: varchar("location", { length: 255 }),
  capacity: int("capacity"),
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ReadingClubEvent = typeof readingClubEvents.$inferSelect;
export type InsertReadingClubEvent = typeof readingClubEvents.$inferInsert;

// Reading Club event participants
export const readingClubEventParticipants = mysqlTable("rc_event_participants", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id").notNull().references(() => readingClubEvents.id),
  studentId: int("student_id").notNull().references(() => users.id),
  attendedAt: timestamp("attended_at"),
  notes: text("notes"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type ReadingClubEventParticipant = typeof readingClubEventParticipants.$inferSelect;
export type InsertReadingClubEventParticipant = typeof readingClubEventParticipants.$inferInsert;

// School library books
export const libraryBooks = mysqlTable("library_books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }),
  language: mysqlEnum("language", ["english", "portuguese", "spanish"]).default("english").notNull(),
  level: mysqlEnum("level", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"]),
  isbn: varchar("isbn", { length: 20 }),
  imageUrl: varchar("image_url", { length: 255 }),
  description: text("description"),
  quantity: int("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export type LibraryBook = typeof libraryBooks.$inferSelect;
export type InsertLibraryBook = typeof libraryBooks.$inferInsert;

// Student library loans
export const libraryLoans = mysqlTable("library_loans", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  bookId: int("book_id").notNull().references(() => libraryBooks.id),
  borrowedAt: timestamp("borrowed_at").defaultNow().notNull(),
  returnedAt: timestamp("returned_at"),
  dueAt: timestamp("due_at"),
});

export type LibraryLoan = typeof libraryLoans.$inferSelect;
export type InsertLibraryLoan = typeof libraryLoans.$inferInsert;

// Student inFlux Dollars balance
export const studentInfluxDollars = mysqlTable("student_influx_dollars", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().unique().references(() => users.id),
  balance: int("balance").default(0).notNull(),
  totalEarned: int("total_earned").default(0).notNull(),
  totalSpent: int("total_spent").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentInfluxDollars = typeof studentInfluxDollars.$inferSelect;
export type InsertStudentInfluxDollars = typeof studentInfluxDollars.$inferInsert;

// inFlux Dollars transactions
export const influxDollarTransactions = mysqlTable("influx_dollar_transactions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", ["earn", "spend"]).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(), // "badge_earned", "reward_redeemed", etc
  relatedId: int("related_id"), // ID da badge ou recompensa
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InfluxDollarTransaction = typeof influxDollarTransactions.$inferSelect;
export type InsertInfluxDollarTransaction = typeof influxDollarTransactions.$inferInsert;


// ==================== VACATION PLUS 2 PROGRESS ====================
// Student progress on Vacation Plus 2 lessons
export const vacationPlus2Progress = mysqlTable("vacation_plus_2_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  lessonNumber: int("lesson_number").notNull(), // 1-8
  sectionCompleted: mysqlEnum("section_completed", [
    "overview",
    "vocabulary",
    "dialogues",
    "cultural_tips",
    "exercises"
  ]),
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0").notNull(),
  vocabularyCompleted: int("vocabulary_completed").default(0).notNull(),
  dialoguesListened: int("dialogues_listened").default(0).notNull(),
  exercisesCompleted: int("exercises_completed").default(0).notNull(),
  culturalTipsViewed: int("cultural_tips_viewed").default(0).notNull(),
  quizScore: int("quiz_score"),
  quizTotal: int("quiz_total"),
  quizPassed: boolean("quiz_passed"),
  lastActivityAt: timestamp("last_activity_at"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type VacationPlus2Progress = typeof vacationPlus2Progress.$inferSelect;
export type InsertVacationPlus2Progress = typeof vacationPlus2Progress.$inferInsert;

// Vacation Plus 2 vocabulary progress (individual words/chunks)
export const vacationPlus2VocabularyProgress = mysqlTable("vacation_plus_2_vocabulary_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  lessonNumber: int("lesson_number").notNull(),
  vocabularyItem: varchar("vocabulary_item", { length: 255 }).notNull(),
  character: mysqlEnum("character", ["lucas", "emily", "aiko"]).notNull(),
  audioListened: boolean("audio_listened").default(false).notNull(),
  markedAsLearned: boolean("marked_as_learned").default(false).notNull(),
  practiceCount: int("practice_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type VacationPlus2VocabularyProgress = typeof vacationPlus2VocabularyProgress.$inferSelect;
export type InsertVacationPlus2VocabularyProgress = typeof vacationPlus2VocabularyProgress.$inferInsert;

// ==================== BOOK 5 LESSONS ====================
// Lessons table (individual lessons within units)
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("book_id").notNull(),
  unitId: int("unit_id").notNull(),
  lessonNumber: int("lesson_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  audioCount: int("audio_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// Lesson vocabulary table
export const lessonVocabulary = mysqlTable("lesson_vocabulary", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lesson_id").notNull(),
  word: varchar("word", { length: 255 }).notNull(),
  portugueseTranslation: text("portuguese_translation"),
  example: text("example"),
  audioUrl: varchar("audio_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LessonVocabulary = typeof lessonVocabulary.$inferSelect;
export type InsertLessonVocabulary = typeof lessonVocabulary.$inferInsert;

// Lesson chunks table
export const lessonChunks = mysqlTable("lesson_chunks", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lesson_id").notNull(),
  expression: varchar("expression", { length: 255 }).notNull(),
  portugueseEquivalent: text("portuguese_equivalent"),
  example: text("example"),
  chunkType: mysqlEnum("chunk_type", ["phrasal_verb", "collocation", "expression", "idiom", "grammar_structure"]).default("expression").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LessonChunk = typeof lessonChunks.$inferSelect;
export type InsertLessonChunk = typeof lessonChunks.$inferInsert;

// Lesson examples table
export const lessonExamples = mysqlTable("lesson_examples", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lesson_id").notNull(),
  sentence: text("sentence").notNull(),
  portugueseTranslation: text("portuguese_translation"),
  audioUrl: varchar("audio_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LessonExample = typeof lessonExamples.$inferSelect;
export type InsertLessonExample = typeof lessonExamples.$inferInsert;

// Vacation Plus 2 dialogue progress
export const vacationPlus2DialogueProgress = mysqlTable("vacation_plus_2_dialogue_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  lessonNumber: int("lesson_number").notNull(),
  dialogueId: varchar("dialogue_id", { length: 100 }).notNull(),
  character: mysqlEnum("character", ["lucas", "emily", "aiko"]).notNull(),
  listenedCount: int("listened_count").default(0).notNull(),
  lastListenedAt: timestamp("last_listened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VacationPlus2DialogueProgress = typeof vacationPlus2DialogueProgress.$inferSelect;
export type InsertVacationPlus2DialogueProgress = typeof vacationPlus2DialogueProgress.$inferInsert;

// ==================== QUIZ RESULTS ====================
// Video quiz results table
export const quizResults = mysqlTable("quiz_results", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  videoId: varchar("video_id", { length: 100 }).notNull(),
  videoTitle: varchar("video_title", { length: 255 }).notNull(),
  score: int("score").notNull(), // 0-100
  totalQuestions: int("total_questions").notNull(),
  correctAnswers: int("correct_answers").notNull(),
  passed: boolean("passed").notNull(), // true if score >= 70%
  pointsEarned: int("points_earned").notNull(), // 10 pontos por quiz
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;

// ==================== LEADERBOARD ====================
// Student leaderboard table
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().unique().references(() => users.id),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  totalPoints: int("total_points").default(0).notNull(),
  quizzesCompleted: int("quizzes_completed").default(0).notNull(),
  lessonsCompleted: int("lessons_completed").default(0).notNull(),
  rank: int("rank").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

// Student points history table
export const pointsHistory = mysqlTable("points_history", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  points: int("points").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(), // "quiz_completed", "lesson_completed", etc
  relatedId: int("related_id"), // ID do quiz ou lição
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PointsHistory = typeof pointsHistory.$inferSelect;
export type InsertPointsHistory = typeof pointsHistory.$inferInsert;


// ==================== CURSOS EXTRAS DO ALUNO ====================
// Student extra courses enrollment (Vacation Plus, Traveler, On Business, Reading Club)
export const studentCourses = mysqlTable("student_courses", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  courseCode: varchar("course_code", { length: 50 }).notNull(), // "vp1", "vp2", "vp3", "vp4", "traveler", "on_business", "reading_club"
  courseName: varchar("course_name", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  enrolledBy: int("enrolled_by").references(() => users.id), // Admin who enrolled the student
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentCourse = typeof studentCourses.$inferSelect;
export type InsertStudentCourse = typeof studentCourses.$inferInsert;


// Student topic progress table - Rastreia progresso em tópicos específicos
export const studentTopicProgress = mysqlTable("student_topic_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  topicId: varchar("topic_id", { length: 100 }).notNull(), // ex: "med-1", "travel-cancun-1"
  topicName: varchar("topic_name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["professional", "traveller", "general"]).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  progressPercentage: int("progress_percentage").default(0).notNull(), // 0-100
  timeSpentMinutes: int("time_spent_minutes").default(0).notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentTopicProgress = typeof studentTopicProgress.$inferSelect;
export type InsertStudentTopicProgress = typeof studentTopicProgress.$inferInsert;


// ==================== VOLTA ÀS AULAS - BACK TO SCHOOL ====================
// Student book history - registro de todos os books que o aluno já cursou
export const studentBookHistory = mysqlTable("student_book_history", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  bookId: int("book_id").notNull().references(() => books.id),
  status: mysqlEnum("status", ["completed", "in_progress", "paused", "abandoned"]).notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  finalGrade: decimal("final_grade", { precision: 3, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentBookHistory = typeof studentBookHistory.$inferSelect;
export type InsertStudentBookHistory = typeof studentBookHistory.$inferInsert;

// Back to school campaign - dados da campanha de volta às aulas
export const backToSchoolCampaign = mysqlTable("back_to_school_campaign", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: varchar("campaign_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: mysqlEnum("status", ["planning", "active", "completed", "archived"]).default("planning").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BackToSchoolCampaign = typeof backToSchoolCampaign.$inferSelect;
export type InsertBackToSchoolCampaign = typeof backToSchoolCampaign.$inferInsert;

// Student enrollment in back to school - matrícula do aluno na campanha
export const studentBackToSchoolEnrollment = mysqlTable("student_back_to_school_enrollment", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull().references(() => backToSchoolCampaign.id),
  studentId: int("student_id").notNull().references(() => users.id),
  currentBook: int("current_book").references(() => books.id),
  previousBooks: json("previous_books"), // [{bookId, name, completedAt}, ...]
  enrollmentStatus: mysqlEnum("enrollment_status", ["enrolled", "pending", "completed", "cancelled"]).default("enrolled").notNull(),
  tempPassword: varchar("temp_password", { length: 255 }),
  accessGrantedAt: timestamp("access_granted_at"),
  accessExpiresAt: timestamp("access_expires_at"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentBackToSchoolEnrollment = typeof studentBackToSchoolEnrollment.$inferSelect;
export type InsertStudentBackToSchoolEnrollment = typeof studentBackToSchoolEnrollment.$inferInsert;

// Back to school sync log - log de sincronização
export const backToSchoolSyncLog = mysqlTable("back_to_school_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull().references(() => backToSchoolCampaign.id),
  syncType: mysqlEnum("sync_type", ["initial_sync", "update", "verification", "report_generation"]).notNull(),
  totalStudents: int("total_students").notNull(),
  successCount: int("success_count").notNull(),
  errorCount: int("error_count").default(0).notNull(),
  errors: json("errors"), // [{studentId, error}, ...]
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BackToSchoolSyncLog = typeof backToSchoolSyncLog.$inferSelect;
export type InsertBackToSchoolSyncLog = typeof backToSchoolSyncLog.$inferInsert;


// ==================== ATIVIDADES ESCOLARES - SCHOOL ACTIVITIES ====================
// Activity tags - tags para categorizar atividades
export const activityTags = mysqlTable("activity_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // ex: "Traveler", "OnBusiness", "Extra"
  color: varchar("color", { length: 7 }).notNull(), // hex color: #FF5733
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type ActivityTag = typeof activityTags.$inferSelect;
export type InsertActivityTag = typeof activityTags.$inferInsert;

// School activities - atividades e aulas da escola
export const schoolActivities = mysqlTable("school_activities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(), // ex: "Traveler - Week 1", "OnBusiness Meeting"
  description: text("description"),
  activityDate: date("activity_date").notNull(), // data da atividade
  startTime: varchar("start_time", { length: 8 }), // HH:MM format
  endTime: varchar("end_time", { length: 8 }), // HH:MM format
  location: varchar("location", { length: 255 }), // local da atividade
  enrollmentLink: varchar("enrollment_link", { length: 500 }), // link para ficha de inscrição/confirmação
  maxParticipants: int("max_participants"), // limite de participantes (null = ilimitado)
  createdBy: int("created_by").notNull().references(() => users.id), // admin que criou
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type SchoolActivity = typeof schoolActivities.$inferSelect;
export type InsertSchoolActivity = typeof schoolActivities.$inferInsert;

// Activity tag associations - relacionamento entre atividades e tags
export const activityTagAssociations = mysqlTable("activity_tag_associations", {
  id: int("id").autoincrement().primaryKey(),
  activityId: int("activity_id").notNull().references(() => schoolActivities.id, { onDelete: "cascade" }),
  tagId: int("tag_id").notNull().references(() => activityTags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ActivityTagAssociation = typeof activityTagAssociations.$inferSelect;
export type InsertActivityTagAssociation = typeof activityTagAssociations.$inferInsert;

// Student activity enrollments - inscrição de alunos em atividades
export const studentActivityEnrollments = mysqlTable("student_activity_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id),
  activityId: int("activity_id").notNull().references(() => schoolActivities.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["pending", "confirmed", "attended", "cancelled", "no_show"]).default("pending").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
  attendedAt: timestamp("attended_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type StudentActivityEnrollment = typeof studentActivityEnrollments.$inferSelect;
export type InsertStudentActivityEnrollment = typeof studentActivityEnrollments.$inferInsert;


// Passport QR Codes table
export const passportQRCodes = mysqlTable("passport_qr_codes", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull(),
  qrCode: longtext("qr_code").notNull(),
  type: mysqlEnum("type", ["checkin", "objectives"]).notNull(),
  checkInData: json("check_in_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PassportQRCode = typeof passportQRCodes.$inferSelect;
export type InsertPassportQRCode = typeof passportQRCodes.$inferInsert;

// Student Objectives table
export const studentObjectives = mysqlTable("student_objectives", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull(),
  objectives: json("objectives").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentObjective = typeof studentObjectives.$inferSelect;
export type InsertStudentObjective = typeof studentObjectives.$inferInsert;


// Extra Exercises table
export const extraExercises = mysqlTable("extra_exercises", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  lessonNumber: int("lesson_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["vocabulary", "grammar", "listening", "reading", "writing", "speaking", "communicative"]).notNull(),
  content: longtext("content").notNull(), // JSON or HTML content
  imageUrl: varchar("image_url", { length: 512 }),
  difficulty: mysqlEnum("difficulty", ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]).default("beginner").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtraExercise = typeof extraExercises.$inferSelect;
export type InsertExtraExercise = typeof extraExercises.$inferInsert;

// Student Exercise Progress table
export const studentExerciseProgress = mysqlTable("student_exercise_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: int("exercise_id").notNull().references(() => extraExercises.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "reviewed"]).default("not_started").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }), // 0-100
  attempts: int("attempts").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StudentExerciseProgress = typeof studentExerciseProgress.$inferSelect;
export type InsertStudentExerciseProgress = typeof studentExerciseProgress.$inferInsert;


// ============================================
// BADGE/SEAL SYSTEM - Ellie's Stamps
// ============================================

// Badge definitions - the types of badges available
export const badgeDefinitions = mysqlTable("badge_definitions", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(), // e.g. "welcome_seal", "speaking_master"
  name: varchar("name", { length: 128 }).notNull(), // Display name
  nameEn: varchar("name_en", { length: 128 }).notNull(), // English name
  description: text("description").notNull(), // Description in Portuguese
  descriptionEn: text("description_en").notNull(), // Description in English
  ellieMessage: text("ellie_message").notNull(), // Ellie's congratulation message
  ellieMessageEn: text("ellie_message_en").notNull(), // Ellie's message in English
  category: mysqlEnum("category", [
    "welcome",      // First-time achievements
    "exercise",     // Exercise completion
    "streak",       // Streak milestones
    "vocabulary",   // Vocabulary mastery
    "speaking",     // Speaking practice
    "cultural",     // Cultural knowledge
    "book",         // Book completion
    "special"       // Special/seasonal badges
  ]).notNull(),
  icon: varchar("icon", { length: 64 }).notNull(), // Emoji or icon name
  color: varchar("color", { length: 7 }).notNull().default("#6B21A8"), // Hex color
  requirement: text("requirement").notNull(), // JSON describing unlock conditions
  influxcoinsReward: int("influxcoins_reward").default(0).notNull(), // Influxcoins earned
  sortOrder: int("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type BadgeDefinition = typeof badgeDefinitions.$inferSelect;
export type InsertBadgeDefinition = typeof badgeDefinitions.$inferInsert;

// Student badges - which badges each student has earned
export const studentBadges = mysqlTable("student_badges", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: int("badge_id").notNull().references(() => badgeDefinitions.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  seenByStudent: boolean("seen_by_student").default(false).notNull(), // For animation trigger
  influxcoinsAwarded: int("influxcoins_awarded").default(0).notNull(),
});
export type StudentBadge = typeof studentBadges.$inferSelect;
export type InsertStudentBadge = typeof studentBadges.$inferInsert;

// ============================================
// CULTURAL EVENTS MODULE — St. Patrick's Night
// ============================================

// Cultural event definition
export const culturalEvents = mysqlTable("cultural_events", {
  id: varchar("id", { length: 50 }).primaryKey(), // 'stpatricks_2026'
  name: varchar("name", { length: 100 }).notNull(),
  eventDate: date("event_date").notNull(),
  active: boolean("active").default(true).notNull(),
  config: json("config"), // cores, personagens ativos, missões
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type CulturalEvent = typeof culturalEvents.$inferSelect;
export type InsertCulturalEvent = typeof culturalEvents.$inferInsert;

// Event participants (authenticated students OR guests)
export const eventParticipants = mysqlTable("event_participants", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("event_id", { length: 50 }).notNull().references(() => culturalEvents.id),
  userId: int("user_id").references(() => users.id),
  guestName: varchar("guest_name", { length: 100 }),
  guestWhatsapp: varchar("guest_whatsapp", { length: 20 }),
  guestToken: varchar("guest_token", { length: 100 }),
  totalPoints: int("total_points").default(0).notNull(),
  missionsCompleted: json("missions_completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = typeof eventParticipants.$inferInsert;

// Mission progress per participant
export const eventMissionProgress = mysqlTable("event_mission_progress", {
  id: int("id").autoincrement().primaryKey(),
  participantId: int("participant_id").notNull().references(() => eventParticipants.id, { onDelete: "cascade" }),
  missionId: varchar("mission_id", { length: 50 }).notNull(),
  score: int("score").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  timeSpentSeconds: int("time_spent_seconds").default(0).notNull(),
  answers: json("answers"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type EventMissionProgress = typeof eventMissionProgress.$inferSelect;
export type InsertEventMissionProgress = typeof eventMissionProgress.$inferInsert;

// ============================================
// VIP PROFILES — Memória e Tom Personalizado
// ============================================
export const vipProfiles = mysqlTable("vip_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }),
  relationship: varchar("relationship", { length: 100 }),
  role: varchar("role", { length: 100 }),
  bio: text("bio"),
  toneInstructions: text("tone_instructions"),
  personalContext: json("personal_context"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type VipProfile = typeof vipProfiles.$inferSelect;
export type InsertVipProfile = typeof vipProfiles.$inferInsert;

export const chatMemory = mysqlTable("chat_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  memoryKey: varchar("memory_key", { length: 100 }).notNull(),
  memoryValue: text("memory_value").notNull(),
  source: varchar("source", { length: 50 }).default("conversation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type ChatMemory = typeof chatMemory.$inferSelect;
export type InsertChatMemory = typeof chatMemory.$inferInsert;

// ============================================
// MINERAÇÃO DE HISTÓRICO — Celular do Retiro
// ============================================
export const miningProgress = mysqlTable("mining_progress", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 30 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "processing", "done", "error", "ignored"]).default("pending").notNull(),
  analiseJson: json("analise_json"),
  nome: varchar("nome", { length: 100 }),
  interesse: varchar("interesse", { length: 255 }),
  leadStatus: varchar("lead_status", { length: 50 }),
  temperatura: int("temperatura").default(0),
  urgencia: varchar("urgencia", { length: 20 }),
  melhorAbordagem: text("melhor_abordagem"),
  resumo: text("resumo"),
  acao: varchar("acao", { length: 50 }),
  processadoEm: timestamp("processado_em"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type MiningProgress = typeof miningProgress.$inferSelect;
export type InsertMiningProgress = typeof miningProgress.$inferInsert;

export const miningSession = mysqlTable("mining_session", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["idle", "running", "paused", "completed", "error"]).default("idle").notNull(),
  totalChats: int("total_chats").default(0).notNull(),
  processados: int("processados").default(0).notNull(),
  novosContatos: int("novos_contatos").default(0).notNull(),
  contatosAtualizados: int("contatos_atualizados").default(0).notNull(),
  followsCriados: int("follows_criados").default(0).notNull(),
  leadsQuentes: int("leads_quentes").default(0).notNull(),
  lastPhone: varchar("last_phone", { length: 30 }),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type MiningSession = typeof miningSession.$inferSelect;
export type InsertMiningSession = typeof miningSession.$inferInsert;

// ══════════════════════════════════════════════════════════════════════════════
// PRESENCE SYSTEM — Phase 3: Multi-Contexto + QR Integration
// ══════════════════════════════════════════════════════════════════════════════

// Environments table — physical/digital locations
export const environments = mysqlTable("environments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["reception", "game_room", "cafe", "classroom", "garden", "app", "totem"]).notNull(),
  locationName: varchar("location_name", { length: 255 }),
  floor: varchar("floor", { length: 50 }),
  room: varchar("room", { length: 50 }),
  totemId: varchar("totem_id", { length: 100 }).unique(),
  persona: json("persona"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type Environment = typeof environments.$inferSelect;
export type InsertEnvironment = typeof environments.$inferInsert;

// Environment visits — tracks student movements between environments
export const environmentVisits = mysqlTable("environment_visits", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull(),
  environmentId: varchar("environment_id", { length: 100 }).notNull(),
  arrivedAt: timestamp("arrived_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  xpEarned: int("xp_earned").default(0).notNull(),
  influxDollarsEarned: int("influx_dollars_earned").default(0).notNull(),
  interactions: int("interactions").default(0).notNull(),
  checkInMethod: mysqlEnum("check_in_method", ["qr", "manual", "auto"]).default("qr").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type EnvironmentVisit = typeof environmentVisits.$inferSelect;
export type InsertEnvironmentVisit = typeof environmentVisits.$inferInsert;

// Totem sessions — per-totem interaction sessions
export const totemSessions = mysqlTable("totem_sessions", {
  id: int("id").autoincrement().primaryKey(),
  totemId: varchar("totem_id", { length: 100 }).notNull(),
  studentId: varchar("student_id", { length: 20 }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  qrScannedAt: timestamp("qr_scanned_at"),
  environmentId: varchar("environment_id", { length: 100 }),
  presenceState: varchar("presence_state", { length: 50 }),
  xpEarned: int("xp_earned").default(0).notNull(),
  summary: json("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type TotemSession = typeof totemSessions.$inferSelect;
export type InsertTotemSession = typeof totemSessions.$inferInsert;
