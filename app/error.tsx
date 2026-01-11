"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      title="エラーが発生しました"
      message={
        process.env.NODE_ENV === "development"
          ? error.message
          : "予期しないエラーが発生しました。しばらく経ってから再度お試しください。"
      }
      onRetry={reset}
    />
  );
}
