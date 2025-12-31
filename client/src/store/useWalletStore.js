import { create } from 'zustand';
import api from '../lib/axios';

const useWalletStore = create((set, get) => ({
    wallets: [],
    selectedWallet: null,
    isLoading: false,

    fetchWallets: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/wallets');
            set({ wallets: res.data, isLoading: false });
            return res.data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    selectWallet: (walletId) => {
        const wallet = get().wallets.find(w => w._id === walletId);
        set({ selectedWallet: wallet });
    },

    addWallet: (wallet) => {
        set({ wallets: [...get().wallets, wallet] });
    },

    updateWalletBalance: (walletId, newBalance) => {
        set({
            wallets: get().wallets.map(w =>
                w._id === walletId ? { ...w, currentBalance: newBalance } : w
            )
        });
    }
}));

export default useWalletStore;
