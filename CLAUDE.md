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
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth)/            # 認証関連ページ
│   │   ├── (dashboard)/       # ダッシュボード（認証必須）
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # 共通コンポーネント
│   ├── lib/                   # ユーティリティ、設定
│   └── types/                 # TypeScript型定義
├── .claude/                   # プロジェクトドキュメント
│   ├── requirements.md        # 要件定義書
│   ├── development_roadmap.md # 開発ロードマップ（進捗管理）
│   ├── design_system.md       # デザインシステム
│   ├── supabase_document.md   # Supabase実装ガイド
│   ├── clerk_document.md      # Clerk実装ガイド
│   └── clerk_supabase_integration_document.md
└── public/                    # 静的ファイル
```

## アーキテクチャ

### 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript（strict モード）
- **スタイリング**: Tailwind CSS v4 + shadcn/ui
- **認証**: Clerk（メール認証、課金管理）
- **データベース**: Supabase（PostgreSQL）
- **ホスティング**: Vercel

### 主要な実装方針

- **Supabase**: クラウド版を使用（Docker は使用しない）
- **認証連携**: API Routes 経由で Supabase にアクセス（Service Role キー使用）
- **課金**: Clerk Billing でプラン管理（スラグ: "premium"）
- **テスト**: MVP 目的のためテストは書かない

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
