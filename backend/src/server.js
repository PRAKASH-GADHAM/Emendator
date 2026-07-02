const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const app = require('./app');
const logger = require('./config/logger');
const prisma = require('./config/database');
// Validate OpenRouter API keys at startup
require('./config/openrouter');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await prisma.$connect();
        logger.info('✓ Database Connected');
        logger.info('✓ Prisma Client Generated');

        // Verify tables exist
        const result = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public' AND table_name IN ('User', 'Review');
        `;
        
        const tableNames = result.map(t => t.table_name);
        if (!tableNames.includes('User') || !tableNames.includes('Review')) {
            throw new Error('Database schema missing required tables (User or Review). Please check Prisma migrations.');
        }

        logger.info('✓ Schema Applied');

        const server = app.listen(PORT, () => {
            logger.info('✓ Backend Ready');
            logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                await prisma.$disconnect();
                logger.info('💀 Server and database connections closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}


startServer();