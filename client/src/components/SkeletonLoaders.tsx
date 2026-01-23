/**
 * Skeleton Loaders
 * Loading placeholders for better UX during data fetching
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-700/50',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center space-y-3">
      <Skeleton className="h-8 w-8 mx-auto rounded-full" />
      <Skeleton className="h-8 w-16 mx-auto" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : '')}>
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className={cn('space-y-2 max-w-[70%]', isUser ? 'items-end' : '')}>
        <Skeleton className={cn('h-4', isUser ? 'w-32' : 'w-48')} />
        <Skeleton className={cn('h-16 rounded-xl', isUser ? 'w-40' : 'w-64')} />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-700">
      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
      <td className="p-4"><Skeleton className="h-8 w-20" /></td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left"><Skeleton className="h-4 w-20" /></th>
            <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
            <th className="p-4 text-left"><Skeleton className="h-4 w-24" /></th>
            <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
            <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TipCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BadgeSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-700 bg-slate-800/50">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function BadgesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <BadgeSkeleton />
      <BadgeSkeleton />
      <BadgeSkeleton />
      <BadgeSkeleton />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      
      {/* Stats */}
      <StatsGridSkeleton />
      
      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats */}
      <StatsGridSkeleton />
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <TipCardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ExerciseSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-2 flex-1 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Question */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
      
      {/* Actions */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
