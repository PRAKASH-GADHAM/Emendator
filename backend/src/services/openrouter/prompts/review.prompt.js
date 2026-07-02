'use strict';

const { MAX_CODE_LENGTH } = require('../config/openrouter.config');

/**
 * JSON schema that every model MUST return.
 * This is embedded verbatim in the system prompt so models cannot deviate.
 */
const RESPONSE_SCHEMA = `{
  "executiveSummary": "<2-3 sentence overall assessment>",
  "bugs": ["<bug description>"],
  "performance": ["<performance issue>"],
  "security": ["<security issue>"],
  "codeSmells": ["<code smell>"],
  "refactoring": ["<refactoring suggestion>"],
  "complexity": {
    "time": "<Big-O time complexity>",
    "space": "<Big-O space complexity>",
    "explanation": "<brief explanation>"
  },
  "improvedCode": "<complete improved version of the code, compilable if possible>",
  "score": <integer 0-100>,
  "modelConfidence": <float 0.0-1.0>
}`;

/**
 * Constructs the system prompt.
 * Explains the exact JSON schema and review criteria once, reused for all models.
 */
const buildSystemPrompt = () => `You are an elite senior software engineer performing a thorough, structured code review.

Analyze the submitted code across ALL of the following dimensions:
1. Correctness & Logic — Does the code do what it intends? Are there off-by-one errors, wrong conditions, or missed edge cases?
2. Bugs — Identify concrete defects that would cause incorrect behaviour or crashes.
3. Security — Injection risks, insecure defaults, exposed secrets, unvalidated inputs, improper error handling.
4. Performance — Unnecessary allocations, O(n²) loops, blocking calls, missing memoisation.
5. Memory — Leaks, unbounded growth, retained references.
6. Code Smells — Duplicated logic, dead code, misleading names, overly long functions.
7. Readability & Maintainability — Clarity, naming conventions, comment quality.
8. Scalability — Will this code hold up under load?
9. Best Practices — Language idioms, design patterns, SOLID principles.
10. Time & Space Complexity — Asymptotic analysis.
11. Refactoring — Concrete, actionable restructuring suggestions.
12. Improved Code — Provide a COMPLETE, compilable improved version.

OUTPUT RULES (strict):
- Output ONLY a single raw JSON object matching the schema below. No markdown, no code fences, no prose outside JSON.
- Every field in the schema is required. Arrays may be empty [] but must be present.
- "improvedCode" must be the complete improved source, not a snippet.
- "modelConfidence" is your self-assessed confidence (0.0 = guessing, 1.0 = certain).
- Keep individual list items concise (≤ 120 chars each) but accurate.

REQUIRED JSON SCHEMA:
${RESPONSE_SCHEMA}`;

/**
 * Constructs the per-request user prompt.
 * Sanitises code to mitigate prompt-injection attacks.
 */
const buildUserPrompt = (code, language) => {
    // Sanitise: strip null bytes, control characters (except newlines/tabs)
    let sanitizedCode = code
        .replace(/\0/g, '')
        .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .slice(0, MAX_CODE_LENGTH);

    // Prevent repeated special-char sequences that could confuse tokenisers
    sanitizedCode = sanitizedCode.replace(/([\{\}\[\]<>]{10,})/g, (m) => m.slice(0, 10));

    return `Language: ${language}

Code to review:
\`\`\`${language}
${sanitizedCode}
\`\`\`

Respond with ONLY the JSON object described in the system prompt. No other text.`;
};

module.exports = { buildSystemPrompt, buildUserPrompt, RESPONSE_SCHEMA };
