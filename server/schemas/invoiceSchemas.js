import { z } from 'zod';

const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    qty: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive"),
});

export const createInvoiceSchema = z.object({
    body: z.object({
        invoiceId: z.string().min(1, "Invoice ID is required"),
        clientName: z.string().min(1, "Client Name is required"),
        dueDate: z.string().min(1, "Due Date is required"),
        items: z.array(itemSchema).min(1, "At least one item is required"),
    }),
});

export const updateInvoiceStatusSchema = z.object({
    body: z.object({
        status: z.enum(['pending', 'paid', 'overdue']),
        walletId: z.string().optional(), // Required if paid
        type: z.enum(['income', 'expense']).optional(), // Required if paid
    }).refine((data) => {
        if (data.status === 'paid') {
            return !!data.walletId && !!data.type;
        }
        return true;
    }, {
        message: "Wallet and Type are required when marking as paid",
        path: ['walletId']
    }),
});
