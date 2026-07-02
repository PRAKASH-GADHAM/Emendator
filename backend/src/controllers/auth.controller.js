const axios = require('axios');
const authService = require('../services/auth.service');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, setCookieOptions } = require('../utils/jwt');
const { sendSuccess, createError } = require('../utils/response');
const logger = require('../config/logger');
const oauthConfig = require('../config/oauth');
const { generateOAuthState, validateOAuthState } = require('../middleware/oauth.middleware');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser({ name, email, password });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        sendSuccess(res, { user, accessToken }, 'Account created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser({ email, password });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        sendSuccess(res, { user, accessToken }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return next(createError('Refresh token required', 401));
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            return next(createError('Invalid or expired refresh token', 401));
        }

        const user = await authService.getUserById(decoded.userId);
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', newRefreshToken, setCookieOptions());
        sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    sendSuccess(res, {}, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        sendSuccess(res, { user });
    } catch (error) {
        next(error);
    }
};

// ─── Google OAuth ──────────────────────────────────────────────────────────────

const googleLogin = (req, res) => {
    const state = generateOAuthState();
    const url = oauthConfig.getGoogleAuthUrl(state);
    res.redirect(url);
};

const googleCallback = async (req, res, next) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            logger.warn(`Google OAuth error: ${error}`);
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_denied`);
        }

        if (!validateOAuthState(state)) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_state_invalid`);
        }

        if (!code) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_code`);
        }

        // Exchange code for tokens
        const tokenRes = await axios.post(oauthConfig.GOOGLE_TOKEN_URL, {
            code,
            client_id: oauthConfig.GOOGLE_CLIENT_ID,
            client_secret: oauthConfig.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenRes.data;

        // Fetch user info
        const userInfoRes = await axios.get(oauthConfig.GOOGLE_USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { sub: providerId, email, name, picture: avatar } = userInfoRes.data;

        if (!email) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_email`);
        }

        const user = await authService.findOrCreateOAuthUser({
            email,
            name: name || email.split('@')[0],
            avatar,
            provider: 'google',
            providerId,
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        // Redirect to frontend with token
        res.redirect(`${oauthConfig.FRONTEND_URL}/oauth/callback?token=${accessToken}`);
    } catch (error) {
        logger.error('Google OAuth callback error:', error);
        res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

// ─── GitHub OAuth ──────────────────────────────────────────────────────────────

const githubLogin = (req, res) => {
    const state = generateOAuthState();
    const url = oauthConfig.getGithubAuthUrl(state);
    res.redirect(url);
};

const githubCallback = async (req, res, next) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            logger.warn(`GitHub OAuth error: ${error}`);
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_denied`);
        }

        if (!validateOAuthState(state)) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_state_invalid`);
        }

        if (!code) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_code`);
        }

        // Exchange code for token
        const tokenRes = await axios.post(
            oauthConfig.GITHUB_TOKEN_URL,
            {
                client_id: oauthConfig.GITHUB_CLIENT_ID,
                client_secret: oauthConfig.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
            },
            { headers: { Accept: 'application/json' } }
        );

        const { access_token } = tokenRes.data;

        if (!access_token) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
        }

        // Fetch user info
        const [userInfoRes, emailsRes] = await Promise.all([
            axios.get(oauthConfig.GITHUB_USERINFO_URL, {
                headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'CodeReviewerApp' },
            }),
            axios.get(oauthConfig.GITHUB_EMAIL_URL, {
                headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'CodeReviewerApp' },
            }),
        ]);

        const { id: providerId, name, avatar_url: avatar, login } = userInfoRes.data;

        // Get primary verified email
        const primaryEmail = emailsRes.data.find((e) => e.primary && e.verified);
        const email = primaryEmail?.email || emailsRes.data[0]?.email;

        if (!email) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_email`);
        }

        const user = await authService.findOrCreateOAuthUser({
            email,
            name: name || login || email.split('@')[0],
            avatar,
            provider: 'github',
            providerId: String(providerId),
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        res.redirect(`${oauthConfig.FRONTEND_URL}/oauth/callback?token=${accessToken}`);
    } catch (error) {
        logger.error('GitHub OAuth callback error:', error);
        res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

module.exports = { register, login, refresh, logout, getMe, googleLogin, googleCallback, githubLogin, githubCallback };