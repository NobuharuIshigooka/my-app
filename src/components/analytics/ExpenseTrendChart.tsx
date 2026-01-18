"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TrendData {
  label: string;
  date: string;
  amount: number;
}

interface ExpenseTrendChartProps {
  data: TrendData[];
  period: "daily" | "weekly" | "monthly";
}

const PERIOD_LABELS = {
  daily: "過去7日間の推移",
  weekly: "過去4週間の推移",
  monthly: "過去6ヶ月の推移",
};

export function ExpenseTrendChart({ data, period }: ExpenseTrendChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const average = data.length > 0 ? total / data.length : 0;

  return (
    <Card className="border-2 border-gray-200 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            支出推移
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-gray-600">{PERIOD_LABELS[period]}</p>
            <p className="text-sm font-semibold text-gray-700">
              平均: ¥{Math.round(average).toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [
                  `¥${Number(value).toLocaleString()}`,
                  "支出金額",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "8px",
                }}
                labelStyle={{ color: "#374151", fontWeight: "bold" }}
              />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* サマリー */}
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-600">合計</p>
            <p className="text-lg font-bold text-gray-900">
              ¥{total.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">平均</p>
            <p className="text-lg font-bold text-gray-900">
              ¥{Math.round(average).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
