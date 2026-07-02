const express = require('express');
const { body, param } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'html', 'css', 'sql', 'bash', 'other',
];

const reviewValidation = [
    body('code')
        .notEmpty().withMessage('Code is required')
        .isLength({ min: 10 }).withMessage('Code must be at least 10 characters')
        .isLength({ max: 50000 }).withMessage('Code exceeds 50,000 character limit'),
    body('language')
        .notEmpty().withMessage('Language is required')
        .isIn(SUPPORTED_LANGUAGES).withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
];

const idValidation = [param('id').notEmpty().withMessage('Review ID required'), validate];

router.use(authenticate);

router.post('/', aiRateLimiter, reviewValidation, validate, reviewController.createReview);
router.get('/:id', idValidation, reviewController.getReview);
router.get('/:id/full', idValidation, reviewController.getFullReview);

module.exports = router;