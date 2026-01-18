"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PeriodComparisonProps {
  currentTotal: number;
  previousTotal: number;
  difference: number;
  percentageChange: number;
  trend: "up" | "down" | "stable";
  period: "daily" | "weekly" | "monthly";
}

const PERIOD_LABELS = {
  daily: { current: "今日", previous: "昨日" },
  weekly: { current: "今週", previous: "先週" },
  monthly: { current: "今月", previous: "先月" },
};

export function PeriodComparison({
  currentTotal,
  previousTotal,
  difference,
  percentageChange,
  trend,
  period,
}: PeriodComparisonProps) {
  const labels = PERIOD_LABELS[period];
  const isIncrease = trend === "up";
  const isDecrease = trend === "down";
  const isStable = trend === "stable";

  return (
    <Card className="border-2 border-gray-200 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">前期間比較</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 現在の期間 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{labels.current}</span>
          <span className="text-2xl font-bold text-gray-900">
            ¥{currentTotal.toLocaleString()}
          </span>
        </div>

        {/* 前の期間 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{labels.previous}</span>
          <span className="text-lg font-semibold text-gray-600">
            ¥{previousTotal.toLocaleString()}
          </span>
        </div>

        {/* 差分 */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isIncrease && (
                <TrendingUp className="h-5 w-5 text-red-500" />
              )}
              {isDecrease && (
                <TrendingDown className="h-5 w-5 text-green-500" />
              )}
              {isStable && (
                <Minus className="h-5 w-5 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {labels.previous}と比較
              </span>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  isIncrease
                    ? "text-red-600"
                    : isDecrease
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {difference > 0 ? "+" : ""}
                ¥{difference.toLocaleString()}
              </div>
              <div
                className={`text-sm ${
                  isIncrease
                    ? "text-red-500"
                    : isDecrease
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {percentageChange > 0 ? "+" : ""}
                {percentageChange}%
              </div>
            </div>
          </div>
        </div>

        {/* メッセージ */}
        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-sm text-gray-700">
            {isIncrease && (
              <>
                {labels.previous}より
                <span className="font-semibold text-red-600">
                  ¥{Math.abs(difference).toLocaleString()}
                </span>
                支出が増えています
              </>
            )}
            {isDecrease && (
              <>
                {labels.previous}より
                <span className="font-semibold text-green-600">
                  ¥{Math.abs(difference).toLocaleString()}
                </span>
                節約できています
              </>
            )}
            {isStable && (
              <>
                {labels.previous}と同額の支出です
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
