import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase";
import { Expense } from "@/types/database";
import { startOfDay, startOfWeek, startOfMonth, format, subDays, subWeeks, subMonths } from "date-fns";
import { ja } from "date-fns/locale";

type Period = "daily" | "weekly" | "monthly";

interface TrendDataPoint {
  label: string;
  date: string;
  amount: number;
}

/**
 * 期間に応じた推移データを生成
 */
function generateTrendData(expenses: Expense[], period: Period): TrendDataPoint[] {
  const now = new Date();
  const dataMap = new Map<string, number>();

  switch (period) {
    case "daily": {
      // 過去7日間
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        const key = format(date, "yyyy-MM-dd");
        dataMap.set(key, 0);
      }

      expenses.forEach((expense) => {
        const date = format(new Date(expense.created_at), "yyyy-MM-dd");
        if (dataMap.has(date)) {
          dataMap.set(date, (dataMap.get(date) || 0) + Number(expense.amount));
        }
      });

      return Array.from(dataMap.entries()).map(([date, amount]) => ({
        label: format(new Date(date), "M/d(E)", { locale: ja }),
        date,
        amount,
      }));
    }

    case "weekly": {
      // 過去4週間
      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
        const key = format(weekStart, "yyyy-MM-dd");
        dataMap.set(key, 0);
      }

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.created_at);
        const weekStart = startOfWeek(expenseDate, { weekStartsOn: 1 });
        const key = format(weekStart, "yyyy-MM-dd");
        if (dataMap.has(key)) {
          dataMap.set(key, (dataMap.get(key) || 0) + Number(expense.amount));
        }
      });

      return Array.from(dataMap.entries()).map(([date, amount]) => {
        const weekStart = new Date(date);
        return {
          label: format(weekStart, "M/d週", { locale: ja }),
          date,
          amount,
        };
      });
    }

    case "monthly": {
      // 過去6ヶ月
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(now, i));
        const key = format(monthStart, "yyyy-MM");
        dataMap.set(key, 0);
      }

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.created_at);
        const key = format(expenseDate, "yyyy-MM");
        if (dataMap.has(key)) {
          dataMap.set(key, (dataMap.get(key) || 0) + Number(expense.amount));
        }
      });

      return Array.from(dataMap.entries()).map(([date, amount]) => ({
        label: format(new Date(date + "-01"), "yyyy年M月", { locale: ja }),
        date,
        amount,
      }));
    }
  }
}

/**
 * GET /api/expenses/trend?period=daily|weekly|monthly
 * 期間別の支出推移データを取得
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

    // データ取得期間を計算
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "daily":
        startDate = startOfDay(subDays(now, 6));
        break;
      case "weekly":
        startDate = startOfWeek(subWeeks(now, 3), { weekStartsOn: 1 });
        break;
      case "monthly":
        startDate = startOfMonth(subMonths(now, 5));
        break;
    }

    // 期間内の支出を取得
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .returns<Expense[]>();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "支出の取得に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    // 推移データを生成
    const trendData = generateTrendData(expenses || [], period);

    return NextResponse.json({
      period,
      data: trendData,
      total: trendData.reduce((sum, item) => sum + item.amount, 0),
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
