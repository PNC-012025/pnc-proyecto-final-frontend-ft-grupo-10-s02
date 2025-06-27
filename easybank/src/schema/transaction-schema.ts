import { z } from "zod";

export const AccountSchema = z.object({
  accountOwner: z.string(),
  accountNumber: z.string(),
});

export const TransactionSearchSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuario inválido" }),
});

export const TransactionSchema = z.object({
  transactionId: z.string().uuid(),
  amount: z.number(),
  date: z.string(),
  originAccount: AccountSchema,
  destinationAccount: AccountSchema,
});

export type TransactionSearchInput = z.infer<typeof TransactionSearchSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
