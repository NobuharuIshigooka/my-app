"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { Expense } from "@/types/database";

interface CategoryTotal {
  category: string;
  total: number;
}

/**
 * 今月の支出サマリーコンポーネント
 */
export function MonthlySummary() {
  const [loading, setLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expenses/summary");

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setMonthlyTotal(data.total);
      setCategoryTotals(data.categoryTotals);
    } catch (error) {
      console.error("Failed to fetch monthly summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-5 w-5 text-green-500" />
            今月の支出
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="h-5 w-5 text-green-500" />
          今月の支出
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 合計金額 */}
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <p className="text-sm text-gray-600">合計</p>
          <p className="text-3xl font-bold text-gray-900">
            ¥{monthlyTotal.toLocaleString()}
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
            今月の支出はまだありません
          </p>
        )}
      </CardContent>
    </Card>
  );
}
