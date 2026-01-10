/**
 * Supabase クライアント設定
 * ClerkとSupabaseの認証統合（カスタムヘッダー方式）
 */

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase環境変数が設定されていません。.env.localを確認してください。"
  );
}

/**
 * 認証済みSupabaseクライアントを作成
 * カスタムヘッダーにClerkのユーザーIDを設定してRLSを有効化
 *
 * @returns {Promise<{supabase: SupabaseClient, userId: string}>}
 * @throws {Error} ユーザーが認証されていない場合
 */
export async function createAuthenticatedSupabaseClient() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("認証が必要です。ログインしてください。");
  }

  // カスタムヘッダーでClerkのユーザーIDを送信
  // RLSポリシーでget_clerk_user_id()関数を通じて使用される
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-clerk-user-id": userId,
      },
    },
  });

  return { supabase, userId };
}

/**
 * クライアントサイド用のSupabaseクライアント（認証なし）
 * 注意: このクライアントはRLSが適用されないため、
 * 認証が必要な操作には使用しないでください
 */
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
