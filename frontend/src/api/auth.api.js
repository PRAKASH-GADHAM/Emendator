import api from './axios';

export const authApi = {
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    refresh: async () => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getGoogleAuthUrl = () => `${API_URL}/api/auth/google`;
export const getGithubAuthUrl = () => `${API_URL}/api/auth/github`;