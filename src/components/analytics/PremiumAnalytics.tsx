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
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
            <Lock className="h-6 w-6 text-blue-600" />
            プレミアム機能
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="rounded-lg border-2 border-blue-200 bg-white p-6 text-center">
            <p className="mb-4 text-lg font-semibold text-gray-900">
              月額 $10 でプレミアム機能を利用できます
            </p>
            <Button asChild size="lg" className="shadow-md hover:shadow-lg">
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
      {/* 期間切り替えタブ */}
      <Card className="border-2 border-gray-200 shadow-md">
        <CardContent className="pt-6">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">日次</TabsTrigger>
              <TabsTrigger value="weekly">週次</TabsTrigger>
              <TabsTrigger value="monthly">月次</TabsTrigger>
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

      {/* 追加機能の案内 */}
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                プレミアム機能をご利用中です
              </h3>
              <p className="text-sm text-gray-700">
                グラフ分析、期間別比較、CSVエクスポートがご利用いただけます
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
