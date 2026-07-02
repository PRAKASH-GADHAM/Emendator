'use strict';

/**
 * OpenRouter configuration validator.
 * Replaces the old config/openai.js (which was Ollama-specific).
 *
 * This module validates that at least one API key is configured at startup.
 * Exports a helper to retrieve API keys by model identifier.
 */

const logger = require('./logger');
const { MODELS } = require('../services/openrouter/config/openrouter.config');

const keyStatus = {};

for (const [id, cfg] of Object.entries(MODELS)) {
    const key = process.env[cfg.envKey];
    keyStatus[id] = !!key;

    if (key) {
        logger.info(`✅ [OpenRouter] ${cfg.name} API key configured (${cfg.envKey})`);
    } else {
        logger.warn(`⚠️  [OpenRouter] ${cfg.name} API key MISSING (${cfg.envKey}) — this model will be skipped`);
    }
}

const configuredCount = Object.values(keyStatus).filter(Boolean).length;

if (configuredCount === 0) {
    logger.error(
        '❌ [OpenRouter] NO API KEYS are configured! ' +
        'Set at least one of: OPENROUTER_API_KEY_GEMMA, OPENROUTER_API_KEY_NEMOTRON, OPENROUTER_API_KEY_GPTOSS'
    );
} else {
    logger.info(`🚀 [OpenRouter] ${configuredCount}/${Object.keys(MODELS).length} models ready for parallel execution`);
}

/**
 * Returns the API key for a given model identifier.
 * @param {'gemma'|'nemotron'|'gptoss'} modelId
 * @returns {string | undefined}
 */
const getApiKey = (modelId) => {
    const cfg = MODELS[modelId];
    if (!cfg) return undefined;
    return process.env[cfg.envKey];
};

module.exports = { getApiKey, keyStatus };
