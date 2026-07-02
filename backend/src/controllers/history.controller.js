const historyService = require('../services/history.service');
const { sendSuccess } = require('../utils/response');

const getHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const result = await historyService.getUserHistory(req.user.id, { page, limit });
        sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const result = await historyService.deleteReview(req.params.id, req.user.id);
        sendSuccess(res, result, 'Review deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { getHistory, deleteReview };