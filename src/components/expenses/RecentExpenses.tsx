"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Loader2 } from "lucide-react";
import { Expense } from "@/types/database";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface RecentExpensesProps {
  onUpdate?: () => void;
}

/**
 * 最近の支出一覧コンポーネント
 */
export function RecentExpenses({ onUpdate }: RecentExpensesProps) {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchRecentExpenses();
  }, []);

  const fetchRecentExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/expenses?limit=10");

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const result = await response.json();
      setExpenses(result.data || []);
    } catch (error) {
      console.error("Failed to fetch recent expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Receipt className="h-5 w-5 text-purple-500" />
            最近の支出
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
          <Receipt className="h-5 w-5 text-purple-500" />
          最近の支出
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            支出の記録がありません
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    日付
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    カテゴリ
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                    金額
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 text-sm text-gray-600">
                      {format(new Date(expense.created_at), "M月d日(E)", {
                        locale: ja,
                      })}
                    </td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-900">
                      ¥{expense.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
