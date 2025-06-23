import { z } from "zod";

export const TransactionSearchSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuario inválido" }),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  description: z.string(),
  accountNumber: z.string(),
  date: z.string(),
  type: z.string(),
  name: z.string(),
});

export type TransactionSearchInput = z.infer<typeof TransactionSearchSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
