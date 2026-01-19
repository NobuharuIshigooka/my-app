"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { CategoryPieChart } from "./CategoryPieChart";
import { ExpenseTrendChart } from "./ExpenseTrendChart";
import { PeriodComparison } from "./PeriodComparison";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Period = "daily" | "weekly" | "monthly";

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AnalyticsData {
  period: Period;
  current: {
    total: number;
    categoryTotals: Array<{ category: string; total: number }>;
    count: number;
  };
  previous: {
    total: number;
    categoryTotals: Array<{ category: string; total: number }>;
    count: number;
  };
  comparison: {
    difference: number;
    percentageChange: number;
    trend: "up" | "down" | "stable";
  };
}

interface TrendData {
  label: string;
  date: string;
  amount: number;
}

interface TrendResponse {
  period: Period;
  data: TrendData[];
  total: number;
}

/**
 * プレミアム分析コンポーネント
 * premiumプランのユーザーのみグラフを表示
 */
export function PremiumAnalytics() {
  const { has } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [period, setPeriod] = useState<Period>("monthly");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // プレミアムプランのチェック
    const checkPremium = async () => {
      const premium = has ? has({ plan: "premium" }) : false;
      setIsPremium(premium);
    };

    checkPremium();
  }, [has]);

  useEffect(() => {
    // データの取得
    if (isPremium) {
      fetchData();
    }
  }, [isPremium, period]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 分析データと推移データを並行取得
      const [analyticsResponse, trendResponse] = await Promise.all([
        fetch(`/api/expenses/analytics?period=${period}`),
        fetch(`/api/expenses/trend?period=${period}`),
      ]);

      if (!analyticsResponse.ok || !trendResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const analyticsData: AnalyticsData = await analyticsResponse.json();
      const trendDataResponse: TrendResponse = await trendResponse.json();

      setAnalyticsData(analyticsData);
      setTrendData(trendDataResponse.data);

      const chartData = analyticsData.current.categoryTotals.map((item) => ({
        name: item.category,
        value: item.total,
      }));
      setCategoryData(chartData);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ローディング中
  if (isPremium === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // プレミアムプランではない場合
  if (!isPremium) {
    return (
      <Card className="overflow-hidden border-2 border-blue-200 shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8">
          <CardHeader className="relative z-10 p-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
              <div className="rounded-full bg-white p-2 shadow-lg">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              プレミアム機能
            </CardTitle>
          </CardHeader>
          {/* 装飾的な背景パターン */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
        </div>
        <CardContent className="space-y-6 bg-white p-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  グラフで支出を視覚化
                </h3>
                <p className="text-gray-700">
                  円グラフと棒グラフでカテゴリ別の支出を一目で把握できます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  期間別比較機能
                </h3>
                <p className="text-gray-700">
                  日次・週次・月次で支出を比較し、トレンドを分析できます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  CSV エクスポート
                </h3>
                <p className="text-gray-700">
                  支出データをCSV形式でダウンロードして詳細分析が可能です
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-inner">
            <p className="mb-6 text-xl font-bold text-gray-900">
              月額 $10 でプレミアム機能を利用できます
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              <Link href="/pricing">プレミアムプランを見る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // プレミアムユーザー: グラフ表示
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 期間切り替えタブ - プレミアムデザイン */}
      <Card className="overflow-hidden border-2 border-gray-200 shadow-lg transition-all duration-200 hover:shadow-xl">
        <CardContent className="bg-gradient-to-r from-blue-50 to-indigo-50 pt-6">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
              <TabsTrigger
                value="daily"
                className="font-semibold transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600"
              >
                日次
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="font-semibold transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600"
              >
                週次
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="font-semibold transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600"
              >
                月次
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* 前期間比較 */}
      {analyticsData && (
        <PeriodComparison
          currentTotal={analyticsData.current.total}
          previousTotal={analyticsData.previous.total}
          difference={analyticsData.comparison.difference}
          percentageChange={analyticsData.comparison.percentageChange}
          trend={analyticsData.comparison.trend}
          period={period}
        />
      )}

      {/* グラフ表示 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryPieChart data={categoryData} />
        <ExpenseTrendChart data={trendData} period={period} />
      </div>

      {/* プレミアム利用中バッジ */}
      <Card className="overflow-hidden border-2 border-green-200 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-full bg-white p-2 shadow-md">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-white">
                プレミアム機能をご利用中です
              </h3>
              <p className="text-sm text-green-50">
                グラフ分析、期間別比較、CSVエクスポートがご利用いただけます
              </p>
            </div>
          </div>
          {/* 装飾的な背景パターン */}
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-green-400 opacity-20 blur-2xl"></div>
        </div>
      </Card>
    </div>
  );
}
