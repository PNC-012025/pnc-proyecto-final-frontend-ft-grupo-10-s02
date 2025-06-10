import { z } from 'zod';

export const CardDetailsSchema = z.object({
    balance: z.number(),
    expiryDate: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    accountNumber: z.string(),
});

export type CardDetails = z.infer<typeof CardDetailsSchema>;
