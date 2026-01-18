import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase";
import { Expense } from "@/types/database";

type Period = "daily" | "weekly" | "monthly";

interface PeriodDates {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
}

/**
 * 期間に応じた開始日・終了日を計算
 */
function getPeriodDates(period: Period): PeriodDates {
  const now = new Date();

  switch (period) {
    case "daily": {
      // 今日
      const currentStart = new Date(now);
      currentStart.setHours(0, 0, 0, 0);
      const currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);

      // 昨日
      const previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 1);
      const previousEnd = new Date(currentEnd);
      previousEnd.setDate(currentEnd.getDate() - 1);

      return { currentStart, currentEnd, previousStart, previousEnd };
    }

    case "weekly": {
      // 今週（月曜日開始）
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

      const currentStart = new Date(now);
      currentStart.setDate(now.getDate() + diff);
      currentStart.setHours(0, 0, 0, 0);

      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentStart.getDate() + 6);
      currentEnd.setHours(23, 59, 59, 999);

      // 先週
      const previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
      const previousEnd = new Date(currentEnd);
      previousEnd.setDate(currentEnd.getDate() - 7);

      return { currentStart, currentEnd, previousStart, previousEnd };
    }

    case "monthly": {
      // 今月
      const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      // 先月
      const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      );

      return { currentStart, currentEnd, previousStart, previousEnd };
    }
  }
}

/**
 * 支出データからサマリーを計算
 */
function calculateSummary(expenses: Expense[]) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const categoryMap = new Map<string, number>();
  expenses.forEach((expense) => {
    const current = categoryMap.get(expense.category) || 0;
    categoryMap.set(expense.category, current + Number(expense.amount));
  });

  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return {
    total,
    categoryTotals,
    count: expenses.length,
  };
}

/**
 * GET /api/expenses/analytics?period=daily|weekly|monthly
 * 期間別の支出分析データを取得（前期間との比較含む）
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase } = await createAuthenticatedSupabaseClient();

    // クエリパラメータから期間を取得
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get("period") || "monthly") as Period;

    // 期間の妥当性チェック
    if (!["daily", "weekly", "monthly"].includes(period)) {
      return NextResponse.json(
        { error: "無効な期間指定です。daily, weekly, monthly のいずれかを指定してください。" },
        { status: 400 }
      );
    }

    // 期間の日付を計算
    const dates = getPeriodDates(period);

    // 現在の期間の支出を取得
    const { data: currentExpenses, error: currentError } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", dates.currentStart.toISOString())
      .lte("created_at", dates.currentEnd.toISOString())
      .returns<Expense[]>();

    if (currentError) {
      console.error("Supabase error (current):", currentError);
      return NextResponse.json(
        { error: "支出の取得に失敗しました", details: currentError.message },
        { status: 500 }
      );
    }

    // 前期間の支出を取得
    const { data: previousExpenses, error: previousError } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", dates.previousStart.toISOString())
      .lte("created_at", dates.previousEnd.toISOString())
      .returns<Expense[]>();

    if (previousError) {
      console.error("Supabase error (previous):", previousError);
      return NextResponse.json(
        { error: "支出の取得に失敗しました", details: previousError.message },
        { status: 500 }
      );
    }

    // サマリーを計算
    const currentSummary = calculateSummary(currentExpenses || []);
    const previousSummary = calculateSummary(previousExpenses || []);

    // 比較データを計算
    const difference = currentSummary.total - previousSummary.total;
    const percentageChange =
      previousSummary.total === 0
        ? currentSummary.total > 0
          ? 100
          : 0
        : ((difference / previousSummary.total) * 100);

    return NextResponse.json({
      period,
      current: {
        ...currentSummary,
        startDate: dates.currentStart.toISOString(),
        endDate: dates.currentEnd.toISOString(),
      },
      previous: {
        ...previousSummary,
        startDate: dates.previousStart.toISOString(),
        endDate: dates.previousEnd.toISOString(),
      },
      comparison: {
        difference,
        percentageChange: Math.round(percentageChange * 10) / 10,
        trend: difference > 0 ? "up" : difference < 0 ? "down" : "stable",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

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
