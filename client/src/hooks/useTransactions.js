import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

// Fetch Transactions
export const useTransactions = ({ walletId, type, search, sort } = {}) => {
    return useQuery({
        queryKey: ['transactions', { walletId, type, search, sort }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (walletId && walletId !== 'all') params.append('walletId', walletId);
            if (type && type !== 'all') params.append('type', type);
            if (search) params.append('search', search);
            if (sort) params.append('sort', sort);

            const res = await api.get(`/transactions?${params.toString()}`);
            return res.data;
        },
    });
};

// Transaction Mutations
export const useTransactionMutations = () => {
    const queryClient = useQueryClient();

    const addTransaction = useMutation({
        mutationFn: async (newTransaction) => {
            const res = await api.post('/transactions', newTransaction);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['wallets'] }); // Balances change
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Transaction added successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add transaction');
        }
    });

    const deleteTransaction = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/transactions/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Transaction deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete transaction');
        }
    });

    return { addTransaction, deleteTransaction };
};
