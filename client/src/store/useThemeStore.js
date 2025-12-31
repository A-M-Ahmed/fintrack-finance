import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'dark', // Default to dark per design images
            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark';
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(newTheme);
                set({ theme: newTheme });
            },
            initTheme: () => {
                const currentTheme = get().theme;
                document.documentElement.classList.add(currentTheme);
            }
        }),
        {
            name: 'fintrack-theme',
        }
    )
);

export default useThemeStore;
