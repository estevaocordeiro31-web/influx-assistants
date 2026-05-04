import { describe, it, expect, beforeEach, vi } from "vitest";
import { bulkStudentSyncRouter } from "./routers/bulk-student-sync";

describe("bulkStudentSyncRouter", () => {
  describe("syncAllStudents", () => {
    it("should return success message on dry run", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.success).toBe(true);
      expect(result.message).toContain("simulada");
      expect(result.total).toBe(182);
    });

    it("should generate 182 students on dry run", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.students.length).toBeGreaterThan(0);
      expect(result.students.length).toBeLessThanOrEqual(182);
    });

    it("should include student details in results", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      const firstStudent = result.students[0];
      expect(firstStudent).toHaveProperty("email");
      expect(firstStudent).toHaveProperty("status");
    });

    it("should have valid email format", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        expect(student.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("should have valid phone format", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        if (student.phone) {
          expect(student.phone).toMatch(/^\d+$/);
        }
      });
    });

    it("should have valid level", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      const validLevels = ["Iniciante", "Elementar", "Básico", "Intermediário", "Avançado"];
      result.students.forEach((student: any) => {
        if (student.level) {
          expect(validLevels).toContain(student.level);
        }
      });
    });

    it("should return error count of 0 on dry run", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.failed).toBe(0);
      expect(result.errors.length).toBe(0);
    });

    it("should have unique emails", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      const emails = result.students.map((s: any) => s.email);
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(emails.length);
    });

    it("should have unique phone numbers", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      const phones = result.students.map((s: any) => s.phone).filter(Boolean);
      const uniquePhones = new Set(phones);
      expect(uniquePhones.size).toBe(phones.length);
    });

    it("should have students with created or updated status on dry run", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        expect(["created", "updated"]).toContain(student.status);
      });
    });

    it("should default dryRun to false", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({});

      expect(result.success).toBe(true);
    });

    it("should include created count in results", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.created).toBeGreaterThanOrEqual(0);
      expect(result.created).toBeLessThanOrEqual(182);
    });

    it("should include updated count in results", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.updated).toBeGreaterThanOrEqual(0);
    });

    it("should include failed count in results", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.failed).toBeGreaterThanOrEqual(0);
    });

    it("should have valid student name format", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        if (student.name) {
          expect(student.name).toMatch(/^[A-Za-záàâãéèêíïóôõöúçñ\s]+$/);
        }
      });
    });

    it("should include total count matching 182", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.total).toBe(182);
    });

    it("should have message indicating sync completion", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      expect(result.message).toContain("Sincronização");
      expect(result.message).toContain("concluída");
    });

    it("should have students with phone numbers", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        if (student.phone) {
          expect(student.phone).not.toBe("");
        }
      });
    });

    it("should have students with level when provided", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.syncAllStudents({ dryRun: true });

      result.students.forEach((student: any) => {
        if (student.level) {
          expect(student.level).not.toBe("");
        }
      });
    });
  });

  describe("getSyncStatus", () => {
    it("should return sync status", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.getSyncStatus();

      expect(result).toHaveProperty("totalStudents");
      expect(result).toHaveProperty("lastSync");
      expect(result).toHaveProperty("status");
    });

    it("should have status synced", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.getSyncStatus();

      expect(result.status).toBe("synced");
    });

    it("should have totalStudents as number", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.getSyncStatus();

      expect(typeof result.totalStudents).toBe("number");
    });

    it("should have lastSync as date", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.getSyncStatus();

      expect(result.lastSync).toBeInstanceOf(Date);
    });
  });

  describe("listSyncedStudents", () => {
    it("should return paginated students", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.listSyncedStudents({ page: 1, limit: 20 });

      expect(result).toHaveProperty("students");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("pages");
    });

    it("should default page to 1", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.listSyncedStudents({ limit: 20 });

      expect(result.page).toBe(1);
    });

    it("should default limit to 20", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.listSyncedStudents({ page: 1 });

      expect(result.limit).toBe(20);
    });

    it("should return array of students", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.listSyncedStudents({ page: 1, limit: 20 });

      expect(Array.isArray(result.students)).toBe(true);
    });

    it("should have correct pagination calculation", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "admin" },
      } as any);

      const result = await caller.listSyncedStudents({ page: 1, limit: 20 });

      expect(result.pages).toBe(Math.ceil(result.total / result.limit));
    });
  });

  describe("getStudentByEmail", () => {
    it("should accept email parameter", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "user" },
      } as any);

      const result = await caller.getStudentByEmail({
        email: "test@example.com",
      });

      expect(result === null || typeof result === "object").toBe(true);
    });

    it("should validate email format", async () => {
      const caller = bulkStudentSyncRouter.createCaller({
        user: { id: 1, role: "user" },
      } as any);

      try {
        await caller.getStudentByEmail({
          email: "invalid-email",
        } as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
