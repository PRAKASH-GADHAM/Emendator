'use strict';

const { performance } = require('perf_hooks');
const logger = require('../../config/logger');
const { createError } = require('../../utils/response');
const problemService = require('./problem.service');
const executionService = require('./execution.service');
const prisma = require('../../config/database');

const gemmaClient = require('../../services/openrouter/models/gemma.client');
const nemotronClient = require('../../services/openrouter/models/nemotron.client');
const gptossClient = require('../../services/openrouter/models/gptoss.client');
const { buildConsensus } = require('../../services/openrouter/consensus/consensus.engine');
const { scoreConfidence } = require('../../services/openrouter/scoring/confidence.scorer');
const { MAX_CODE_LENGTH } = require('../../services/openrouter/config/openrouter.config');

const buildLeetCodeSystemPrompt = () => `You are an elite competitive programmer and software engineer reviewing a LeetCode solution.

You have deep expertise in algorithms, data structures, time/space complexity analysis, and competitive programming patterns.

Analyze the submitted solution across ALL of the following dimensions:

1. CORRECTNESS — Does the algorithm correctly solve the specific LeetCode problem? Verify against the problem statement, examples, and constraints.
2. TEST BEHAVIOR — Which test cases passed/failed and why?
3. CONSTRAINT ANALYSIS — Does the algorithm handle maximum input sizes within time/memory limits?
4. TIME COMPLEXITY — Precise Big-O analysis with justification based on the algorithm used.
5. SPACE COMPLEXITY — Precise Big-O analysis with justification.
6. BUGS — Only identify concrete bugs that would cause incorrect behavior. Do not invent speculative issues.
7. EDGE CASES — Which edge cases are handled? Which are missed?
8. CODE QUALITY — Naming, readability, structure, maintainability.
9. ALGORITHM ANALYSIS — What algorithm/pattern is used? Is it optimal for this problem class?
10. IMPROVEMENT — Provide actionable, specific suggestions for a better solution.
11. IMPROVED CODE — Provide a complete, compilable improved version if improvements are possible.

OUTPUT RULES (strict):
- Output ONLY a single raw JSON object matching the schema below. No markdown, no code fences, no prose outside JSON.
- Every field in the schema is required. Arrays may be empty [] but must be present.
- "improvedCode" must be the complete improved source, not a snippet.
- "modelConfidence" is your self-assessed confidence (0.0 = guessing, 1.0 = certain).
- Keep individual list items concise (≤ 120 chars each) but accurate.
- Base your analysis on the ACTUAL problem being solved, not generic advice.

REQUIRED JSON SCHEMA:
{
  "executiveSummary": "<2-3 sentence overall assessment of the solution's correctness, efficiency, and quality>",
  "bugs": ["<specific bug description>"],
  "performance": ["<performance issue specific to this algorithm/problem>"],
  "security": ["<any security concerns, if applicable>"],
  "codeSmells": ["<code smell>"],
  "refactoring": ["<specific refactoring suggestion>"],
  "complexity": {
    "time": "<Big-O time complexity>",
    "space": "<Big-O space complexity>",
    "explanation": "<brief explanation of why this is the complexity>"
  },
  "improvedCode": "<complete improved version of the code, compilable if possible>",
  "score": <integer 0-100>,
  "modelConfidence": <float 0.0-1.0>,
  "correctnessAnalysis": "<detailed correctness analysis specific to this problem>",
  "constraintAnalysis": "<does the solution work within the problem's constraints?>",
  "algorithmUsed": "<name of the algorithm/pattern used>",
  "isOptimal": <boolean>,
  "edgeCasesHandled": ["<list of edge cases the solution handles>"],
  "edgeCasesMissed": ["<list of edge cases the solution misses>"]
}`;

const buildLeetCodeUserPrompt = (problem, language, code, testResults) => {
    let sanitizedCode = code
        .replace(/\0/g, '')
        .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .slice(0, MAX_CODE_LENGTH);

    sanitizedCode = sanitizedCode.replace(/([\{\}\[\]<>]{10,})/g, (m) => m.slice(0, 10));

    const testResultsText = testResults
        ? testResults.map((r, i) =>
            `Test ${i + 1}: ${r.status} (Expected: ${r.expected}, Got: ${r.actual || 'N/A'}${r.error ? `, Error: ${r.error.slice(0, 200)}` : ''})`
        ).join('\n')
        : 'No test results provided';

    return `PROBLEM #${problem.number}: ${problem.title}
Difficulty: ${problem.difficulty}
Topics: ${(problem.topics || []).join(', ')}

DESCRIPTION:
${problem.description}

CONSTRAINTS:
${(problem.constraints || []).join('\n')}

EXAMPLES:
${(problem.examples || []).map((ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}${ex.explanation ? `\nExplanation: ${ex.explanation}` : ''}`).join('\n\n')}

LANGUAGE: ${language}

SOLUTION CODE:
\`\`\`${language}
${sanitizedCode}
\`\`\`

TEST RESULTS:
${testResultsText}

Respond with ONLY the JSON object described in the system prompt. No other text.`;
};

const reviewLeetCodeProblem = async ({ userId, problemId, language, code }) => {
    const totalStart = performance.now();

    const problem = await problemService.getProblemById(problemId);

    let testResults = null;
    try {
        const execResult = await executionService.executeCode(problemId, language, code);
        testResults = execResult.testResults;
    } catch (e) {
        logger.warn(`[LeetCode Review] Execution failed, proceeding without test results: ${e.message}`);
    }

    const systemPrompt = buildLeetCodeSystemPrompt();
    const userPrompt = buildLeetCodeUserPrompt(problem, language, code, testResults);

    const models = [
        { client: gemmaClient, key: 'OPENROUTER_API_KEY_GEMMA' },
        { client: nemotronClient, key: 'OPENROUTER_API_KEY_NEMOTRON' },
        { client: gptossClient, key: 'OPENROUTER_API_KEY_GPTOSS' },
    ];

    const activeModels = models.filter(({ key }) => !!process.env[key]);

    if (activeModels.length === 0) {
        throw createError('No AI models configured. Set OpenRouter API keys.', 503);
    }

    logger.info(`[LeetCode Review] Dispatching to ${activeModels.length} model(s) for problem #${problem.number}`);

    const settled = await Promise.allSettled(
        activeModels.map(({ client }) => client.query(systemPrompt, userPrompt))
    );

    const results = [];
    const failures = [];

    settled.forEach((outcome, idx) => {
        const modelName = activeModels[idx].client.name;
        if (outcome.status === 'fulfilled') {
            results.push(outcome.value);
        } else {
            failures.push(`${modelName}: ${outcome.reason?.message || 'Unknown error'}`);
            logger.warn(`[LeetCode Review] ${modelName} failed: ${outcome.reason?.message}`);
        }
    });

    if (results.length === 0) {
        throw createError(`All AI models failed. ${failures.join('; ')}`, 503);
    }

    const consensusReview = buildConsensus(results);
    const confidenceData = scoreConfidence(results, consensusReview);

    const finalReview = {
        score: consensusReview.score,
        issues: (consensusReview.bugs || []).map((b) => b.text),
        suggestions: (consensusReview.refactoring || []).map((r) => r.text),
        lineFixes: [],
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
        overallConfidence: confidenceData.overallConfidence,
        issueConfidence: confidenceData.issueConfidence,
        reviewQualityScore: confidenceData.reviewQualityScore,
        problemNumber: problem.number,
        problemTitle: problem.title,
        testResults,
    };

    try {
        await prisma.leetCodeReview.create({
            data: {
                userId,
                code,
                problemTitle: problem.title,
                problemDesc: problem.description,
                language,
                testResults: testResults || undefined,
                score: finalReview.score,
                metadata: {
                    executiveSummary: finalReview.executiveSummary,
                    bugs: finalReview.bugs,
                    performance: finalReview.performance,
                    security: finalReview.security,
                    codeSmells: finalReview.codeSmells,
                    refactoring: finalReview.refactoring,
                    complexity: finalReview.complexity,
                    improvedCode: finalReview.improvedCode,
                    modelsUsed: finalReview.modelsUsed,
                    modelCount: finalReview.modelCount,
                    overallConfidence: finalReview.overallConfidence,
                    problemNumber: problem.number,
                    problemTitle: problem.title,
                },
            },
        });
    } catch (e) {
        logger.warn(`[LeetCode Review] Failed to save review: ${e.message}`);
    }

    const totalDuration = performance.now() - totalStart;
    logger.info(`[LeetCode Review] Completed for #${problem.number} in ${totalDuration.toFixed(0)}ms (${results.length} models)`);

    return finalReview;
};

module.exports = { reviewLeetCodeProblem };
