import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * エラー表示コンポーネント
 */
export function ErrorDisplay({
  title = "エラーが発生しました",
  message = "申し訳ございません。予期しないエラーが発生しました。",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-red-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              再試行
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 404エラー表示
 */
export function NotFoundDisplay() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">ページが見つかりません</p>
        <p className="mt-2 text-gray-500">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Button asChild className="mt-8" size="lg">
          <a href="/">ホームに戻る</a>
        </Button>
      </div>
    </div>
  );
}
