const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Prisma errors
    if (err.code === 'P2002') {
        statusCode = 409;
        message = 'A record with this information already exists';
    } else if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Record not found';
    } else if (err.code === 'P2003') {
        statusCode = 400;
        message = 'Invalid reference';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    logger.error(`[${statusCode}] ${message}`, {
        path: req.path,
        method: req.method,
        ip: req.ip,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        message,
        code: err.code || undefined,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;