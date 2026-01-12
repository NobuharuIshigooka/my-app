"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryTotal {
  category: string;
  total: number;
}

/**
 * 今週の支出サマリーコンポーネント
 */
export function WeeklySummary() {
  const [loading, setLoading] = useState(true);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    fetchWeeklySummary();
  }, []);

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expenses/summary/weekly");

      if (!response.ok) {
        throw new Error("Failed to fetch weekly summary");
      }

      const data = await response.json();
      setWeeklyTotal(data.total);
      setCategoryTotals(data.categoryTotals);
    } catch (error) {
      console.error("Failed to fetch weekly summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="h-5 w-5 text-orange-500" />
            今週の支出
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* スケルトンローディング */}
          <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4">
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="mt-2 h-8 w-32 bg-gray-300" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-200" />
            <div className="space-y-1">
              <Skeleton className="h-10 w-full bg-gray-100" />
              <Skeleton className="h-10 w-full bg-gray-100" />
              <Skeleton className="h-10 w-full bg-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Calendar className="h-5 w-5 text-orange-500" />
          今週の支出
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 合計金額 */}
        <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4">
          <p className="text-sm text-gray-600">合計</p>
          <p className="text-3xl font-bold text-gray-900">
            ¥{weeklyTotal.toLocaleString()}
          </p>
        </div>

        {/* カテゴリ別内訳 */}
        {categoryTotals.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">カテゴリ別</p>
            <div className="space-y-1">
              {categoryTotals.map(({ category, total }) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                >
                  <span className="text-sm text-gray-700">{category}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {categoryTotals.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4">
            今週の支出はまだありません
          </p>
        )}
      </CardContent>
    </Card>
  );
}
