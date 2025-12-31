import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    // Initialize: Check if token exists (basic check) or fetch me
    init: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                set({ user: res.data, isAuthenticated: true, isLoading: false });
            } catch (err) {
                console.error("Auth Init Error:", err);
                localStorage.removeItem('token');
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
