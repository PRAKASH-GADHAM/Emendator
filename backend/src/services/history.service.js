const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const getUserHistory = async (userId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: { userId },
            select: {
                id: true,
                language: true,
                score: true,
                issues: true,
                suggestions: true,
                createdAt: true,
                code: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.review.count({ where: { userId } }),
    ]);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + reviews.length < total,
        },
    };
};

const deleteReview = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
    });

    if (!review) {
        throw createError('Review not found', 404);
    }

    await prisma.review.delete({ where: { id: reviewId } });
    logger.info(`Review deleted: ${reviewId} by user: ${userId}`);

    return { id: reviewId };
};

module.exports = { getUserHistory, deleteReview };