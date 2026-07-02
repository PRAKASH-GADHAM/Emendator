import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isOAuthLoading: false,

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
        }
        try {
            const data = await authApi.getMe();
            set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch {
            try {
                const refreshData = await authApi.refresh();
                localStorage.setItem('accessToken', refreshData.data.accessToken);
                const meData = await authApi.getMe();
                set({ user: meData.data.user, isAuthenticated: true, isLoading: false });
            } catch {
                localStorage.removeItem('accessToken');
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        }
    },

    login: async (credentials) => {
        const data = await authApi.login(credentials);
        const { user, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, isAuthenticated: true });
        toast.success(`Welcome back, ${user.name}! 🚀`);
        return data;
    },

    register: async (userData) => {
        const data = await authApi.register(userData);
        const { user, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, isAuthenticated: true });
        toast.success(`Account created! Welcome, ${user.name}! 🎉`);
        return data;
    },

    // Called from OAuthCallbackPage after redirect with token in URL
    loginWithToken: async (accessToken) => {
        set({ isOAuthLoading: true });
        localStorage.setItem('accessToken', accessToken);
        try {
            const meData = await authApi.getMe();
            const user = meData.data.user;
            set({ user, isAuthenticated: true, isOAuthLoading: false });
            toast.success(`Welcome, ${user.name}! 🚀`);
            return user;
        } catch (err) {
            localStorage.removeItem('accessToken');
            set({ isOAuthLoading: false });
            toast.error('OAuth login failed. Please try again.');
            throw err;
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore errors on logout
        }
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
    },
}));