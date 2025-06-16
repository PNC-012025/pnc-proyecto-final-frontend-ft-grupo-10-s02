import { z } from 'zod';

export const CardDetailsSchema = z.object({
    balance: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    accountNumber: z.string(),
});

export type CardDetails = z.infer<typeof CardDetailsSchema>;
