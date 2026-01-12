import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Container } from "@/components/layout/Container";
import { ExpenseHistory } from "@/components/expenses/ExpenseHistory";

export default async function HistoryPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">支出履歴</h1>
            <p className="mt-2 text-lg text-gray-600">
              これまでの支出記録を確認できます
            </p>
          </div>

          {/* 支出履歴 */}
          <ExpenseHistory />
        </div>
      </Container>
    </MainLayout>
  );
}
