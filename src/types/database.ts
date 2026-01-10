/**
 * データベース型定義
 * Supabaseのテーブル構造に対応するTypeScript型
 */

// ===================================
// カテゴリ定数
// ===================================
export const EXPENSE_CATEGORIES = [
  "食費",
  "日用品",
  "交通費",
  "娯楽",
  "衣服・美容",
  "医療・健康",
  "住居費",
  "通信費",
  "その他",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// ===================================
// データベーステーブル型
// ===================================

/**
 * expenses テーブルの型定義
 */
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  created_at: string;
  updated_at: string;
}

/**
 * 支出作成時の入力型（IDとタイムスタンプを除く）
 */
export interface ExpenseInsert {
  user_id: string;
  amount: number;
  category: ExpenseCategory;
}

/**
 * 支出更新時の入力型（部分更新可能）
 */
export interface ExpenseUpdate {
  amount?: number;
  category?: ExpenseCategory;
}

// ===================================
// データベース全体の型定義
// ===================================
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: Expense;
        Insert: ExpenseInsert;
        Update: ExpenseUpdate;
      };
    };
  };
}
