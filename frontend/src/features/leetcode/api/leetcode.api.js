import api from '../../../api/axios';

export const leetcodeApi = {
    getProblems: async ({ page = 1, limit = 20, search = '', difficulty = '', topic = '' } = {}) => {
        const params = { page, limit };
        if (search) params.search = search;
        if (difficulty) params.difficulty = difficulty;
        if (topic) params.topic = topic;
        const response = await api.get('/leetcode/problems', { params });
        return response.data;
    },

    getProblem: async (problemId) => {
        const response = await api.get(`/leetcode/problems/${problemId}`);
        return response.data;
    },

    runCode: async (problemId, { language, code }) => {
        const response = await api.post(`/leetcode/problems/${problemId}/run`, { language, code });
        return response.data;
    },

    reviewCode: async (problemId, { language, code }) => {
        const response = await api.post(`/leetcode/problems/${problemId}/review`, { language, code });
        return response.data;
    },
};
