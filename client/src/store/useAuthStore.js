import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    // PIN Logic
    hasPin: false,
    isLocked: false,

    // Initialize: Check if token exists
    init: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                // If user has a PIN, lock the app initially
                const shouldLock = res.data.hasPin;
                set({
                    user: res.data,
                    isAuthenticated: true,
                    isLoading: false,
                    hasPin: res.data.hasPin,
                    isLocked: shouldLock
                });
            } catch (err) {
                console.error("Auth Init Error:", err);
                localStorage.removeItem('token');
                set({ user: null, isAuthenticated: false, isLoading: false, hasPin: false, isLocked: false });
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

            // If user has a PIN, lock the app immediately upon login for security?
            // OR: Let them in because they just used a password.
            // Better UX: Let them in. Only lock on refresh/re-open.
            set({
                user: res.data,
                isAuthenticated: true,
                isLoading: false,
                hasPin: res.data.hasPin,
                isLocked: false
            });
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
            set({
                user: res.data,
                isAuthenticated: true,
                isLoading: false,
                hasPin: false,
                isLocked: false
            });
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            set({ error: msg, isLoading: false });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, hasPin: false, isLocked: false });
    },

    updateUser: (userData) => {
        set((state) => ({
            user: { ...state.user, ...userData },
            hasPin: userData.hasPin !== undefined ? userData.hasPin : state.hasPin
        }));
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
    },

    // Unlock App
    unlock: () => {
        set({ isLocked: false });
    },

    // Lock App (Manual)
    lock: () => {
        set({ isLocked: true });
    },

    setPinSuccess: () => {
        set({ hasPin: true });
    }
}));

export default useAuthStore;
