import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Wallet Schema
export const walletSchema = z.object({
    name: z.string().min(1, 'Wallet name is required'),
    type: z.enum(['bank', 'cash', 'mobile']),
    initialBalance: z.coerce.number({ invalid_type_error: "Enter numbers only" }).min(0, 'Balance cannot be negative'),
});

// Transaction Schema
export const transactionSchema = z.object({
    walletId: z.string().min(1, 'Please select a wallet'),
    type: z.enum(['income', 'expense', 'transfer']),
    category: z.string().min(1, 'Category is required'),
    title: z.string().min(1, 'Title is required'),
    amount: z.coerce.number({ invalid_type_error: "Enter numbers only" }).positive('Amount must be positive'),
    note: z.string().optional(),
});

// Invoice Schema
export const invoiceSchema = z.object({
    invoiceId: z.string().min(1, 'Invoice ID is required'),
    clientName: z.string().min(1, 'Client name is required'),
    items: z.array(z.object({
        name: z.string().min(1),
        qty: z.number().positive(),
        price: z.number().min(0),
    })).min(1, 'At least one item is required'),
    dueDate: z.string().min(1, 'Due date is required'),
});
