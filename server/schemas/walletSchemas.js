import { z } from 'zod';

export const createWalletSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Wallet name is required"),
        type: z.enum(['cash', 'bank', 'mobile'], {
            errorMap: () => ({ message: "Type must be 'cash', 'bank', or 'mobile'" })
        }),
        initialBalance: z.number().or(z.string().regex(/^\d+$/).transform(Number)).optional(),
    }),
});
