import api from './axios';

export const reviewApi = {
    createReview: async ({ code, language }) => {
        const response = await api.post('/review', { code, language });
        return response.data;
    },

    getReview: async (id) => {
        const response = await api.get(`/review/${id}`);
        return response.data;
    },

    getFullReview: async (id) => {
        const response = await api.get(`/review/${id}/full`);
        return response.data;
    },
};