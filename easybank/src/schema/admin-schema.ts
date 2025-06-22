import { z } from "zod";

export const UserStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.boolean(),
});

export const TransactionFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

export type UserStatusInput = z.infer<typeof UserStatusSchema>;
export type TransactionFiltersInput = z.infer<typeof TransactionFiltersSchema>;
