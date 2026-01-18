"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface CategoryBarChartProps {
  data: CategoryData[];
}

/**
 * カテゴリ別支出の棒グラフコンポーネント
 */
export function CategoryBarChart({ data }: CategoryBarChartProps) {
  // データが空の場合
  if (data.length === 0) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            カテゴリ別金額
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
          <BarChart3 className="h-5 w-5 text-blue-500" />
          カテゴリ別金額
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              formatter={(value) => [`¥${Number(value).toLocaleString()}`, "支出金額"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="支出金額" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
