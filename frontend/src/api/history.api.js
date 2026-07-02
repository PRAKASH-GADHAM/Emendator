import api from './axios';

export const historyApi = {
    getHistory: async ({ page = 1, limit = 10 } = {}) => {
        const response = await api.get('/history', { params: { page, limit } });
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/history/${id}`);
        return response.data;
    },
};