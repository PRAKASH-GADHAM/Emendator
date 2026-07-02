'use strict';

/**
 * Review Consensus Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives an array of normalised model results (1–3 items) and produces a
 * single high-quality ConsensusReview by:
 *   1. Deduplicating overlapping findings
 *   2. Detecting & resolving conflicting recommendations
 *   3. Selecting the strongest description for each merged finding
 *   4. Aggregating scores
 *   5. Selecting the best improved code
 */

// ── Similarity helpers ────────────────────────────────────────────────────────

/**
 * Very fast normalised Levenshtein-based similarity (0–1).
 * Only used for short strings (< 200 chars) to avoid O(n²) on long code.
 */
const similarity = (a, b) => {
    if (!a || !b) return 0;
    if (a === b) return 1;

    const s1 = (a || '').toLowerCase().slice(0, 200);
    const s2 = (b || '').toLowerCase().slice(0, 200);

    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1;

    // Build matrix only for short strings; use trigram jaccard for longer
    if (s1.length <= 100 && s2.length <= 100) {
        return levenshteinSimilarity(s1, s2, maxLen);
    }
    return trigramJaccard(s1, s2);
};

const levenshteinSimilarity = (a, b, maxLen) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return 1 - dp[m][n] / maxLen;
};

const trigramJaccard = (a, b) => {
    const ngrams = (s) => {
        const set = new Set();
        for (let i = 0; i <= s.length - 3; i++) set.add(s.slice(i, i + 3));
        return set;
    };
    const sa = ngrams(a), sb = ngrams(b);
    let intersection = 0;
    for (const g of sa) if (sb.has(g)) intersection++;
    const union = sa.size + sb.size - intersection;
    return union === 0 ? 0 : intersection / union;
};

const SIMILARITY_THRESHOLD = 0.72; // strings above this are considered duplicates

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Merges an array of string arrays (one per model) into a deduplicated list.
 * For each cluster of similar items:
 *   - Picks the longest (most detailed) version
 *   - Tracks how many models reported it (agreementCount)
 *
 * @param {string[][]} arrays - one string[] per model
 * @returns {{ text: string, agreementCount: number }[]}
 */
const deduplicateFindings = (arrays) => {
    const all = arrays.flat().filter(Boolean);
    const clusters = [];

    for (const item of all) {
        let merged = false;
        for (const cluster of clusters) {
            if (similarity(item, cluster.representative) >= SIMILARITY_THRESHOLD) {
                cluster.agreementCount++;
                // Keep the longest / most descriptive variant
                if (item.length > cluster.representative.length) {
                    cluster.representative = item;
                }
                merged = true;
                break;
            }
        }
        if (!merged) {
            clusters.push({ representative: item, agreementCount: 1 });
        }
    }

    // Sort: multi-model agreement first, then length
    clusters.sort((a, b) => b.agreementCount - a.agreementCount || b.representative.length - a.representative.length);

    return clusters.map(({ representative, agreementCount }) => ({
        text: representative,
        agreementCount,
    }));
};

// ── Conflict detection ────────────────────────────────────────────────────────

/**
 * Simple heuristic: if two clusters contain opposing signals for the same term,
 * flag the one with fewer model agreements as potentially conflicting and omit it.
 * Example: "Use X" vs "Avoid X" → keep the majority view.
 */
const resolveConflicts = (clusters) => {
    const CONFLICT_PAIRS = [
        ['use ', 'avoid '],
        ['add ', 'remove '],
        ['enable ', 'disable '],
        ['increase ', 'decrease '],
        ['synchronous', 'asynchronous'],
        ['mutex', 'lock-free'],
    ];

    return clusters.filter((cluster, idx) => {
        for (const [pos, neg] of CONFLICT_PAIRS) {
            const text = (cluster.representative || '').toLowerCase();
            if (text.includes(pos) || text.includes(neg)) {
                const opponent = text.includes(pos) ? neg : pos;
                const conflictingCluster = clusters.find((c, j) => {
                    if (j === idx) return false;
                    const other = (c.representative || '').toLowerCase();
                    return other.includes(opponent) && similarity(text.replace(pos, '').replace(neg, ''), other.replace(pos, '').replace(neg, '')) > 0.6;
                });
                if (conflictingCluster) {
                    // Keep the one with more model agreement
                    if (cluster.agreementCount < conflictingCluster.agreementCount) return false;
                }
            }
        }
        return true;
    });
};

// ── Score aggregation ─────────────────────────────────────────────────────────

/**
 * Weighted average score. Weight = modelConfidence reported by each model.
 */
const aggregateScore = (results) => {
    const totalWeight = results.reduce((sum, r) => sum + r.modelConfidence, 0);
    if (totalWeight === 0) {
        return Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
    }
    const weightedSum = results.reduce((sum, r) => sum + r.score * r.modelConfidence, 0);
    return Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight)));
};

// ── Executive summary selection ───────────────────────────────────────────────

/**
 * Picks the most informative executive summary.
 * Heuristic: prefer the one from the highest-confidence model.
 */
const pickBestSummary = (results) => {
    const best = results.reduce((prev, curr) =>
        curr.modelConfidence > prev.modelConfidence ? curr : prev
    );
    return best.executiveSummary;
};

// ── Improved code selection ───────────────────────────────────────────────────

/**
 * Returns the improved code from the model with the highest score.
 * If tied, prefers the longest non-empty version.
 */
const pickBestImprovedCode = (results) => {
    const ranked = [...results].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.improvedCode?.length || 0) - (a.improvedCode?.length || 0);
    });
    for (const r of ranked) {
        if (r.improvedCode && r.improvedCode.trim().length > 0) {
            return r.improvedCode;
        }
    }
    return '';
};

// ── Complexity selection ──────────────────────────────────────────────────────

const pickComplexity = (results) => {
    const best = results.reduce((prev, curr) =>
        curr.modelConfidence > prev.modelConfidence ? curr : prev
    );
    return best.complexity;
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Builds a single ConsensusReview from 1–3 model results.
 *
 * @param {Object[]} modelResults - Array of normalised model responses
 * @returns {Object} ConsensusReview
 */
const buildConsensus = (modelResults) => {
    if (!modelResults || modelResults.length === 0) {
        throw new Error('Consensus engine received no model results');
    }

    // Helper: deduplicate + resolve for a named field
    const consensus = (field) => {
        const arrays = modelResults.map((r) => r[field] || []);
        const clusters = deduplicateFindings(arrays);
        return resolveConflicts(clusters);
    };

    const bugs = consensus('bugs');
    const performance = consensus('performance');
    const security = consensus('security');
    const codeSmells = consensus('codeSmells');
    const refactoring = consensus('refactoring');

    const aggregatedScore = aggregateScore(modelResults);
    const executiveSummary = pickBestSummary(modelResults);
    const improvedCode = pickBestImprovedCode(modelResults);
    const complexity = pickComplexity(modelResults);
    const modelsUsed = modelResults.map((r) => r.modelName);

    return {
        executiveSummary,
        bugs,
        performance,
        security,
        codeSmells,
        refactoring,
        complexity,
        improvedCode,
        score: aggregatedScore,
        modelsUsed,
        modelCount: modelResults.length,
    };
};

module.exports = { buildConsensus };
