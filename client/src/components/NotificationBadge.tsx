import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
}

export function NotificationBadge({ 
  count, 
  className,
  maxCount = 99 
}: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1",
        "flex items-center justify-center",
        "bg-gradient-to-br from-red-500 to-red-600",
        "text-white text-[10px] font-bold",
        "rounded-full",
        "shadow-lg shadow-red-500/50",
        "border-2 border-slate-900",
        "animate-pulse",
        className
      )}
    >
      {displayCount}
    </div>
  );
}
