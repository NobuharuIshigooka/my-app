# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**Money Tracker** - シンプルで継続できる家計簿アプリ

「3 つの機能だけ。続けられる家計簿」をコンセプトに、支出記録、カテゴリ分け、ダッシュボード表示の必要最小限の機能で構成されています。

## 開発ロードマップと進捗管理

開発は`.claude/development_roadmap.md`のチェックリストに従って進めます。

### タスク管理方法

- 各フェーズの実装内容はチェックリスト形式で記載
- 完了したタスクは`[ ]`を`[x]`に変更して記録
- フェーズ 1 から順番に実装を進める

```markdown
# 実装前

- [ ] パッケージインストール（Supabase, Clerk, shadcn/ui）

# 実装後

- [x] パッケージインストール（Supabase, Clerk, shadcn/ui）
```

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動（Turbopack使用）
npm run build    # プロダクションビルド
npm start        # プロダクションサーバー起動
npm run lint     # ESLint実行
npm install      # パッケージインストール
```

## 環境設定

### 必要な環境変数（.env.local）

以下は設定済みとする。

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Billing Portal URL
NEXT_PUBLIC_BILLING_URL=https://accounts.your-domain.com/user
```

## プロジェクト構造

```
my-app/
├── app/                          # App Router（Next.js 16.1.1）
│   ├── api/expenses/            # 支出管理API
│   │   ├── route.ts             # POST（作成）、GET（一覧取得）
│   │   └── summary/             # サマリーAPI
│   │       ├── route.ts         # 今月の支出サマリー
│   │       └── weekly/route.ts  # 今週の支出サマリー
│   ├── dashboard/page.tsx       # ダッシュボード（認証必須）
│   ├── history/page.tsx         # 支出履歴（認証必須）
│   ├── pricing/page.tsx         # 料金プラン（公開）
│   ├── sign-in/                 # Clerkサインインページ
│   ├── sign-up/                 # Clerkサインアップページ
│   ├── layout.tsx               # ルートレイアウト
│   ├── providers.tsx            # ClerkProvider + Toaster
│   ├── error.tsx                # エラーバウンダリー
│   └── not-found.tsx            # 404ページ
├── src/
│   ├── components/
│   │   ├── expenses/            # 支出関連コンポーネント
│   │   │   ├── ExpenseForm.tsx           # 支出記録フォーム
│   │   │   ├── MonthlySummary.tsx        # 今月の支出サマリー
│   │   │   ├── WeeklySummary.tsx         # 今週の支出サマリー
│   │   │   ├── CategoryBreakdown.tsx     # カテゴリ別支出（プログレスバー）
│   │   │   ├── RecentExpenses.tsx        # 最近の支出一覧
│   │   │   └── ExpenseHistory.tsx        # 支出履歴（全件）
│   │   ├── layout/              # レイアウトコンポーネント
│   │   │   ├── Header.tsx                # ヘッダー（ナビゲーション + UserButton）
│   │   │   ├── MainLayout.tsx            # メインレイアウトラッパー
│   │   │   └── Container.tsx             # コンテナ（max-width制御）
│   │   └── ui/                  # shadcn/uiコンポーネント
│   ├── lib/
│   │   ├── supabase.ts          # Supabaseクライアント（認証統合）
│   │   ├── utils.ts             # ユーティリティ（cn関数）
│   │   └── validations/
│   │       └── expense.ts       # Zodバリデーションスキーマ
│   └── types/
│       └── database.ts          # Supabase型定義（Database, Expense）
├── .claude/                     # プロジェクトドキュメント
│   ├── requirements.md          # 要件定義書
│   ├── development_roadmap.md   # 開発ロードマップ（進捗管理）
│   ├── design_system.md         # デザインシステム
│   ├── supabase_document.md     # Supabase実装ガイド
│   ├── clerk_document.md        # Clerk実装ガイド
│   └── clerk_supabase_integration_document.md
├── supabase/migrations/         # データベースマイグレーション
│   └── 20250110000001_create_expenses_table.sql
└── middleware.ts                # Clerk認証ミドルウェア
```

## アーキテクチャ

### 技術スタック

- **フレームワーク**: Next.js 16.1.1（App Router、Turbopack）
- **言語**: TypeScript（strict モード）
- **スタイリング**: Tailwind CSS v4 + shadcn/ui（New York style）
- **認証**: Clerk（メール認証、課金管理）
- **データベース**: Supabase（PostgreSQL、クラウド版）
- **フォーム**: react-hook-form + Zod
- **日付処理**: date-fns
- **UI通知**: Sonner（トースト）
- **ホスティング**: Vercel

### アーキテクチャの特徴

**認証とデータベースの統合:**
- Clerk認証とSupabase RLS（Row Level Security）を統合
- カスタムヘッダー（`x-clerk-user-id`）でClerkのuserIdをSupabaseに渡す
- Supabaseの`get_clerk_user_id()`関数でRLSポリシーを実装
- 認証が必要なルートは`middleware.ts`で保護

**API設計:**
- RESTful API（`/api/expenses`）
- 認証済みクライアント（`createAuthenticatedSupabaseClient`）を経由
- 一貫したエラーハンドリング（401 認証エラー、500 サーバーエラー）

**データモデル:**
- 支出（expenses）テーブル: user_id、amount、category、created_at
- 9つの固定カテゴリ（食費、日用品、交通費、娯楽、衣服・美容、医療・健康、住居費、通信費、その他）
- RLSポリシーでユーザーごとのデータ分離

**UI/UXパターン:**
- スケルトンローディング（Skeleton コンポーネント）
- レスポンシブデザイン（モバイルファースト）
- アニメーション（fade-in、slide-in、zoom-in、hover効果）
- 2カラムグリッドレイアウト（`lg:grid-cols-2`）

## 重要なドキュメント

### 要件定義

`.claude/requirements.md` - プロジェクトの詳細な要件定義

### 開発ロードマップ

`.claude/development_roadmap.md` - 5 つのフェーズで構成される開発計画と進捗管理

### デザインシステム

`.claude/design_system.md` - UI コンポーネントのデザインガイドライン

### 実装ガイド

- `.claude/supabase_document.md` - Supabase 実装方法（方法 1 を採用）
- `.claude/clerk_document.md` - Clerk 認証・課金の実装
- `.claude/clerk_supabase_integration_document.md` - 認証連携の実装

## コーディング規約

### TypeScript

- パスエイリアス: `@/*` → `src/*`
- 型定義は`src/types/`に集約
- strict モードを維持

### コンポーネント

- 関数コンポーネントで統一
- shadcn/ui コンポーネントを優先使用
- デザインシステムに従ったスタイリング

### git 管理

- 各フェーズ完了時にコミット
- 意味のある単位でコミットメッセージを記述

## 開発時の注意事項

- Clerk Billing のプランスラグは必ず「premium」に設定
- user_id フィールドは TEXT 型（Clerk の ID 形式に対応）
- 環境変数は`.env.local`に正しく記載されている前提で進め、必要に応じ example ファイルを作成
  - `.env.local` を Claude Code が読み込むことは絶対に避ける
- デザインシステム（`.claude/design_system.md`）を厳守

## 開発の流れ

1. これから行うタスクを理解する
2. タスクに関する `.claude` 内のドキュメントの内容を理解する
3. 設計を行う
4. 実装を進める
5. 実装完了後、結果に関してユーザーに動作確認方法を伝える

## 実装パターンとベストプラクティス

### Clerk + Supabase 統合

カスタムヘッダーアプローチを使用してRLSポリシーとClerk認証を統合：

```typescript
// src/lib/supabase.ts
export async function createAuthenticatedSupabaseClient() {
  const { userId } = await auth();
  if (!userId) throw new Error("認証が必要です");

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { "x-clerk-user-id": userId },
    },
  });
  return { supabase, userId };
}
```

Supabase側では`get_clerk_user_id()`関数でヘッダーから認証情報を取得：

```sql
CREATE OR REPLACE FUNCTION get_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.headers', true)::json->>'x-clerk-user-id';
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Zodバリデーションとreact-hook-form統合

**重要**: Zodの`.default()`と`.optional()`の組み合わせに注意

```typescript
// ❌ 避けるべきパターン - 型の不一致が発生
date: z.string().optional().default(() => new Date().toISOString().split("T")[0])

// ✅ 推奨パターン1 - デフォルト値がある場合は必須にする
date: z.string().default(() => new Date().toISOString().split("T")[0])

// ✅ 推奨パターン2 - バリデーションで必須にする
date: z.string().min(1, "日付を入力してください")
```

理由: `.optional().default()`は入力型を`string | undefined`にするが、出力型は`string`になり、react-hook-formとの型不一致が発生する。

### Supabase 型定義と型推論

**型推論の問題**: Supabaseクライアントの型推論が正しく動作しない場合、`.returns<Type>()`を使用：

```typescript
// ❌ 型推論が失敗する場合
const { data: expenses, error } = await supabase
  .from("expenses")
  .select("*");
// expenses の型が never[] になる

// ✅ 明示的に型を指定
const { data: expenses, error } = await supabase
  .from("expenses")
  .select("*")
  .returns<Expense[]>();
// expenses の型が Expense[] になる
```

**Database型の定義**:

```typescript
export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, "id" | "created_at" | "updated_at">;
        Update: ExpenseUpdate;
      };
    };
  };
};
```

### date-fns での日本語日付フォーマット

```typescript
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// 日本語ロケールを使用した日付フォーマット
format(new Date(expense.created_at), "M月d日(E)", { locale: ja })
// 出力例: "1月11日(土)"
```

### API Route のエラーハンドリングパターン

一貫したエラーハンドリング構造：

```typescript
export async function POST(request: NextRequest) {
  try {
    const { supabase, userId } = await createAuthenticatedSupabaseClient();

    // ビジネスロジック
    const { data, error } = await supabase.from("expenses").insert({...});

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "エラーメッセージ", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
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
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
```

### コンポーネントのローディング状態管理

```typescript
export function Component() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Type[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/endpoint");
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return <Content data={data} />;
}
```

### レスポンシブレイアウトパターン

Tailwind CSSのグリッドレイアウトでレスポンシブ対応：

```tsx
{/* モバイル: 1カラム、大画面: 2カラム */}
<div className="grid gap-6 lg:grid-cols-2">
  <FormComponent />
  <SummaryComponent />
</div>
```

### アニメーションパターン

Tailwind CSSのアニメーションユーティリティを使用：

```tsx
{/* フェードイン + スライドイン */}
<h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000">

{/* 段階的表示（遅延アニメーション） */}
<div className="animate-in fade-in duration-700 delay-200">

{/* ホバー時の拡大効果 */}
<button className="transition-all hover:scale-105 hover:shadow-lg">
```

## API エンドポイント

### 支出管理API

**POST /api/expenses** - 支出の作成
- リクエスト: `{ amount: number, category: string, date: string }`
- レスポンス: `{ message: string, data: Expense }`
- 認証: 必須（Clerk）

**GET /api/expenses** - 支出一覧の取得
- クエリパラメータ: `limit` (デフォルト: 50), `offset` (デフォルト: 0)
- レスポンス: `{ data: Expense[], pagination: { total, limit, offset } }`
- 認証: 必須（Clerk）
- RLSによりログインユーザーのデータのみ返却

**GET /api/expenses/summary** - 今月の支出サマリー
- レスポンス: `{ total: number, categoryTotals: CategoryTotal[], count: number }`
- 今月の開始日〜終了日で集計

**GET /api/expenses/summary/weekly** - 今週の支出サマリー
- レスポンス: `{ total: number, categoryTotals: CategoryTotal[], count: number }`
- 今週（月曜日〜日曜日）で集計

## 主要コンポーネント

### 支出関連コンポーネント

**ExpenseForm** - 支出記録フォーム
- react-hook-form + Zod バリデーション
- 金額、カテゴリ、日付の入力
- Sonner トースト通知

**MonthlySummary / WeeklySummary** - 期間別サマリー
- 合計金額表示
- カテゴリ別内訳（金額順）
- スケルトンローディング

**CategoryBreakdown** - カテゴリ別支出
- プログレスバーで視覚化
- カテゴリごとに色分け
- 最大値を基準とした相対表示

**RecentExpenses** - 最近の支出一覧
- テーブル形式表示（最新10件）
- 日付、カテゴリ、金額

**ExpenseHistory** - 支出履歴
- 全件表示（最大100件）
- テーブルフッターに合計金額

## トラブルシューティング

### Clerk UserButton の z-index 問題

**症状**: UserButtonのドロップダウンメニューが他の要素の下に隠れる

**解決方法**: `app/globals.css`にz-indexを追加

```css
/* Clerk UserButton z-index fix */
.cl-userButtonPopoverCard,
.cl-userButtonPopoverActionButton,
.cl-profileSectionPrimaryButton,
.cl-userProfile,
.cl-userProfilePopoverCard,
.cl-modal,
.cl-modalBackdrop,
.cl-modalContent {
  z-index: 9999 !important;
}
```

### Zod enum パラメータエラー

**症状**: `z.enum()`に`required_error`や`invalid_type_error`を渡すとエラー

```typescript
// ❌ エラーが発生
category: z.enum(EXPENSE_CATEGORIES, {
  required_error: "カテゴリを選択してください",
  invalid_type_error: "有効なカテゴリを選択してください",
})

// ✅ 正しい方法
category: z.enum(EXPENSE_CATEGORIES, {
  message: "カテゴリを選択してください",
})
```

### Supabase INSERT 型エラー

**症状**: `.insert()`で「No overload matches this call」エラー

**解決方法**:
1. Database型のInsert型を正しく定義
2. 必要に応じて`as any`で型アサーション（一時的な回避策）

```typescript
// Database型定義で Insert 型を明示
Insert: Omit<Expense, "id" | "created_at" | "updated_at">

// 使用時
await supabase.from("expenses").insert({
  user_id: userId,
  amount: parseFloat(amount),
  category,
} as any)
```

## 参考リソース

- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Clerk + Next.js 統合ガイド](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase + Next.js ガイド](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [shadcn/ui コンポーネント](https://ui.shadcn.com/)
- [Tailwind CSS v4 ドキュメント](https://tailwindcss.com/docs)
- [Zod バリデーションライブラリ](https://zod.dev/)
- [react-hook-form ドキュメント](https://react-hook-form.com/)
