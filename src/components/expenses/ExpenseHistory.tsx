"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Loader2 } from "lucide-react";
import { Expense } from "@/types/database";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 支出履歴コンポーネント
 * すべての支出を表形式で表示
 */
export function ExpenseHistory() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // より多くのデータを取得
      const response = await fetch("/api/expenses?limit=100");

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const result = await response.json();
      setExpenses(result.data || []);
      setTotal(result.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-gray-300 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <History className="h-5 w-5 text-indigo-500" />
            すべての支出
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <History className="h-5 w-5 text-indigo-500" />
            すべての支出
          </CardTitle>
          <div className="text-sm text-gray-600">
            合計 <span className="font-semibold text-gray-900">{total}件</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="py-12 text-center">
            <History className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              支出の記録がありません
            </p>
            <p className="mt-1 text-xs text-gray-400">
              ダッシュボードから支出を記録してみましょう
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    日付
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    カテゴリ
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                    金額
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                    登録日時
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 text-sm text-gray-600">
                      {format(new Date(expense.created_at), "yyyy年M月d日(E)", {
                        locale: ja,
                      })}
                    </td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 text-right text-base font-semibold text-gray-900">
                      ¥{expense.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-xs text-gray-500">
                      {format(new Date(expense.created_at), "HH:mm", {
                        locale: ja,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={2} className="py-3 text-sm font-semibold text-gray-700">
                    合計
                  </td>
                  <td className="py-3 text-right text-lg font-bold text-gray-900">
                    ¥
                    {expenses
                      .reduce((sum, expense) => sum + Number(expense.amount), 0)
                      .toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
