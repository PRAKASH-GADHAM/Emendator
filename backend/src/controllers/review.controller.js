'use strict';

const reviewService = require('../services/review.service');
const { sendSuccess } = require('../utils/response');

// Track active analysis controllers per user to support cancellation
const activeControllers = new Map();

const createReview = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        const userId = req.user.id;

        // Cancel any in-progress review for this user
        if (activeControllers.has(userId)) {
            activeControllers.get(userId).abort();
            activeControllers.delete(userId);
        }

        // Create a new abort controller for this request
        const controller = new AbortController();
        activeControllers.set(userId, controller);

        // Clean up controller when connection drops (client navigates away)
        req.on('close', () => {
            if (activeControllers.get(userId) === controller) {
                controller.abort();
                activeControllers.delete(userId);
            }
        });

        const review = await reviewService.createReview({
            userId,
            code,
            language,
            abortSignal: controller.signal,
        });

        // Cleanup on success
        activeControllers.delete(userId);

        sendSuccess(res, { review }, 'Code review completed', 201);
    } catch (error) {
        next(error);
    }
};

const getReview = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id, req.user.id);
        sendSuccess(res, { review });
    } catch (error) {
        next(error);
    }
};

const getFullReview = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewFullById(req.params.id, req.user.id);
        sendSuccess(res, { review });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getReview, getFullReview };