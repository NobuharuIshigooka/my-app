import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Container } from "@/components/layout/Container";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { MonthlySummary } from "@/components/expenses/MonthlySummary";
import { RecentExpenses } from "@/components/expenses/RecentExpenses";

export default async function DashboardPage() {
  const { userId } = await auth();

  // 認証されていない場合はサインインページへリダイレクト
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <MainLayout>
      <Container>
        <div className="space-y-8">
          {/* ウェルカムメッセージ */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="mt-2 text-lg text-gray-600">
              ようこそ、{user?.firstName || user?.emailAddresses[0]?.emailAddress} さん
            </p>
          </div>

          {/* 2カラムレイアウト: 支出記録フォームと今月の支出 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 支出記録フォーム */}
            <ExpenseForm />

            {/* 今月の支出サマリー */}
            <MonthlySummary />
          </div>

          {/* 最近の支出一覧 */}
          <RecentExpenses />
        </div>
      </Container>
    </MainLayout>
  );
}
