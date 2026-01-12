"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryTotal {
  category: string;
  total: number;
}

/**
 * カテゴリー別支出コンポーネント
 * プログレスバーで各カテゴリの支出割合を表示
 */
export function CategoryBreakdown() {
  const [loading, setLoading] = useState(true);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [maxTotal, setMaxTotal] = useState(0);

  useEffect(() => {
    fetchCategoryBreakdown();
  }, []);

  const fetchCategoryBreakdown = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expenses/summary");

      if (!response.ok) {
        throw new Error("Failed to fetch category breakdown");
      }

      const data = await response.json();
      const totals = data.categoryTotals || [];
      setCategoryTotals(totals);

      // 最大値を取得（プログレスバーの基準）
      if (totals.length > 0) {
        setMaxTotal(Math.max(...totals.map((c: CategoryTotal) => c.total)));
      }
    } catch (error) {
      console.error("Failed to fetch category breakdown:", error);
    } finally {
      setLoading(false);
    }
  };

  // カテゴリごとの色を定義
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      食費: "bg-red-500",
      日用品: "bg-orange-500",
      交通費: "bg-yellow-500",
      娯楽: "bg-green-500",
      "衣服・美容": "bg-blue-500",
      "医療・健康": "bg-indigo-500",
      住居費: "bg-purple-500",
      通信費: "bg-pink-500",
      その他: "bg-gray-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <PieChart className="h-5 w-5 text-purple-500" />
            カテゴリー別支出
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* スケルトンローディング */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </div>
              <Skeleton className="h-2 w-full bg-gray-100" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <PieChart className="h-5 w-5 text-purple-500" />
          カテゴリー別支出（今月）
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryTotals.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            今月の支出はまだありません
          </p>
        ) : (
          categoryTotals.map(({ category, total }) => {
            const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
            const colorClass = getCategoryColor(category);

            return (
              <div key={category} className="space-y-2">
                {/* カテゴリ名と金額 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ¥{total.toLocaleString()}
                  </span>
                </div>

                {/* プログレスバー */}
                <div className="relative">
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={colorClass}
                  />
                  <span className="absolute right-0 top-3 text-xs text-gray-500">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
