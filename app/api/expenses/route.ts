import { NextRequest, NextResponse } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase";
import { EXPENSE_CATEGORIES } from "@/types/database";

/**
 * POST /api/expenses
 * 新しい支出を作成する
 */
export async function POST(request: NextRequest) {
  try {
    // 認証とSupabaseクライアントの取得
    const { supabase, userId } = await createAuthenticatedSupabaseClient();

    // リクエストボディの取得
    const body = await request.json();
    const { amount, category, date } = body;

    // バリデーション
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "金額は0より大きい値を入力してください" },
        { status: 400 }
      );
    }

    if (!category || !EXPENSE_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "有効なカテゴリを選択してください" },
        { status: 400 }
      );
    }

    // Supabaseに挿入
    // 注: created_atはデフォルト値(NOW())が設定されているため、
    // カスタム日付が必要な場合は別途実装が必要です
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        category,
      } as any) // 型の問題を回避するためにanyを使用
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "支出の記録に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "支出を記録しました",
        data,
      },
      { status: 201 }
    );
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

/**
 * GET /api/expenses
 * 支出一覧を取得する
 */
export async function GET(request: NextRequest) {
  try {
    // 認証とSupabaseクライアントの取得
    const { supabase } = await createAuthenticatedSupabaseClient();

    // クエリパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Supabaseから取得（RLSにより自動的にユーザーのデータのみ取得される）
    const { data, error, count } = await supabase
      .from("expenses")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "支出の取得に失敗しました", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
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
