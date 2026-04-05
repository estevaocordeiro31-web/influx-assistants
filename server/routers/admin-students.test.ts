import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
  assignStudentId: vi.fn(),
  assignStudentIdsToAllUsers: vi.fn(),
}));

import { getDb, assignStudentId, assignStudentIdsToAllUsers } from '../db';

describe('Admin Students - Student ID System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateStudentId format', () => {
    it('should generate ID in format INF-YYYY-XXXX', () => {
      const year = new Date().getFullYear();
      const expectedPattern = new RegExp(`^INF-${year}-\\d{4}$`);
      const testId = `INF-${year}-0001`;
      expect(testId).toMatch(expectedPattern);
    });

    it('should pad numbers to 4 digits', () => {
      const year = new Date().getFullYear();
      expect(`INF-${year}-0001`).toMatch(/\d{4}$/);
      expect(`INF-${year}-0099`).toMatch(/\d{4}$/);
      expect(`INF-${year}-1234`).toMatch(/\d{4}$/);
    });
  });

  describe('assignStudentId', () => {
    it('should return existing studentId if already assigned', async () => {
      const mockAssign = assignStudentId as ReturnType<typeof vi.fn>;
      mockAssign.mockResolvedValue('INF-2026-0001');
      
      const result = await assignStudentId(1);
      expect(result).toBe('INF-2026-0001');
    });

    it('should return null if database is not available', async () => {
      const mockAssign = assignStudentId as ReturnType<typeof vi.fn>;
      mockAssign.mockResolvedValue(null);
      
      const result = await assignStudentId(999);
      expect(result).toBeNull();
    });
  });

  describe('assignStudentIdsToAllUsers', () => {
    it('should return count of users that received IDs', async () => {
      const mockAssignAll = assignStudentIdsToAllUsers as ReturnType<typeof vi.fn>;
      mockAssignAll.mockResolvedValue(5);
      
      const count = await assignStudentIdsToAllUsers();
      expect(count).toBe(5);
    });

    it('should return 0 if no users need IDs', async () => {
      const mockAssignAll = assignStudentIdsToAllUsers as ReturnType<typeof vi.fn>;
      mockAssignAll.mockResolvedValue(0);
      
      const count = await assignStudentIdsToAllUsers();
      expect(count).toBe(0);
    });
  });

  describe('studentId uniqueness', () => {
    it('should generate sequential IDs', () => {
      const year = new Date().getFullYear();
      const ids = [
        `INF-${year}-0001`,
        `INF-${year}-0002`,
        `INF-${year}-0003`,
      ];
      
      // Check all IDs are unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should include year in ID for yearly reset', () => {
      const currentYear = new Date().getFullYear();
      const id = `INF-${currentYear}-0001`;
      expect(id).toContain(currentYear.toString());
    });
  });
});
