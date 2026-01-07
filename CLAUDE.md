# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

これは `create-next-app` でブートストラップされた Next.js 16.1.1 アプリケーションで、以下を使用しています：
- **React 19.2.3** と React DOM 19.2.3
- **TypeScript** （strictモード有効）
- **Tailwind CSS v4** （新しいPostCSSプラグインアプローチを使用）
- **App Router** アーキテクチャ（Pages Routerではありません）
- **ESLint** （Next.js推奨設定）
- **Supabase** （Dockerを使用しない設定 - 方法１）

## 開発コマンド

```bash
# 開発サーバーを起動（http://localhost:3000で実行）
npm run dev

# 本番用にビルド
npm run build

# 本番サーバーを起動（事前にビルドが必要）
npm run start

# リンターを実行
npm run lint
```

## アーキテクチャ

### App Router構造
このプロジェクトはNext.js App Routerを使用しています（Pages Routerではありません）。すべてのルートは `app/` ディレクトリで定義されます：
- `app/layout.tsx` - すべてのページをラップするルートレイアウトコンポーネント
- `app/page.tsx` - ホームページコンポーネント（`/` にマッピング）
- `app/globals.css` - Tailwind CSS v4をインポートしたグローバルスタイル

### TypeScript設定
- パスエイリアス `@/*` はプロジェクトルートにマップされます（tsconfig.json:21-23で定義）
- strictモードが有効で、noEmit設定（型チェックのみ、コンパイルなし）
- Target: ES2017、ESNextモジュール
- JSX変換: react-jsx（Reactをインポートする必要なし）

### スタイリング設定
このプロジェクトは **Tailwind CSS v4** を使用しており、v3とは異なる設定になっています：
- globals.cssで `@import "tailwindcss"` を使用してインポート（従来のtailwind.config.jsはなし）
- CSS変数は `@theme inline` ディレクティブで定義
- PostCSSプラグイン `@tailwindcss/postcss` を使用
- ダークモードは `prefers-color-scheme` メディアクエリで処理
- テーマ用カスタムCSS変数：`--background`、`--foreground`、`--font-geist-sans`、`--font-geist-mono`

### フォント読み込み
- `next/font/google` を使用したNext.jsフォント最適化
- フォント：Geist（sans）とGeist Mono、latinサブセットで読み込み
- フォント変数はlayout.tsx:5-13でCSS変数として注入

### Supabase設定
このプロジェクトではSupabaseをバックエンドとして使用しています：
- **Dockerを使用しない設定（方法１）** を採用
- 詳細な使い方とセットアップ手順は `.claude/supabase_document.md` を参照
- Supabaseのクライアント設定やAPI使用方法については、上記ドキュメントを確認してください

## 主要パターン

### コンポーネントアーキテクチャ
- デフォルトでServer Components（フックやインタラクティブ性を使用しない限り "use client" は不要）
- SEO用にlayout.tsxからメタデータをエクスポート
- 最適化された画像には `next/image` のImageコンポーネントを使用

### ダークモード
ダークモードはJavaScriptではなく、CSS `prefers-color-scheme` メディアクエリで実装されています（globals.css:15-20）。ダークモードのスタイリングはシステム設定に基づいて自動的に適用されます。

## ESLint設定
Next.js ESLintプリセットを使用（eslint.config.mjs）：
- `eslint-config-next/core-web-vitals` - Core Web Vitalsルール
- `eslint-config-next/typescript` - TypeScript固有のルール
- 無視対象：`.next/`、`out/`、`build/`、`next-env.d.ts`
