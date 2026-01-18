"use client";

import dynamic from "next/dynamic";

// Clerk の PricingTable を動的インポート
// SSRを無効にしてクライアントサイドでのみロード
const PricingTable = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-96 rounded-lg bg-gray-200"></div>
      </div>
    ),
  }
);

/**
 * Clerk Billing PricingTable の動的ロードコンポーネント
 * Clerkダッシュボードで設定したプランを自動表示
 */
export function DynamicPricingTable() {
  return (
    <div className="my-8">
      <PricingTable />
    </div>
  );
}
