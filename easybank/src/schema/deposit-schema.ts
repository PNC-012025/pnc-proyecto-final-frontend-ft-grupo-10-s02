import { z } from "zod";

export const DepositSchema = z.object({
  accountId: z.string().uuid({ message: "ID de cuenta inválido" }),
  amount: z.number().positive({ message: "El monto debe ser positivo" }),
  description: z.string().min(1, { message: "La descripción es obligatoria" }),
});

export type DepositInput = z.infer<typeof DepositSchema>;
