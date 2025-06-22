import { z } from "zod";

export const TransactionSearchSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuario inválido" }),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
  date: z.string().datetime(),
  senderAccount: z.string(),
  receiverAccount: z.string(),
  status: z.enum(["COMPLETED", "PENDING", "FAILED"]),
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
});

export type TransactionSearchInput = z.infer<typeof TransactionSearchSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
