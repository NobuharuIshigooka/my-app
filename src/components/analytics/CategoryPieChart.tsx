"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

// カテゴリごとの色定義
const COLORS: Record<string, string> = {
  食費: "#ef4444",
  日用品: "#f97316",
  交通費: "#eab308",
  娯楽: "#22c55e",
  "衣服・美容": "#3b82f6",
  "医療・健康": "#6366f1",
  住居費: "#a855f7",
  通信費: "#ec4899",
  その他: "#6b7280",
};

/**
 * カテゴリ別支出の円グラフコンポーネント
 */
export function CategoryPieChart({ data }: CategoryPieChartProps) {
  // データが空の場合
  if (data.length === 0) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <PieChartIcon className="h-5 w-5 text-purple-500" />
            カテゴリ別割合
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-gray-500">データがありません</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <PieChartIcon className="h-5 w-5 text-purple-500" />
          カテゴリ別割合
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || COLORS["その他"]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`¥${Number(value).toLocaleString()}`, "金額"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
