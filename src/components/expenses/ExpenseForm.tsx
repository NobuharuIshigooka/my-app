"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EXPENSE_CATEGORIES } from "@/types/database";
import { expenseFormSchema, type ExpenseFormData } from "@/lib/validations/expense";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

/**
 * 支出記録フォームコンポーネント
 */
export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: "",
      category: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(data.amount),
          category: data.category,
          date: data.date,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "支出の記録に失敗しました");
      }

      // 成功時の処理
      toast.success("支出を記録しました", {
        description: `${data.category}: ¥${parseFloat(data.amount).toLocaleString()}`,
      });

      // フォームをリセット
      form.reset({
        amount: "",
        category: undefined,
        date: new Date().toISOString().split("T")[0],
      });

      // 親コンポーネントに通知
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create expense:", error);
      toast.error("エラーが発生しました", {
        description:
          error instanceof Error ? error.message : "支出の記録に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Plus className="h-5 w-5 text-blue-500" />
          支出を記録
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 金額入力 */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">金額</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ¥
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1000"
                        className="h-12 pl-8 text-lg shadow-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* カテゴリ選択 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">カテゴリ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 shadow-sm">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 日付選択 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">日付</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-12 shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 送信ボタン */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full text-base font-semibold shadow-md hover:shadow-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  記録中...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  記録する
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
