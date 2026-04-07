import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isAccessBlocked,
  getTimeRemaining,
  formatTimeRemaining,
  defaultAccessBlockerConfig,
  AccessBlockerConfig,
} from "./server/_core/access-blocker";

describe("Access Blocker", () => {
  describe("isAccessBlocked", () => {
    it("should return true when current date is before unlock date", () => {
      const config: AccessBlockerConfig = {
        unlockDate: new Date("2026-03-01T00:00:00Z"),
        message: "Test message",
        title: "Test title",
      };

      const result = isAccessBlocked(config);
      expect(result).toBe(true);
    });

    it("should return false when current date is after unlock date", () => {
      const config: AccessBlockerConfig = {
        unlockDate: new Date("2020-01-01T00:00:00Z"),
        message: "Test message",
        title: "Test title",
      };

      const result = isAccessBlocked(config);
      expect(result).toBe(false);
    });

    it("should use default config when not provided", () => {
      const result = isAccessBlocked();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("getTimeRemaining", () => {
    it("should return correct time remaining", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const config: AccessBlockerConfig = {
        unlockDate: futureDate,
        message: "Test message",
        title: "Test title",
      };

      const result = getTimeRemaining(config);

      expect(result.days).toBeGreaterThanOrEqual(9);
      expect(result.days).toBeLessThanOrEqual(10);
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBeLessThan(24);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.minutes).toBeLessThan(60);
      expect(result.seconds).toBeGreaterThanOrEqual(0);
      expect(result.seconds).toBeLessThan(60);
      expect(result.totalMilliseconds).toBeGreaterThan(0);
    });

    it("should return zero values when unlock date has passed", () => {
      const pastDate = new Date("2020-01-01T00:00:00Z");

      const config: AccessBlockerConfig = {
        unlockDate: pastDate,
        message: "Test message",
        title: "Test title",
      };

      const result = getTimeRemaining(config);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.totalMilliseconds).toBe(0);
    });

    it("should have totalMilliseconds greater than zero when time remains", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const config: AccessBlockerConfig = {
        unlockDate: futureDate,
        message: "Test message",
        title: "Test title",
      };

      const result = getTimeRemaining(config);

      expect(result.totalMilliseconds).toBeGreaterThan(0);
    });
  });

  describe("formatTimeRemaining", () => {
    it("should format time correctly with all units", () => {
      const time = {
        days: 5,
        hours: 3,
        minutes: 30,
        seconds: 45,
        totalMilliseconds: 1000000,
      };

      const result = formatTimeRemaining(time);

      expect(result).toContain("5 dia");
      expect(result).toContain("3 hora");
      expect(result).toContain("30 minuto");
      expect(result).toContain("45 segundo");
    });

    it("should format singular correctly", () => {
      const time = {
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        totalMilliseconds: 1000000,
      };

      const result = formatTimeRemaining(time);

      expect(result).toContain("1 dia");
      expect(result).toContain("1 hora");
      expect(result).toContain("1 minuto");
      expect(result).toContain("1 segundo");
    });

    it("should omit zero values", () => {
      const time = {
        days: 0,
        hours: 2,
        minutes: 0,
        seconds: 30,
        totalMilliseconds: 1000000,
      };

      const result = formatTimeRemaining(time);

      expect(result).not.toContain("0 dia");
      expect(result).toContain("2 hora");
      expect(result).not.toContain("0 minuto");
      expect(result).toContain("30 segundo");
    });

    it("should return 'Acesso liberado!' when time has expired", () => {
      const time = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMilliseconds: 0,
      };

      const result = formatTimeRemaining(time);

      expect(result).toBe("Acesso liberado!");
    });

    it("should handle only seconds remaining", () => {
      const time = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 45,
        totalMilliseconds: 45000,
      };

      const result = formatTimeRemaining(time);

      expect(result).toBe("45 segundos");
    });
  });

  describe("defaultAccessBlockerConfig", () => {
    it("should have valid unlock date", () => {
      expect(defaultAccessBlockerConfig.unlockDate).toBeInstanceOf(Date);
    });

    it("should have unlock date in future", () => {
      const now = new Date();
      expect(defaultAccessBlockerConfig.unlockDate.getTime()).toBeGreaterThan(now.getTime());
    });

    it("should have message property", () => {
      expect(defaultAccessBlockerConfig.message).toBeDefined();
      expect(typeof defaultAccessBlockerConfig.message).toBe("string");
      expect(defaultAccessBlockerConfig.message.length).toBeGreaterThan(0);
    });

    it("should have title property", () => {
      expect(defaultAccessBlockerConfig.title).toBeDefined();
      expect(typeof defaultAccessBlockerConfig.title).toBe("string");
      expect(defaultAccessBlockerConfig.title.length).toBeGreaterThan(0);
    });
  });
});
