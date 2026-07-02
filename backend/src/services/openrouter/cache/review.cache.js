'use strict';

const crypto = require('crypto');
const { CACHE } = require('../config/openrouter.config');

/**
 * In-memory FIFO review cache.
 * Keyed by SHA-256(language + code). Max size is configurable.
 */

const reviewCache = new Map();

const getCacheKey = (code, language) =>
    crypto.createHash('sha256').update(`${language}:${code}`).digest('hex');

const get = (code, language) => {
    const key = getCacheKey(code, language);
    return reviewCache.get(key) || null;
};

const set = (code, language, result) => {
    const key = getCacheKey(code, language);

    // Evict oldest entry if at capacity (FIFO)
    if (reviewCache.size >= CACHE.maxSize) {
        const firstKey = reviewCache.keys().next().value;
        reviewCache.delete(firstKey);
    }

    reviewCache.set(key, result);
};

const size = () => reviewCache.size;

const clear = () => reviewCache.clear();

module.exports = { get, set, size, clear };
