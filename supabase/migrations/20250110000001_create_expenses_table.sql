-- Money Tracker - 支出管理テーブルの作成
-- このマイグレーションは、支出データを管理するためのテーブルとRLSポリシーを作成します

-- ===================================
-- 1. expenses テーブルの作成
-- ===================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (
    category IN (
      '食費',
      '日用品',
      '交通費',
      '娯楽',
      '衣服・美容',
      '医療・健康',
      '住居費',
      '通信費',
      'その他'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックスの作成（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_user_created ON expenses(user_id, created_at DESC);

-- ===================================
-- 2. updated_at 自動更新トリガー
-- ===================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 3. Clerk ユーザーID取得関数
-- ===================================
-- カスタムヘッダーからClerkのユーザーIDを取得する関数
CREATE OR REPLACE FUNCTION get_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  -- リクエストヘッダーからClerkのユーザーIDを取得
  RETURN current_setting('request.headers', true)::json->>'x-clerk-user-id';
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- 4. Row Level Security (RLS) の設定
-- ===================================
-- RLSを有効化
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 閲覧ポリシー: ユーザーは自分の支出のみ閲覧可能
CREATE POLICY "Users can view their own expenses"
ON expenses FOR SELECT
USING (
  user_id = get_clerk_user_id()
  OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- 作成ポリシー: ユーザーは自分の支出のみ作成可能
CREATE POLICY "Users can insert their own expenses"
ON expenses FOR INSERT
WITH CHECK (
  user_id = get_clerk_user_id()
  OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- 更新ポリシー: ユーザーは自分の支出のみ更新可能
CREATE POLICY "Users can update their own expenses"
ON expenses FOR UPDATE
USING (
  user_id = get_clerk_user_id()
  OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- 削除ポリシー: ユーザーは自分の支出のみ削除可能
CREATE POLICY "Users can delete their own expenses"
ON expenses FOR DELETE
USING (
  user_id = get_clerk_user_id()
  OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- ===================================
-- 5. コメント（ドキュメンテーション）
-- ===================================
COMMENT ON TABLE expenses IS '支出データを管理するテーブル';
COMMENT ON COLUMN expenses.id IS '支出の一意識別子';
COMMENT ON COLUMN expenses.user_id IS 'ClerkのユーザーID（TEXT型）';
COMMENT ON COLUMN expenses.amount IS '支出金額（正の数値のみ）';
COMMENT ON COLUMN expenses.category IS 'カテゴリ（固定9種類から選択）';
COMMENT ON COLUMN expenses.created_at IS '作成日時';
COMMENT ON COLUMN expenses.updated_at IS '更新日時（自動更新）';
