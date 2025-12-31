import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Send cookies
});

// Add Interceptor to attach token from local storage if I were using localStorage. 
// But earlier blueprint said "httpOnly cookie" (recommended).
// If using httpOnly cookie, I don't need to attach token manually.
// The browser handles it.
// However, my `authController` returns `token` in JSON:
// res.json({ ..., token: ... })
// If I use that, I should store it.
// Let's stick to the simpler MERN pattern: Store in localStorage and attach to header.
// It's easier for proto debugging.
// I'll add the interceptor to be safe.

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
