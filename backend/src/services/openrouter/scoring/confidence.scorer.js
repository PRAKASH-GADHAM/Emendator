'use strict';

/**
 * Confidence Scorer
 * ─────────────────────────────────────────────────────────────────────────────
 * Produces lightweight scoring metadata WITHOUT any model training or ML.
 *
 * Outputs:
 *   - overallConfidence  (0–100)
 *   - issueConfidence[]  (per-finding confidence)
 *   - reviewQualityScore (0–100, heuristic completeness × agreement)
 */

// ── Weights ───────────────────────────────────────────────────────────────────

const WEIGHTS = {
    agreementRatio: 0.45,    // How many models agreed?
    avgModelConfidence: 0.35, // Avg self-reported confidence from models
    severityPenalty: 0.20,   // More severe issues = more certain they matter
};

// Severity keywords → weight multiplier for individual findings
const SEVERITY_MAP = [
    { keywords: ['sql injection', 'remote code', 'xss', 'xxe', 'rce', 'authentication bypass', 'buffer overflow'], weight: 1.0 },
    { keywords: ['memory leak', 'null pointer', 'race condition', 'deadlock', 'data loss', 'crash'], weight: 0.9 },
    { keywords: ['undefined', 'unhandled', 'exception', 'error handling', 'input validation', 'security'], weight: 0.8 },
    { keywords: ['performance', 'complexity', 'n+1', 'inefficient', 'slow'], weight: 0.7 },
    { keywords: ['naming', 'readability', 'comment', 'style', 'smell'], weight: 0.5 },
];

const getSeverityWeight = (text) => {
    const lower = (text || '').toLowerCase();
    for (const { keywords, weight } of SEVERITY_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) return weight;
    }
    return 0.6; // default medium severity
};

// ── Per-finding confidence ────────────────────────────────────────────────────

/**
 * For each deduplicated finding (from ConsensusReview), computes how confident
 * we are that it is a real issue, based on:
 *   - How many models reported it
 *   - Severity
 *   - Total available models
 */
const computeIssueConfidences = (consensusFields, totalModels) => {
    const result = {};

    const fields = ['bugs', 'performance', 'security', 'codeSmells', 'refactoring'];

    for (const field of fields) {
        const findings = consensusFields[field] || [];
        result[field] = findings.map((finding) => {
            const agreementRatio = finding.agreementCount / totalModels;
            const severity = getSeverityWeight(finding.text);

            // Individual confidence: agreement heavily weighted
            const confidence = Math.round(
                (agreementRatio * 0.7 + severity * 0.3) * 100
            );

            return {
                text: finding.text,
                confidence: Math.min(100, confidence),
                agreementCount: finding.agreementCount,
                totalModels,
            };
        });
    }

    return result;
};

// ── Overall confidence ────────────────────────────────────────────────────────

/**
 * @param {Object[]} modelResults - Raw model results (before consensus)
 * @param {Object} consensusReview - Output of buildConsensus()
 * @returns {{ overallConfidence: number, issueConfidence: Object, reviewQualityScore: number }}
 */
const scoreConfidence = (modelResults, consensusReview) => {
    const totalModels = modelResults.length;

    // Agreement ratio: average across all finding categories
    const allFindings = [
        ...consensusReview.bugs,
        ...consensusReview.performance,
        ...consensusReview.security,
        ...consensusReview.codeSmells,
        ...consensusReview.refactoring,
    ];

    const agreementRatio = allFindings.length > 0
        ? allFindings.reduce((sum, f) => sum + f.agreementCount / totalModels, 0) / allFindings.length
        : (totalModels / 3); // fallback if no findings

    // Average self-reported model confidence
    const avgModelConfidence = totalModels > 0
        ? modelResults.reduce((sum, r) => sum + (r.modelConfidence || 0.5), 0) / totalModels
        : 0.5;

    // Severity contribution: proportion of high-severity findings
    const highSeverityCount = allFindings.filter((f) => getSeverityWeight(f.text) >= 0.8).length;
    const severityScore = allFindings.length > 0
        ? Math.min(1, highSeverityCount / allFindings.length + 0.3)
        : 0.5;

    const overallConfidence = Math.round(
        (agreementRatio * WEIGHTS.agreementRatio +
            avgModelConfidence * WEIGHTS.avgModelConfidence +
            severityScore * WEIGHTS.severityPenalty) * 100
    );

    // Review quality: penalise if many fields are empty
    const fieldCompleteness = [
        consensusReview.executiveSummary?.length > 20 ? 1 : 0,
        consensusReview.bugs?.length > 0 ? 1 : 0,
        consensusReview.security?.length > 0 ? 1 : 0,
        consensusReview.performance?.length > 0 ? 1 : 0,
        consensusReview.improvedCode?.length > 50 ? 1 : 0,
        consensusReview.complexity?.time !== 'Unknown' ? 1 : 0,
    ];
    const completenessRatio = fieldCompleteness.filter(Boolean).length / fieldCompleteness.length;
    const reviewQualityScore = Math.round(
        completenessRatio * 0.6 * 100 + agreementRatio * 0.4 * 100
    );

    const issueConfidence = computeIssueConfidences(consensusReview, totalModels);

    return {
        overallConfidence: Math.min(100, Math.max(0, overallConfidence)),
        issueConfidence,
        reviewQualityScore: Math.min(100, Math.max(0, reviewQualityScore)),
    };
};

module.exports = { scoreConfidence };
