import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/types/database";

/**
 * 支出記録フォームのバリデーションスキーマ
 */
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, "金額を入力してください")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "0より大きい金額を入力してください" }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num <= 9999999.99;
      },
      { message: "金額が大きすぎます（最大9,999,999.99）" }
    ),
  category: z.enum(EXPENSE_CATEGORIES, {
    message: "カテゴリを選択してください",
  }),
  date: z.string().min(1, "日付を入力してください"),
});

/**
 * フォームデータの型
 */
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

/**
 * API送信用のデータ型
 */
export interface ExpenseCreateRequest {
  amount: number;
  category: string;
  date?: string;
}
