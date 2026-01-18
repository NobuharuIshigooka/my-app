import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Container } from "@/components/layout/Container";
import { PremiumAnalytics } from "@/components/analytics/PremiumAnalytics";

export default async function AnalyticsPage() {
  const { userId } = await auth();

  // 認証されていない場合はサインインページへリダイレクト
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <MainLayout>
      <Container>
        <div className="space-y-6">
          {/* ページヘッダー */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">プレミアム分析</h1>
            <p className="mt-2 text-lg text-gray-600">
              グラフで支出を詳しく分析できます
            </p>
          </div>

          {/* プレミアム分析コンテンツ */}
          <PremiumAnalytics />
        </div>
      </Container>
    </MainLayout>
  );
}
