const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const SALT_ROUNDS = 12;

const registerUser = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw createError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    logger.info(`New user registered: ${email}`);
    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw createError('Invalid email or password', 401);
    }

    if (!user.password) {
        throw createError(`This account uses ${user.provider || 'social'} login. Please sign in with that provider.`, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError('Invalid email or password', 401);
    }

    logger.info(`User logged in: ${email}`);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.createdAt,
    };
};

const findOrCreateOAuthUser = async ({ email, name, avatar, provider, providerId }) => {
    // Check by provider + providerId first (most reliable)
    let user = await prisma.user.findUnique({
        where: { provider_providerId: { provider, providerId } },
    });

    if (user) {
        // Update avatar in case it changed
        user = await prisma.user.update({
            where: { id: user.id },
            data: { avatar, name },
            select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
        });
        logger.info(`OAuth user logged in: ${email} via ${provider}`);
        return user;
    }

    // Check if email already exists (account merging prevention)
    const existingByEmail = await prisma.user.findUnique({ where: { email } });

    if (existingByEmail) {
        if (existingByEmail.provider && existingByEmail.provider !== provider) {
            throw createError(
                `This email is already registered with ${existingByEmail.provider}. Please sign in using that provider.`,
                409
            );
        }
        // Update existing email-based account to link OAuth
        user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: { provider, providerId, avatar, name },
            select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
        });
        logger.info(`Linked OAuth provider ${provider} to existing user: ${email}`);
        return user;
    }

    // Create new user
    user = await prisma.user.create({
        data: { email, name, avatar, provider, providerId },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    logger.info(`New OAuth user created: ${email} via ${provider}`);
    return user;
};

const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    if (!user) {
        throw createError('User not found', 404);
    }

    return user;
};

module.exports = { registerUser, loginUser, findOrCreateOAuthUser, getUserById };