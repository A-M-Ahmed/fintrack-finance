import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: async () => {
            const res = await api.get('/invoices');
            return res.data;
        }
    });
};

export const useInvoiceMutations = () => {
    const queryClient = useQueryClient();

    const createInvoice = useMutation({
        mutationFn: async (invoiceData) => {
            const res = await api.post('/invoices', invoiceData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            toast.success('Invoice created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create invoice');
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status, walletId, type }) => {
            const res = await api.put(`/invoices/${id}/status`, { status, walletId, type });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['wallets'] }); // Payment affects wallet
            queryClient.invalidateQueries({ queryKey: ['transactions'] }); // Payment creates transaction
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Invoice status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update invoice status');
        }
    });

    return { createInvoice, updateStatus };
};
