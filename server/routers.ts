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
});

export type AppRouter = typeof appRouter;
