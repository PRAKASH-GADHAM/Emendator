'use strict';

/**
 * OpenRouter Multi-Model Pipeline Configuration
 * All constants that can be tweaked per-environment live here.
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

const MODELS = {
    gemma: {
        name: 'Gemma 4 31B',
        modelId: 'google/gemma-4-31b-it:free',
        envKey: 'OPENROUTER_API_KEY_GEMMA',
    },
    nemotron: {
        name: 'Nemotron 550B',
        modelId: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        envKey: 'OPENROUTER_API_KEY_NEMOTRON',
    },
    gptoss: {
        name: 'GPT-OSS 120B',
        modelId: 'openai/gpt-oss-120b:free',
        envKey: 'OPENROUTER_API_KEY_GPTOSS',
    },
};

// Per-model request timeout in milliseconds (default 60 s)
const MODEL_TIMEOUT_MS = parseInt(process.env.OPENROUTER_MODEL_TIMEOUT_MS || '60000', 10);

// Retry policy for 429 / 5xx responses
const RETRY_POLICY = {
    maxAttempts: 3,
    baseDelayMs: 1000,   // 1 s base
    maxDelayMs: 15000,   // 15 s ceiling
    jitterFactor: 0.3,   // ±30 % jitter
};

// In-memory result cache
const CACHE = {
    maxSize: 100,
};

// Maximum code length accepted (in characters)
const MAX_CODE_LENGTH = 50000;

// Generation parameters sent to every model
const GENERATION_PARAMS = {
    temperature: 0.15,
    max_tokens: 3000,
};

// Application headers required by OpenRouter
const SITE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const SITE_NAME = 'AI Code Reviewer';

module.exports = {
    OPENROUTER_BASE_URL,
    MODELS,
    MODEL_TIMEOUT_MS,
    RETRY_POLICY,
    CACHE,
    MAX_CODE_LENGTH,
    GENERATION_PARAMS,
    SITE_URL,
    SITE_NAME,
};
