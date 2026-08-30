'use strict';

const problemService = require('./problem.service');
const executionService = require('./execution.service');
const reviewService = require('./review.service');
const { sendSuccess } = require('../../utils/response');

const getProblems = async (req, res, next) => {
    try {
        const { page = 1, limit = 50, search, difficulty, topic } = req.query;
        const parsedPage = parseInt(page, 10);
        const result = await problemService.getProblems({
            page: Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1,
            limit: Math.min(parseInt(limit, 10), 100),
            search,
            difficulty,
            topic,
        });
        sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

const getProblem = async (req, res, next) => {
    try {
        const problem = await problemService.getProblemById(req.params.problemId);
        sendSuccess(res, { problem });
    } catch (error) {
        next(error);
    }
};

const runCode = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const { language, code } = req.body;
        const result = await executionService.executeCode(problemId, language, code);
        sendSuccess(res, { result });
    } catch (error) {
        next(error);
    }
};

const reviewCode = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const { language, code } = req.body;
        const userId = req.user.id;
        const review = await reviewService.reviewLeetCodeProblem({
            userId,
            problemId,
            language,
            code,
        });
        sendSuccess(res, { review }, 'AI review completed', 201);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProblems, getProblem, runCode, reviewCode };
