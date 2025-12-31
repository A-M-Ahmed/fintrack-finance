import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useDashboard = (range = '30d') => {
    return useQuery({
        queryKey: ['dashboard', range],
        queryFn: async () => {
            const res = await api.get(`/dashboard/summary?range=${range}`);
            return res.data;
        }
    });
};
