import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

// Fetch Wallets
export const useWallets = () => {
    return useQuery({
        queryKey: ['wallets'],
        queryFn: async () => {
            const res = await api.get('/wallets');
            return res.data;
        },
    });
};

// Wallet Mutations
export const useWalletMutations = () => {
    const queryClient = useQueryClient();

    const createWallet = useMutation({
        mutationFn: async (newWallet) => {
            const res = await api.post('/wallets', newWallet);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Wallet created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create wallet');
        }
    });

    const updateWallet = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await api.patch(`/wallets/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Wallet updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update wallet');
        }
    });

    const deleteWallet = useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/wallets/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Wallet deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete wallet');
        }
    });

    return { createWallet, updateWallet, deleteWallet };
};
