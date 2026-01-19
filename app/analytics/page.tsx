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
      {/* プレミアム背景グラデーション */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Container>
          <div className="space-y-8 py-8">
            {/* ページヘッダー - プレミアムデザイン */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-xl">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold text-white">
                    プレミアム分析
                  </h1>
                  <p className="mt-3 text-lg text-blue-50">
                    高度なグラフで支出を詳しく分析できます
                  </p>
                </div>
                {/* 装飾的な背景パターン */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-indigo-400 opacity-20 blur-3xl"></div>
              </div>
            </div>

            {/* プレミアム分析コンテンツ */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <PremiumAnalytics />
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
