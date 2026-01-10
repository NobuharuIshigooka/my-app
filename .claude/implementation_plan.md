# Money Tracker 実装計画書

このドキュメントは要件定義書（requirements.md）に基づいた実装の順番とタスクをまとめたものです。

## 実装の基本方針

1. **ボトムアップアプローチ**: 基盤から順に積み上げる
2. **段階的リリース**: 無料版を先に完成させ、その後プレミアム機能を追加
3. **依存関係の考慮**: 認証 → データ管理 → UI という順序で進める

---

## フェーズ 1: 環境セットアップと基盤構築 【最優先】

### 1.1 パッケージインストール
- [ ] 必要なパッケージをインストール
  - Clerk関連: `@clerk/nextjs`
  - Supabase関連: `@supabase/supabase-js`
  - UI関連: `shadcn/ui`の初期化、`lucide-react`
  - フォーム: `react-hook-form`
  - 日時: `date-fns`, `date-fns-tz`
  - グラフ（後で使用）: `recharts`
  - コード品質: `prettier`（既にESLintは設定済み）

### 1.2 Supabaseセットアップ
- [ ] Supabaseプロジェクトの作成（Webダッシュボード）
- [ ] 環境変数の設定（`.env.local`）
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`（サーバーサイド用）
- [ ] Supabase CLIのインストール
- [ ] ローカル開発環境の初期化（`supabase init`）
- [ ] 参考ドキュメント: `.claude/supabase_document.md`

### 1.3 Clerkセットアップ
- [ ] Clerkプロジェクトの作成（Clerkダッシュボード）
- [ ] 環境変数の設定（`.env.local`）
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
- [ ] Clerkプロバイダーの設定（`app/layout.tsx`）
- [ ] 参考ドキュメント: `.claude/clerk_document.md`

### 1.4 データベーススキーマ設計
- [ ] `expenses`テーブルの作成
  ```sql
  - id: uuid (primary key)
  - user_id: text (Clerk user ID)
  - amount: numeric (支出金額)
  - category: text (カテゴリ名)
  - created_at: timestamptz (記録日時)
  - updated_at: timestamptz (更新日時)
  ```
- [ ] Row Level Security (RLS) ポリシーの設定
  - ユーザーは自分のデータのみ閲覧・編集可能
- [ ] マイグレーションファイルの作成
- [ ] 参考ドキュメント: `.claude/clerk_supabase_integration_document`

---

## フェーズ 2: 認証とレイアウト 【高優先度】

### 2.1 認証ページの作成
- [ ] `/sign-in`ページの作成
  - Clerkの`<SignIn />`コンポーネントを配置
- [ ] `/sign-up`ページの作成
  - Clerkの`<SignUp />`コンポーネントを配置
- [ ] 認証後のリダイレクト設定

### 2.2 共通レイアウトの実装
- [ ] ヘッダーコンポーネントの作成
  - ロゴ表示
  - ナビゲーション（ダッシュボード、料金）
  - ユーザーメニュー（Clerkの`<UserButton />`）
  - 未ログイン時: サインイン/サインアップボタン
- [ ] レスポンシブデザインの実装（モバイルファースト）
- [ ] フッターコンポーネントの作成（トップページ用）

### 2.3 Supabase + Clerk連携の実装
- [ ] Supabaseクライアントのセットアップ
  - Clerkのセッショントークンを使用したカスタムヘッダー方式
- [ ] サーバーサイドでの認証チェック
- [ ] クライアントサイドでのデータ取得用ヘルパー関数
- [ ] 参考ドキュメント: `.claude/clerk_supabase_integration_document`

---

## フェーズ 3: コア機能（支出記録） 【高優先度】

### 3.1 支出記録機能
- [ ] 支出記録フォームコンポーネントの作成
  - 金額入力フィールド
  - カテゴリ選択ドロップダウン（固定9種類）
  - 記録ボタン
  - react-hook-formを使用したバリデーション
- [ ] APIルートの作成（`/api/expenses` POST）
  - Clerk認証チェック
  - Supabaseへのデータ挿入
  - エラーハンドリング
- [ ] 記録成功時のフィードバック（トースト通知など）

### 3.2 支出履歴の閲覧
- [ ] 支出履歴リストコンポーネントの作成
  - 日付、金額、カテゴリの表示
  - 最新順でソート
  - 無限スクロールまたはページネーション
- [ ] APIルートの作成（`/api/expenses` GET）
  - ユーザーのデータのみ取得（RLS）
  - 日付でソート

### 3.3 支出データの編集・削除
- [ ] 編集機能
  - 編集モーダルまたはインラインエディット
  - APIルート（`/api/expenses/[id]` PUT）
- [ ] 削除機能
  - 削除確認ダイアログ
  - APIルート（`/api/expenses/[id]` DELETE）

---

## フェーズ 4: 無料版ダッシュボード 【中優先度】

### 4.1 ダッシュボードページの作成
- [ ] `/dashboard`ページの作成
- [ ] 認証ガードの実装（middleware.ts）
- [ ] レイアウト構成
  - 上部: 支出記録フォーム
  - 中部: サマリーカード（今週・今月の合計）
  - 下部: 支出履歴リスト

### 4.2 サマリーカードの実装
- [ ] 今週の支出合計を表示
  - 週の開始は月曜日
  - date-fnsで期間計算
- [ ] 今月の支出合計を表示
- [ ] データ集計APIの作成（`/api/expenses/summary` GET）
  - 期間パラメータ（week, month）
  - 合計金額を返す

### 4.3 基本的なスタイリング
- [ ] Tailwind CSSを使用したデザイン
- [ ] カードコンポーネントのスタイリング
- [ ] レスポンシブ対応の確認
- [ ] 参考ドキュメント: `.claude/tailwind_document.md`

---

## フェーズ 5: 公開ページ（LP） 【中優先度】

### 5.1 トップページの作成
- [ ] `/`ページの実装
  - ヒーローセクション: サービス名とキャッチコピー
  - 機能紹介セクション: 3つの主要機能
  - 料金プラン比較セクション
  - CTAボタン（サインアップへ誘導）
- [ ] フッターの配置

### 5.2 料金ページの作成
- [ ] `/pricing`ページの作成
  - 無料プランとプレミアムプランの比較表
  - プレミアム機能の詳細説明
  - サインアップCTA
- [ ] （課金実装後）Clerk Billing PricingTableの埋め込み

---

## フェーズ 6: Clerk Billing（課金機能） 【低優先度】

### 6.1 Clerk Billingの設定
- [ ] Clerkダッシュボードでプラン作成
  - プラン名: Premium
  - スラグ: `premium`（必須）
  - 価格: $10/月
- [ ] Stripeとの連携設定
- [ ] Webhook URLの設定
- [ ] 環境変数の追加（Stripe関連）

### 6.2 プラン管理機能
- [ ] ユーザーのプラン確認関数
  - Clerkの`has()`関数を使用
  - サーバーサイドでプレミアム機能の可否を判定
- [ ] 料金ページにPricingTableを配置
  - `@clerk/clerk-react`の`<PricingTable />`コンポーネント
- [ ] ダッシュボードにアップグレードボタンを配置

---

## フェーズ 7: プレミアム機能（高度な分析） 【低優先度】

### 7.1 期間切り替え機能
- [ ] タブコンポーネントの実装
  - 日次 / 週次 / 月次
  - アクティブタブのスタイリング（グラデーション）
  - スムーズなトランジション
- [ ] 期間セレクターの実装
  - 日次: 今日/昨日、カレンダーピッカー
  - 週次: 今週/先週、カスタム期間
  - 月次: 今月/先月、年月ピッカー

### 7.2 データ集計とグラフ表示
- [ ] カテゴリ別集計APIの作成
  - 期間パラメータに基づいた集計
  - カテゴリごとの金額を返す
- [ ] 円グラフの実装（Recharts）
  - カテゴリ別支出割合
- [ ] 棒グラフの実装（Recharts）
  - カテゴリ別支出額の比較
- [ ] トレンドラインの実装（日次のみ）
  - 時系列折れ線グラフ

### 7.3 比較機能と詳細表示
- [ ] 前期間比較の実装
  - 増減率の計算と表示
  - カラーコーディング（増加:赤、減少:緑）
- [ ] サマリーカードの拡張
  - 期間内の総支出
  - 前期間比較
  - 1日平均支出額
  - 最も支出が多いカテゴリ
- [ ] 詳細グラフの実装
  - 日次: 時系列折れ線グラフ
  - 週次: 日別積み上げ棒グラフ
  - 月次: 週別トレンドライン

### 7.4 プレミアム専用UI
- [ ] アニメーション効果の追加
- [ ] グラデーションデザインの適用
- [ ] プレミアム感のあるスタイリング
- [ ] 無料ユーザーへのアップグレード促進UI

---

## フェーズ 8: 最終調整とリリース準備 【最後】

### 8.1 UI/UXの改善
- [ ] 全画面のレスポンシブ対応確認
- [ ] アクセシビリティチェック
- [ ] ローディング状態の追加
- [ ] エラー状態の改善
- [ ] 空状態（データがない場合）のUI

### 8.2 パフォーマンス最適化
- [ ] 支出記録が1秒以内で完了することを確認
- [ ] 画像の最適化
- [ ] バンドルサイズの確認
- [ ] Next.jsのキャッシュ戦略の最適化

### 8.3 セキュリティチェック
- [ ] 環境変数の確認（`.env.local`がgitignoreに含まれているか）
- [ ] RLSポリシーの再確認
- [ ] APIルートの認証チェック
- [ ] HTTPS通信の確認

### 8.4 デプロイ
- [ ] Vercelプロジェクトの作成
- [ ] 環境変数の設定（Vercelダッシュボード）
- [ ] Supabase本番環境への接続設定
- [ ] Clerk本番環境への接続設定
- [ ] デプロイとテスト

---

## 実装の優先順位まとめ

### 最優先（MVP動作に必須）
1. フェーズ1: 環境セットアップ
2. フェーズ2: 認証とレイアウト
3. フェーズ3: コア機能（支出記録）
4. フェーズ4: 無料版ダッシュボード

### 中優先（サービスの完成度）
5. フェーズ5: 公開ページ（LP）

### 低優先（マネタイズ機能）
6. フェーズ6: Clerk Billing
7. フェーズ7: プレミアム機能

### 最後（品質保証）
8. フェーズ8: 最終調整とリリース準備

---

## 開発時の注意事項（再掲）

- Clerk Billingは標準のnpmパッケージではなく、Clerkダッシュボードでの設定が必要
- Clerkダッシュボードでプランを作成する際は、スラグを「premium」に設定
- SupabaseとClerkの認証連携では、カスタムヘッダー方式でRLSを実装
- Supabaseローカル開発時はポート競合に注意（`supabase stop --all`で解決）
- Supabaseでユーザーテーブルを作る場合でも、ClerkのWebhook機能は使用しない
- プレミアム機能はClerkのhas()関数でプラン確認を行う
- テストは書かない（MVP目的のため）

---

## 参考ドキュメント

- **Supabaseセットアップ**: `.claude/supabase_document.md`
- **Clerk認証・課金**: `.claude/clerk_document.md`
- **Clerk + Supabase連携**: `.claude/clerk_supabase_integration_document`
- **Tailwind CSS**: `.claude/tailwind_document.md`
- **要件定義**: `.claude/requirements.md`
