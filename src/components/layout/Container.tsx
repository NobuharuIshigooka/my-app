import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * コンテナコンポーネント
 * 最大幅とパディングを設定する
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16", className)}>
      {children}
    </div>
  );
}
