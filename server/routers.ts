import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { chatRouter } from "./routers/chat";
import { pronunciationRouter } from "./routers/pronunciation";
import { studentRouter } from "./routers/student";
import { notificationsRouter } from "./routers/notifications";
import { sponteSyncRouter } from "./routers/sponte-sync";
import { blogTipsRouter } from "./routers/blog-tips";
import { schedulerRouter } from "./routers/scheduler";
import { blogEngagementRouter } from "./routers/blog-engagement";
import { reportsRouter } from "./routers/reports";
import { personalizedLinksRouter } from "./routers/personalized-links";
import { sponteDataRouter } from "./routers/sponte-data";
import { materialUploadRouter } from "./routers/material-upload";
import { adminStudentsRouter } from "./routers/admin-students";
import { studentProfileRouter } from "./routers/student-profile";
import { crossAnalysisRouter } from "./routers/cross-analysis";
import { readingClubRouter } from "./routers/reading-club";
import { tutorRouter } from "./routers/tutor";
import { authPasswordRouter } from "./routers/auth-password";
import { directLoginRouter } from "./routers/direct-login";
import { welcomeEmailsRouter } from "./routers/welcome-emails";
import { bulkConfigRouter } from "./routers/bulk-config";
import { dailySyncRouter } from "./routers/daily-sync";
import { geminiRouter } from "./routers/gemini";
import { ttsRouter } from "./routers/tts";
import { vacationPlus2Router } from "./routers/vacation-plus-2";
import { lessonsRouter } from "./routers/lessons";
import { gamificationRouter } from "./routers/gamification";
import { quizLeaderboardRouter } from "./routers/quiz-leaderboard";
import { dashboardIntegrationRouter } from "./routers/dashboard-integration";
import { studentCoursesRouter } from "./routers/student-courses";
import { personalizedContentRouter } from "./routers/personalized-content";
import { tutorPersonalizedRouter } from "./routers/tutor-personalized";
import { studentPersonalizationRouter } from "./routers/student-personalization";
import { dashboardSyncRouter } from "./routers/dashboard-sync";
import { userManagementRouter } from "./routers/user-management";
import { progressTrackerRouter } from "./routers/progress-tracker";
import { webhookSyncRouter } from "./routers/webhook-sync";
import { tutorPersonalizedV2Router } from "./routers/tutor-personalized-v2";
import { bulkStudentSyncRouter } from "./routers/bulk-student-sync";
import { whatsappMessagesRouter } from "./routers/whatsapp-messages";
import { elliesSupportRouter } from "./routers/ellies-support";
import { backToSchoolRouter } from "./routers/back-to-school";
import { schoolActivitiesRouter } from "./routers/school-activities";
import { passportQRRouter } from "./routers/passport-qr";
import { adminExportRouter } from "./routers/admin-export";
import { extraExercisesRouter } from "./routers/extra-exercises";
import { badgesRouter } from "./routers/badges";
import { elieSyncRouter } from "./routers/elie-sync";
import { studentDataRouter } from "./routers/student-data";
import { culturalEventsRouter } from "./routers/cultural-events";
import { vipProfilesRouter } from "./routers/vip-profiles";
import { historicoMinerRouter } from "./routers/historico-miner";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  authPassword: authPasswordRouter,
  directLogin: directLoginRouter,
  welcomeEmails: welcomeEmailsRouter,
  bulkConfig: bulkConfigRouter,
  dailySync: dailySyncRouter,
  gemini: geminiRouter,

  chat: chatRouter,
  pronunciation: pronunciationRouter,
  student: studentRouter,
  studentProfile: studentProfileRouter,
  notifications: notificationsRouter,
  sponteSync: sponteSyncRouter,
  blogTips: blogTipsRouter,
  scheduler: schedulerRouter,
  blogEngagement: blogEngagementRouter,
  reports: reportsRouter,
  personalizedLinks: personalizedLinksRouter,
  sponteData: sponteDataRouter,
  materialUpload: materialUploadRouter,
  adminStudents: adminStudentsRouter,
  crossAnalysis: crossAnalysisRouter,
  readingClub: readingClubRouter,
  tutor: tutorRouter,
  tts: ttsRouter,
  vacationPlus2: vacationPlus2Router,
  lessons: lessonsRouter,
  gamification: gamificationRouter,
  quizLeaderboard: quizLeaderboardRouter,
  dashboardIntegration: dashboardIntegrationRouter,
  studentCourses: studentCoursesRouter,
  personalizedContent: personalizedContentRouter,
  tutorPersonalized: tutorPersonalizedRouter,
  studentPersonalization: studentPersonalizationRouter,
  dashboardSync: dashboardSyncRouter,
  userManagement: userManagementRouter,
  progressTracker: progressTrackerRouter,
  webhookSync: webhookSyncRouter,
  tutorPersonalizedV2: tutorPersonalizedV2Router,
  bulkStudentSync: bulkStudentSyncRouter,
  whatsappMessages: whatsappMessagesRouter,
  elliesSupport: elliesSupportRouter,
  backToSchool: backToSchoolRouter,
  schoolActivities: schoolActivitiesRouter,
  passportQR: passportQRRouter,
  adminExport: adminExportRouter,
  extraExercises: extraExercisesRouter,
  badges: badgesRouter,
  elieSync: elieSyncRouter,
  studentData: studentDataRouter,
  culturalEvents: culturalEventsRouter,
  vipProfiles: vipProfilesRouter,
  historicoMiner: historicoMinerRouter,
});

export type AppRouter = typeof appRouter;
