'use strict';

const prisma = require('../../config/database');
const { createError } = require('../../utils/response');

const getProblems = async ({ page = 1, limit = 50, search, difficulty, topic }) => {
    const where = {};

    if (difficulty) {
        const normalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
        if (['Easy', 'Medium', 'Hard'].includes(normalizedDifficulty)) {
            where.difficulty = normalizedDifficulty;
        }
    }

    if (topic) {
        where.topics = { array_contains: topic };
    }

    if (search) {
        const searchNum = parseInt(search, 10);
        if (!isNaN(searchNum)) {
            where.OR = [
                { number: searchNum },
                { title: { contains: search, mode: 'insensitive' } },
            ];
        } else {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search.toLowerCase().replace(/\s+/g, '-'), mode: 'insensitive' } },
            ];
        }
    }

    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
        prisma.leetCodeProblem.findMany({
            where,
            select: {
                id: true,
                number: true,
                slug: true,
                title: true,
                difficulty: true,
                topics: true,
            },
            orderBy: { number: 'asc' },
            skip,
            take: limit,
        }),
        prisma.leetCodeProblem.count({ where }),
    ]);

    return {
        problems,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total,
        },
    };
};

const getProblemById = async (problemId) => {
    const problem = await prisma.leetCodeProblem.findFirst({
        where: {
            OR: [
                { id: problemId },
                { slug: problemId },
            ],
        },
        include: {
            testCases: {
                where: { isSample: true },
                select: {
                    id: true,
                    input: true,
                    expectedOutput: true,
                    explanation: true,
                    isSample: true,
                },
            },
        },
    });

    if (!problem) {
        throw createError('Problem not found', 404);
    }

    return problem;
};

const getTestCasesForExecution = async (problemId) => {
    return prisma.leetCodeTestCase.findMany({
        where: { problemId },
        orderBy: { id: 'asc' },
    });
};

module.exports = { getProblems, getProblemById, getTestCasesForExecution };
