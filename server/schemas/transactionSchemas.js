import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        walletId: z.string().min(1, "Wallet ID is required"),
        type: z.enum(['income', 'expense', 'transfer']),
        category: z.string().min(1, "Category is required"),
        title: z.string().min(1, "Title is required"),
        amount: z.number().min(0, "Amount must be positive"),
        note: z.string().optional(),
        date: z.string().optional(), // ISO Date string
    }),
});
