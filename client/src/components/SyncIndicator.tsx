import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncIndicatorProps {
  status: SyncStatus;
  message?: string;
  autoHideDelay?: number; // milliseconds
  showBadge?: boolean;
  showSpinner?: boolean;
  className?: string;
}

/**
 * SyncIndicator Component
 * Displays synchronization status with spinner, badge, and message
 * 
 * @param status - Current sync status (idle, loading, success, error)
 * @param message - Optional custom message
 * @param autoHideDelay - Auto-hide success message after delay (default: 3000ms)
 * @param showBadge - Show status badge (default: true)
 * @param showSpinner - Show spinner when loading (default: true)
 * @param className - Additional CSS classes
 */
export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status,
  message,
  autoHideDelay = 3000,
  showBadge = true,
  showSpinner = true,
  className = "",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (status === "success" && autoHideDelay > 0) {
      const timer = setTimeout(() => setVisible(false), autoHideDelay);
      return () => clearTimeout(timer);
    }
    setVisible(true);
  }, [status, autoHideDelay]);

  if (!visible && status === "success") {
    return null;
  }

  const statusConfig = {
    idle: {
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      icon: null,
      label: "Pronto",
    },
    loading: {
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      icon: showSpinner ? <Loader2 className="w-4 h-4 animate-spin" /> : null,
      label: "Sincronizando...",
    },
    success: {
      color: "text-green-500",
      bgColor: "bg-green-100",
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Sincronizado",
    },
    error: {
      color: "text-red-500",
      bgColor: "bg-red-100",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Erro na sincronização",
    },
  };

  const config = statusConfig[status];
  const displayMessage = message || config.label;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${className}`}
    >
      {config.icon && <div className={config.color}>{config.icon}</div>}
      <span className={`text-sm font-medium ${config.color}`}>
        {displayMessage}
      </span>
      {showBadge && (
        <div
          className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${config.bgColor} ${config.color}`}
        >
          {status.toUpperCase()}
        </div>
      )}
    </div>
  );
};

/**
 * SyncStatusBadge Component
 * Compact badge showing only sync status
 */
export const SyncStatusBadge: React.FC<{
  status: SyncStatus;
  className?: string;
}> = ({ status, className = "" }) => {
  const statusConfig = {
    idle: { color: "bg-gray-500", label: "Pronto" },
    loading: { color: "bg-blue-500", label: "Sincronizando" },
    success: { color: "bg-green-500", label: "Sincronizado" },
    error: { color: "bg-red-500", label: "Erro" },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${config.color} ${className}`}
    >
      {status === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "success" && <CheckCircle2 className="w-3 h-3" />}
      {status === "error" && <AlertCircle className="w-3 h-3" />}
      <span>{config.label}</span>
    </div>
  );
};

/**
 * useSyncStatus Hook
 * Manages sync status state with auto-reset capability
 */
export const useSyncStatus = (autoResetDelay = 3000) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const setSyncing = () => {
    setStatus("loading");
    setMessage("Sincronizando...");
  };

  const setSyncSuccess = (msg = "Sincronizado com sucesso") => {
    setStatus("success");
    setMessage(msg);
    if (autoResetDelay > 0) {
      setTimeout(() => setStatus("idle"), autoResetDelay);
    }
  };

  const setSyncError = (msg = "Erro ao sincronizar") => {
    setStatus("error");
    setMessage(msg);
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
  };

  return {
    status,
    message,
    setSyncing,
    setSyncSuccess,
    setSyncError,
    reset,
  };
};
