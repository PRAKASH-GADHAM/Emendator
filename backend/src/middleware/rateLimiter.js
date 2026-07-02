const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const globalRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000 / 60) + ' minutes',
    },
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    },
});

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
    handler: (req, res, next, options) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    },
});

const aiRateLimiter = rateLimit({
    windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
    max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
    message: {
        success: false,
        message: 'AI review limit reached. You can submit 10 reviews per hour.',
    },
    handler: (req, res, next, options) => {
        logger.warn(`AI rate limit exceeded for user: ${req.user?.id || req.ip}`);
        res.status(429).json(options.message);
    },
});

module.exports = { globalRateLimiter, authRateLimiter, aiRateLimiter };