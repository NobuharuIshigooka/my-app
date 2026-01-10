# Supabase データベース設定

このディレクトリには、Money Trackerアプリのデータベース設定が含まれています。

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてサインイン
2. 「New project」をクリック
3. プロジェクト名を入力（例: `money-tracker-dev`）
4. データベースパスワードを設定
5. リージョンを選択（日本の場合は東京推奨）

### 2. 環境変数の設定

プロジェクトダッシュボード → Settings → API から以下を取得し、`.env.local`に設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. マイグレーションの実行

Supabase SQL Editorで以下のマイグレーションファイルを実行：

#### 実行順序

1. `migrations/20250110000001_create_expenses_table.sql`
   - expensesテーブルの作成
   - インデックスの作成
   - RLSポリシーの設定
   - Clerk連携用カスタム関数の作成

#### 実行方法

1. Supabaseダッシュボード → SQL Editor
2. 「New query」をクリック
3. マイグレーションファイルの内容をコピー&ペースト
4. 「Run」をクリックして実行

### 4. 動作確認

以下のクエリで正しくテーブルが作成されたか確認：

```sql
-- テーブルの確認
SELECT * FROM information_schema.tables
WHERE table_name = 'expenses';

-- RLSポリシーの確認
SELECT * FROM pg_policies
WHERE tablename = 'expenses';

-- カスタム関数の確認
SELECT * FROM pg_proc
WHERE proname = 'get_clerk_user_id';
```

## データベーススキーマ

### expenses テーブル

| カラム名   | 型           | 制約                                                      | 説明             |
| ---------- | ------------ | --------------------------------------------------------- | ---------------- |
| id         | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()                    | 支出ID           |
| user_id    | TEXT         | NOT NULL                                                  | ClerkユーザーID  |
| amount     | NUMERIC(10,2)| NOT NULL, CHECK (amount > 0)                              | 支出金額         |
| category   | TEXT         | NOT NULL, CHECK (category IN (...))                       | カテゴリ（固定9種類）|
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                   | 作成日時         |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                   | 更新日時         |

### カテゴリ一覧

- 食費
- 日用品
- 交通費
- 娯楽
- 衣服・美容
- 医療・健康
- 住居費
- 通信費
- その他

## RLSポリシー

- **SELECT**: ユーザーは自分の支出のみ閲覧可能
- **INSERT**: ユーザーは自分の支出のみ作成可能
- **UPDATE**: ユーザーは自分の支出のみ更新可能
- **DELETE**: ユーザーは自分の支出のみ削除可能

RLSはClerkのユーザーIDとカスタムヘッダー（`x-clerk-user-id`）を使用して実装されています。

## トラブルシューティング

### RLSポリシーが正しく動作しない

1. `get_clerk_user_id()`関数が正しく作成されているか確認
2. API Routesでカスタムヘッダーが正しく設定されているか確認（`src/lib/supabase.ts`）
3. Supabaseクライアントが認証済みクライアント（`createAuthenticatedSupabaseClient`）を使用しているか確認

### マイグレーションの実行エラー

- すでにテーブルが存在する場合は、`DROP TABLE expenses CASCADE;`で削除してから再実行
- 関数が存在する場合は、`DROP FUNCTION get_clerk_user_id();`で削除してから再実行

## 参考ドキュメント

- `.claude/supabase_document.md` - Supabase実装ガイド
- `.claude/clerk_supabase_integration_document` - ClerkとSupabaseの連携ガイド
- `src/types/database.ts` - TypeScript型定義
- `src/lib/supabase.ts` - Supabaseクライアント設定
