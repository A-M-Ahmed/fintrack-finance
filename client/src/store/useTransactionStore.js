import { create } from 'zustand';
import api from '../lib/axios';

const useTransactionStore = create((set, get) => ({
    transactions: [],
    isLoading: false,
    filters: {
        type: 'all',
        search: '',
        walletId: null
    },

    fetchTransactions: async (params = {}) => {
        set({ isLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.walletId) queryParams.append('walletId', params.walletId);
            if (params.type && params.type !== 'all') queryParams.append('type', params.type);
            if (params.search) queryParams.append('search', params.search);

            const res = await api.get(`/transactions?${queryParams.toString()}`);
            set({ transactions: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
    },

    addTransaction: (transaction) => {
        set({ transactions: [transaction, ...get().transactions] });
    },

    removeTransaction: (id) => {
        set({ transactions: get().transactions.filter(t => t._id !== id) });
    }
}));

export default useTransactionStore;
