'use strict';

const prisma = require('../config/database');
const { analyzeCodeWithOpenRouter } = require('./openrouter/review/openrouter.review.service');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

/**
 * Creates a new code review using the OpenRouter multi-model pipeline.
 * Stores the full consensus result in `metadata` and populates legacy fields
 * for backward compatibility with existing history queries.
 */
const createReview = async ({ userId, code, language, abortSignal }) => {
    const aiResult = await analyzeCodeWithOpenRouter(code, language, abortSignal);

    // Build metadata object (all extended fields)
    const metadata = {
        executiveSummary: aiResult.executiveSummary,
        bugs: aiResult.bugs,
        performance: aiResult.performance,
        security: aiResult.security,
        codeSmells: aiResult.codeSmells,
        refactoring: aiResult.refactoring,
        complexity: aiResult.complexity,
        modelsUsed: aiResult.modelsUsed,
        modelCount: aiResult.modelCount,
        overallConfidence: aiResult.overallConfidence,
        issueConfidence: aiResult.issueConfidence,
        reviewQualityScore: aiResult.reviewQualityScore,
    };

    const review = await prisma.review.create({
        data: {
            userId,
            code,
            language,
            score: aiResult.score,
            // Legacy columns (still used by history list & old review display)
            issues: aiResult.issues,
            suggestions: aiResult.suggestions,
            lineFixes: aiResult.lineFixes || [],
            // New columns (extended review data)
            improvedCode: aiResult.improvedCode || null,
            metadata,
        },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            improvedCode: true,
            metadata: true,
            createdAt: true,
        },
    });

    logger.info(`[Review] Created review ${review.id} for user ${userId} (score: ${aiResult.score}, models: ${aiResult.modelCount})`);
    return review;
};

const getReviewById = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            improvedCode: true,
            metadata: true,
            createdAt: true,
        },
    });

    if (!review) throw createError('Review not found', 404);
    return review;
};

const getReviewFullById = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            improvedCode: true,
            metadata: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!review) throw createError('Review not found', 404);
    return review;
};

module.exports = { createReview, getReviewById, getReviewFullById };