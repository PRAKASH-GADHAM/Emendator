'use strict';

const { performance } = require('perf_hooks');
const logger = require('../../../config/logger');
const { createError } = require('../../../utils/response');

const gemmaClient = require('../models/gemma.client');
const nemotronClient = require('../models/nemotron.client');
const gptossClient = require('../models/gptoss.client');
const { buildSystemPrompt, buildUserPrompt } = require('../prompts/review.prompt');
const { buildConsensus } = require('../consensus/consensus.engine');
const { scoreConfidence } = require('../scoring/confidence.scorer');
const reviewCache = require('../cache/review.cache');
const { MAX_CODE_LENGTH } = require('../config/openrouter.config');

// ── Input validation ──────────────────────────────────────────────────────────

const validateInput = (code, language) => {
    if (!code || typeof code !== 'string') {
        throw createError('Code is required', 400);
    }
    if (code.trim().length < 10) {
        throw createError('Code must be at least 10 characters', 400);
    }
    if (code.length > MAX_CODE_LENGTH) {
        throw createError(`Code exceeds the ${MAX_CODE_LENGTH.toLocaleString()} character limit`, 400);
    }
    if (!language || typeof language !== 'string') {
        throw createError('Language is required', 400);
    }
};

// ── Parallel model execution ──────────────────────────────────────────────────

/**
 * Runs all three models simultaneously using Promise.allSettled.
 * Response time ≈ slowest model (not sum of all three).
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {AbortSignal} [abortSignal]
 * @returns {Promise<{ results: Object[], failures: string[] }>}
 */
const executeModelsInParallel = async (systemPrompt, userPrompt, abortSignal) => {
    const models = [
        { client: gemmaClient, key: 'OPENROUTER_API_KEY_GEMMA' },
        { client: nemotronClient, key: 'OPENROUTER_API_KEY_NEMOTRON' },
        { client: gptossClient, key: 'OPENROUTER_API_KEY_GPTOSS' },
    ];

    // Filter out models with no API key to avoid unnecessary calls
    const activeModels = models.filter(({ key }) => !!process.env[key]);

    if (activeModels.length === 0) {
        throw createError(
            'No OpenRouter API keys are configured. Set OPENROUTER_API_KEY_GEMMA, OPENROUTER_API_KEY_NEMOTRON, or OPENROUTER_API_KEY_GPTOSS.',
            503
        );
    }

    logger.info(`[OpenRouter] Dispatching to ${activeModels.length} model(s) in parallel: ${activeModels.map(m => m.client.name).join(', ')}`);

    const parallelStart = performance.now();

    const settled = await Promise.allSettled(
        activeModels.map(({ client }) => client.query(systemPrompt, userPrompt, abortSignal))
    );

    const parallelDuration = performance.now() - parallelStart;
    logger.info(`[OpenRouter] All model calls settled in ${parallelDuration.toFixed(0)}ms`);

    const results = [];
    const failures = [];

    settled.forEach((outcome, idx) => {
        const modelName = activeModels[idx].client.name;
        if (outcome.status === 'fulfilled') {
            results.push(outcome.value);
            logger.info(`[OpenRouter] ✅ ${modelName} succeeded`);
        } else {
            failures.push(`${modelName}: ${outcome.reason?.message || 'Unknown error'}`);
            logger.warn(`[OpenRouter] ❌ ${modelName} failed: ${outcome.reason?.message}`);
        }
    });

    return { results, failures };
};

// ── Main exported function ────────────────────────────────────────────────────

/**
 * Analyses code using the OpenRouter multi-model parallel pipeline.
 *
 * Flow:
 *   1. Validate input
 *   2. Check cache
 *   3. Build shared prompt
 *   4. Execute all models in parallel (Promise.allSettled)
 *   5. Consensus engine merges results
 *   6. Confidence scorer annotates the consensus
 *   7. Assemble final ConsensusReview
 *   8. Save to cache & return
 *
 * @param {string} code
 * @param {string} language
 * @param {AbortSignal} [abortSignal]
 * @returns {Promise<Object>} ConsensusReview
 */
const analyzeCodeWithOpenRouter = async (code, language, abortSignal) => {
    const totalStart = performance.now();

    // 1. Validate
    validateInput(code, language);

    // 2. Cache check
    const cached = reviewCache.get(code, language);
    if (cached) {
        logger.info(`[OpenRouter] Cache HIT — returning stored consensus review (cache size: ${reviewCache.size()})`);
        return cached;
    }

    // 3. Build prompts (shared across all models)
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(code, language);

    // 4. Parallel execution
    const { results, failures } = await executeModelsInParallel(systemPrompt, userPrompt, abortSignal);

    if (results.length === 0) {
        logger.error('[OpenRouter] All models failed:', failures);
        throw createError(
            `All AI models failed to respond. Details: ${failures.join(' | ')}`,
            503
        );
    }

    if (failures.length > 0) {
        logger.warn(`[OpenRouter] ${failures.length} model(s) failed, continuing with ${results.length} result(s): ${failures.join('; ')}`);
    }

    // 5. Consensus
    const consensusStart = performance.now();
    const consensusReview = buildConsensus(results);
    logger.info(`[OpenRouter] Consensus built in ${(performance.now() - consensusStart).toFixed(0)}ms`);

    // 6. Confidence scoring
    const scoringStart = performance.now();
    const confidenceData = scoreConfidence(results, consensusReview);
    logger.info(`[OpenRouter] Confidence scored in ${(performance.now() - scoringStart).toFixed(0)}ms`);

    // 7. Assemble final review
    const finalReview = {
        // ── Top-level fields (backward-compat with existing review.service) ──
        score: consensusReview.score,
        // Legacy fields: populate from consensus for history compatibility
        issues: (consensusReview.bugs || []).map((b) => b.text),
        suggestions: (consensusReview.refactoring || []).map((r) => r.text),
        lineFixes: [],  // Deprecated in favour of improvedCode diff

        // ── New extended fields ──
        executiveSummary: consensusReview.executiveSummary || null,
        bugs: consensusReview.bugs || [],
        performance: consensusReview.performance || [],
        security: consensusReview.security || [],
        codeSmells: consensusReview.codeSmells || [],
        refactoring: consensusReview.refactoring || [],
        complexity: consensusReview.complexity || null,
        improvedCode: consensusReview.improvedCode,
        modelsUsed: consensusReview.modelsUsed,
        modelCount: consensusReview.modelCount,

        // ── Confidence data ──
        overallConfidence: confidenceData.overallConfidence,
        issueConfidence: confidenceData.issueConfidence,
        reviewQualityScore: confidenceData.reviewQualityScore,
    };

    const totalDuration = performance.now() - totalStart;
    logger.info(`[OpenRouter] Full pipeline completed in ${totalDuration.toFixed(0)}ms (${results.length}/${results.length + failures.length} models succeeded)`);

    // 8. Cache & return
    reviewCache.set(code, language, finalReview);
    return finalReview;
};

module.exports = { analyzeCodeWithOpenRouter };
