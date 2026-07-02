const crypto = require('crypto');

const oauthStates = new Map();

const generateOAuthState = () => {
    const state = crypto.randomBytes(32).toString('hex');
    oauthStates.set(state, { createdAt: Date.now() });
    // Clean up old states (older than 10 minutes)
    for (const [key, val] of oauthStates.entries()) {
        if (Date.now() - val.createdAt > 10 * 60 * 1000) {
            oauthStates.delete(key);
        }
    }
    return state;
};

const validateOAuthState = (state) => {
    if (!state || !oauthStates.has(state)) {
        return false;
    }
    const entry = oauthStates.get(state);
    oauthStates.delete(state);
    // Reject states older than 10 minutes
    if (Date.now() - entry.createdAt > 10 * 60 * 1000) {
        return false;
    }
    return true;
};

module.exports = { generateOAuthState, validateOAuthState };