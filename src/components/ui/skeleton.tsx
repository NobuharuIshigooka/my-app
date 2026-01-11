import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * スケルトンローディングコンポーネント
 * コンテンツが読み込まれるまでのプレースホルダーを表示
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}

/**
 * カードスケルトン
 */
export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-300 bg-white p-6 shadow-md">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
