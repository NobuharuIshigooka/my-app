import { NextResponse } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase";
import { Expense } from "@/types/database";

/**
 * GET /api/expenses/summary
 * 今月の支出サマリーを取得する
 */
export async function GET() {
  try {
    // 認証とSupabaseクライアントの取得
    const { supabase } = await createAuthenticatedSupabaseClient();

    // 今月の開始日と終了日を計算
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 今月の支出を取得
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", startOfMonth.toISOString())
      .lte("created_at", endOfMonth.toISOString())
      .returns<Expense[]>();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "支出の取得に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    // 合計金額を計算
    const total = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

    // カテゴリ別の合計を計算
    const categoryMap = new Map<string, number>();
    expenses?.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + Number(expense.amount));
    });

    const categoryTotals = Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total); // 金額の大きい順にソート

    return NextResponse.json({
      total,
      categoryTotals,
      count: expenses?.length || 0,
    });
  } catch (error) {
    console.error("API Error:", error);

    // 認証エラー
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json(
        { error: "認証が必要です。ログインしてください。" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "サーバーエラーが発生しました",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
