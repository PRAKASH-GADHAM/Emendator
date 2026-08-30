'use strict';

const express = require('express');
const { body, param, query } = require('express-validator');
const leetcodeController = require('./leetcode.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { aiRateLimiter } = require('../../middleware/rateLimiter');
const { validate } = require('../../middleware/validate.middleware');

const router = express.Router();

const SUPPORTED_LANGUAGES = ['java', 'javascript', 'python', 'cpp'];

// Public routes
router.get('/problems', leetcodeController.getProblems);
router.get('/problems/:problemId', leetcodeController.getProblem);

// Protected routes
router.use(authenticate);

router.post(
    '/problems/:problemId/run',
    [
        param('problemId').notEmpty().withMessage('Problem ID required'),
        body('language').notEmpty().withMessage('Language is required').isIn(SUPPORTED_LANGUAGES).withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
        body('code').notEmpty().withMessage('Code is required').isString().withMessage('Code must be a string').isLength({ max: 50000 }).withMessage('Code exceeds 50,000 character limit'),
        validate,
    ],
    leetcodeController.runCode
);

router.post(
    '/problems/:problemId/review',
    aiRateLimiter,
    [
        param('problemId').notEmpty().withMessage('Problem ID required'),
        body('language').notEmpty().withMessage('Language is required').isIn(SUPPORTED_LANGUAGES).withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
        body('code').notEmpty().withMessage('Code is required').isString().withMessage('Code must be a string').isLength({ max: 50000 }).withMessage('Code exceeds 50,000 character limit'),
        validate,
    ],
    leetcodeController.reviewCode
);

module.exports = router;
