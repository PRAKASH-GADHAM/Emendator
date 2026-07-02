const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createError('Access token required', 401));
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(createError('Access token required', 401));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return next(createError('Token expired', 401, 'TOKEN_EXPIRED'));
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return next(createError('Invalid token', 401));
            }
            return next(createError('Token verification failed', 401));
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            return next(createError('User not found', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        next(createError('Authentication failed', 500));
    }
};

module.exports = { authenticate };