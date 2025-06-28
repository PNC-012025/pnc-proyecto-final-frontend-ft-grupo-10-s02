import { z } from "zod";

export const depositSchema = z.object({
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  description: z.string().min(1, "La descripción es obligatoria"),
});

export type DepositInput = z.infer<typeof depositSchema>;
