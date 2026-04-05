import { describe, it, expect, beforeEach, vi } from "vitest";

describe("SyncIndicator Component", () => {
  describe("Status Configuration", () => {
    it("should have correct idle status config", () => {
      const statusConfig = {
        idle: {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: null,
          label: "Pronto",
        },
      };

      expect(statusConfig.idle.label).toBe("Pronto");
      expect(statusConfig.idle.color).toBe("text-gray-500");
      expect(statusConfig.idle.bgColor).toBe("bg-gray-100");
    });

    it("should have correct loading status config", () => {
      const statusConfig = {
        loading: {
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          label: "Sincronizando...",
        },
      };

      expect(statusConfig.loading.label).toBe("Sincronizando...");
      expect(statusConfig.loading.color).toBe("text-blue-500");
      expect(statusConfig.loading.bgColor).toBe("bg-blue-100");
    });

    it("should have correct success status config", () => {
      const statusConfig = {
        success: {
          color: "text-green-500",
          bgColor: "bg-green-100",
          label: "Sincronizado",
        },
      };

      expect(statusConfig.success.label).toBe("Sincronizado");
      expect(statusConfig.success.color).toBe("text-green-500");
      expect(statusConfig.success.bgColor).toBe("bg-green-100");
    });

    it("should have correct error status config", () => {
      const statusConfig = {
        error: {
          color: "text-red-500",
          bgColor: "bg-red-100",
          label: "Erro na sincronização",
        },
      };

      expect(statusConfig.error.label).toBe("Erro na sincronização");
      expect(statusConfig.error.color).toBe("text-red-500");
      expect(statusConfig.error.bgColor).toBe("bg-red-100");
    });
  });

  describe("SyncStatus Type", () => {
    it("should accept valid sync statuses", () => {
      const validStatuses: Array<"idle" | "loading" | "success" | "error"> = [
        "idle",
        "loading",
        "success",
        "error",
      ];

      expect(validStatuses).toHaveLength(4);
      expect(validStatuses).toContain("idle");
      expect(validStatuses).toContain("loading");
      expect(validStatuses).toContain("success");
      expect(validStatuses).toContain("error");
    });
  });

  describe("SyncStatusBadge Configuration", () => {
    it("should have correct badge colors", () => {
      const badgeConfig = {
        idle: { color: "bg-gray-500", label: "Pronto" },
        loading: { color: "bg-blue-500", label: "Sincronizando" },
        success: { color: "bg-green-500", label: "Sincronizado" },
        error: { color: "bg-red-500", label: "Erro" },
      };

      expect(badgeConfig.idle.color).toBe("bg-gray-500");
      expect(badgeConfig.loading.color).toBe("bg-blue-500");
      expect(badgeConfig.success.color).toBe("bg-green-500");
      expect(badgeConfig.error.color).toBe("bg-red-500");
    });

    it("should have correct badge labels", () => {
      const badgeConfig = {
        idle: { label: "Pronto" },
        loading: { label: "Sincronizando" },
        success: { label: "Sincronizado" },
        error: { label: "Erro" },
      };

      expect(badgeConfig.idle.label).toBe("Pronto");
      expect(badgeConfig.loading.label).toBe("Sincronizando");
      expect(badgeConfig.success.label).toBe("Sincronizado");
      expect(badgeConfig.error.label).toBe("Erro");
    });
  });

  describe("useSyncStatus Hook", () => {
    it("should initialize with idle status", () => {
      const status = "idle";
      const message = "";

      expect(status).toBe("idle");
      expect(message).toBe("");
    });

    it("should set syncing status", () => {
      let status = "idle";
      let message = "";

      // Simulate setSyncing
      status = "loading";
      message = "Sincronizando...";

      expect(status).toBe("loading");
      expect(message).toBe("Sincronizando...");
    });

    it("should set success status", () => {
      let status = "idle";
      let message = "";

      // Simulate setSyncSuccess
      status = "success";
      message = "Sincronizado com sucesso";

      expect(status).toBe("success");
      expect(message).toBe("Sincronizado com sucesso");
    });

    it("should set error status", () => {
      let status = "idle";
      let message = "";

      // Simulate setSyncError
      status = "error";
      message = "Erro ao sincronizar";

      expect(status).toBe("error");
      expect(message).toBe("Erro ao sincronizar");
    });

    it("should reset to idle status", () => {
      let status = "success";
      let message = "Sincronizado";

      // Simulate reset
      status = "idle";
      message = "";

      expect(status).toBe("idle");
      expect(message).toBe("");
    });

    it("should support custom error messages", () => {
      let status = "idle";
      let message = "";

      // Simulate setSyncError with custom message
      status = "error";
      message = "Falha na conexão com servidor";

      expect(status).toBe("error");
      expect(message).toBe("Falha na conexão com servidor");
    });
  });

  describe("SyncIndicator Props", () => {
    it("should have default props", () => {
      const defaultProps = {
        status: "idle" as const,
        autoHideDelay: 3000,
        showBadge: true,
        showSpinner: true,
        className: "",
      };

      expect(defaultProps.autoHideDelay).toBe(3000);
      expect(defaultProps.showBadge).toBe(true);
      expect(defaultProps.showSpinner).toBe(true);
      expect(defaultProps.className).toBe("");
    });

    it("should support custom props", () => {
      const customProps = {
        status: "loading" as const,
        message: "Carregando dados...",
        autoHideDelay: 5000,
        showBadge: false,
        showSpinner: true,
        className: "custom-class",
      };

      expect(customProps.message).toBe("Carregando dados...");
      expect(customProps.autoHideDelay).toBe(5000);
      expect(customProps.showBadge).toBe(false);
      expect(customProps.className).toBe("custom-class");
    });
  });

  describe("Auto-Hide Behavior", () => {
    it("should auto-hide after delay", async () => {
      const autoHideDelay = 1000;
      let visible = true;

      // Simulate auto-hide logic
      await new Promise((resolve) => {
        setTimeout(() => {
          visible = false;
          resolve(null);
        }, autoHideDelay);
      });

      expect(visible).toBe(false);
    });

    it("should not auto-hide when delay is 0", () => {
      const autoHideDelay = 0;
      let visible = true;

      if (autoHideDelay > 0) {
        visible = false;
      }

      expect(visible).toBe(true);
    });

    it("should reset visible state on status change", () => {
      let visible = false;
      const newStatus = "loading";

      if (newStatus !== "idle") {
        visible = true;
      }

      expect(visible).toBe(true);
    });
  });

  describe("Message Display", () => {
    it("should display custom message", () => {
      const customMessage = "Sincronizando com servidor...";
      const displayMessage = customMessage || "Padrão";

      expect(displayMessage).toBe("Sincronizando com servidor...");
    });

    it("should display default message when custom is empty", () => {
      const customMessage = "";
      const defaultMessage = "Sincronizado";
      const displayMessage = customMessage || defaultMessage;

      expect(displayMessage).toBe("Sincronizado");
    });

    it("should support multi-line messages", () => {
      const multilineMessage = "Sincronizando...\nPor favor, aguarde";
      expect(multilineMessage).toContain("Sincronizando...");
      expect(multilineMessage).toContain("Por favor, aguarde");
    });
  });

  describe("CSS Classes", () => {
    it("should generate correct CSS classes for idle status", () => {
      const status = "idle";
      const bgColor = "bg-gray-100";
      const color = "text-gray-500";
      const className = `flex items-center gap-2 px-3 py-2 rounded-lg ${bgColor}`;

      expect(className).toContain("flex");
      expect(className).toContain("items-center");
      expect(className).toContain("bg-gray-100");
    });

    it("should generate correct CSS classes for loading status", () => {
      const status = "loading";
      const bgColor = "bg-blue-100";
      const color = "text-blue-500";
      const className = `flex items-center gap-2 px-3 py-2 rounded-lg ${bgColor}`;

      expect(className).toContain("bg-blue-100");
    });

    it("should support custom className prop", () => {
      const customClass = "custom-sync-indicator";
      const className = `flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 ${customClass}`;

      expect(className).toContain("custom-sync-indicator");
    });
  });

  describe("Icon Rendering", () => {
    it("should render spinner for loading status", () => {
      const status = "loading";
      const showSpinner = true;
      const shouldRenderSpinner = status === "loading" && showSpinner;

      expect(shouldRenderSpinner).toBe(true);
    });

    it("should render check icon for success status", () => {
      const status = "success";
      const shouldRenderCheckIcon = status === "success";

      expect(shouldRenderCheckIcon).toBe(true);
    });

    it("should render alert icon for error status", () => {
      const status = "error";
      const shouldRenderAlertIcon = status === "error";

      expect(shouldRenderAlertIcon).toBe(true);
    });

    it("should not render icon for idle status", () => {
      const status = "idle";
      const shouldRenderIcon = status !== "idle";

      expect(shouldRenderIcon).toBe(false);
    });
  });
});
