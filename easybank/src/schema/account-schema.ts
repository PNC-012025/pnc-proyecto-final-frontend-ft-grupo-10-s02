import { z } from "zod";

export const accountResponseAdminSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  accountNumber: z.string(),
  balance: z.number(),
});

export type AccountResponseAdmin = z.infer<typeof accountResponseAdminSchema>;
