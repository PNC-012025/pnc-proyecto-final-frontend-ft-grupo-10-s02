import { z } from "zod";

export const expenseSchema = z.object({
  id: z.string(),
  expenseName: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.string(),
  state: z.string().optional(),
});

export type ExpenseType = z.infer<typeof expenseSchema>;
