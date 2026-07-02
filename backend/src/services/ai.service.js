const crypto = require('crypto');
const { performance } = require('perf_hooks');
const openai = require('../config/openai');
const logger = require('../config/logger');
const { createError } = require('../utils/response');

// In-memory cache for code review results (FIFO, capped size)
const reviewCache = new Map();
const MAX_CACHE_SIZE = 100;

const getCacheKey = (code, language) => {
    return crypto.createHash('sha256').update(`${language}:${code}`).digest('hex');
};

const REVIEW_SYSTEM_PROMPT = `You are an expert senior software developer reviewing code.
Analyze the provided code and output ONLY a valid JSON object in this exact schema:
{
  "score": <integer 0-100>,
  "issues": [<string>, ...], // max 4 actual bugs, vulnerabilities, or bad practices
  "suggestions": [<string>, ...], // max 4 optimizations or cleanups
  "lineFixes": [ // max 5 line-specific fixes
    {
      "matchSnippet": "<exact code substring to find>",
      "fix": "<corrected replacement code>",
      "type": "error" | "improvement"
    }
  ]
}
Rules:
1. Output ONLY the raw JSON object. Do not include any markdown backticks, code blocks, or text outside the JSON.
2. "matchSnippet" MUST be an exact copy-paste substring of the provided code.
3. Keep feedback brief, precise, and actionable.`;

const analyzeCode = async (code, language) => {
    const totalStart = performance.now();
    const cacheKey = getCacheKey(code, language);

    // 1. Check in-memory cache
    if (reviewCache.has(cacheKey)) {
        logger.info(`[CACHE HIT] Found duplicate review cache for code hash: ${cacheKey}`);
        const cachedResult = reviewCache.get(cacheKey);
        const totalDuration = performance.now() - totalStart;
        logger.info(`[LATENCY] Total time (Cache Hit): ${totalDuration.toFixed(2)}ms`);
        return cachedResult;
    }

    // 2. Prompt construction stage
    const promptStart = performance.now();
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
    const systemPrompt = REVIEW_SYSTEM_PROMPT;
    const userPrompt = `Language: ${language}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide your code review as a JSON object only.`;
    const promptDuration = performance.now() - promptStart;

    // 3. Model inference stage (with JSON mode & Timeout)
    const inferenceStart = performance.now();
    let response;
    try {
        logger.info(`Starting AI code analysis using Ollama model: ${OLLAMA_MODEL}`);
        response = await openai.chat.completions.create({
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 1200, // Enforce shorter token limit to decrease inference duration
            response_format: { type: 'json_object' }, // Instruct Ollama to output valid JSON strictly
        }, {
            timeout: 45000, // 45 seconds timeout
        });
    } catch (error) {
        if (error.statusCode) throw error;

        // Gracefully catch connection failures to Ollama
        const isConnectionError = 
            error.code === 'ECONNREFUSED' || 
            error.code === 'ENOTFOUND' ||
            error.code === 'ETIMEDOUT' ||
            error.cause?.code === 'ECONNREFUSED' ||
            error.cause?.code === 'ENOTFOUND' ||
            error.cause?.code === 'ETIMEDOUT' ||
            error.name === 'APIConnectionError' ||
            error.message?.toLowerCase().includes('fetch failed') ||
            error.message?.toLowerCase().includes('connection');

        if (isConnectionError) {
            throw createError('Cannot connect to Ollama. Make sure Ollama is running on host.docker.internal:11434.', 503);
        }

        if (error.status === 429) {
            throw createError('Ollama rate limit reached. Please try again later.', 429);
        }
        if (error.status === 401) {
            throw createError('Ollama API authentication failed', 500);
        }
        if (error.status === 400) {
            throw createError('Code content was rejected by AI service', 400);
        }

        logger.error('Ollama API error:', error);
        throw createError('AI service is temporarily unavailable', 503);
    }
    const inferenceDuration = performance.now() - inferenceStart;

    // 4. Parsing and validation stage
    const parsingStart = performance.now();
    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw createError('AI returned empty response', 500);
    }

    // Clean response markup just in case
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedContent = jsonMatch[0];
    }

    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
        logger.error('Failed to parse AI response:', content);
        throw createError('AI returned invalid JSON response', 500);
    }

    if (
        typeof parsed.score !== 'number' ||
        !Array.isArray(parsed.issues) ||
        !Array.isArray(parsed.suggestions)
    ) {
        logger.error('AI response missing required fields:', parsed);
        throw createError('AI returned incomplete response structure', 500);
    }

    // Validate lineFixes — only keep entries where matchSnippet actually appears in code
    const lineFixes = Array.isArray(parsed.lineFixes)
        ? parsed.lineFixes
            .map((lf) => {
                if (!lf || typeof lf.matchSnippet !== 'string' || typeof lf.fix !== 'string') return null;

                // Try exact match first
                if (code.includes(lf.matchSnippet)) {
                    return lf;
                }

                // Try trimmed match
                const trimmed = lf.matchSnippet.trim();
                if (trimmed.length > 0 && code.includes(trimmed)) {
                    return {
                        ...lf,
                        matchSnippet: trimmed,
                    };
                }

                return null;
            })
            .filter((lf) => lf && ['error', 'improvement'].includes(lf.type))
            .slice(0, 5) // Cap at 5 fixes to limit response payload and processing time
        : [];

    const result = {
        score: Math.min(100, Math.max(0, Math.round(parsed.score))),
        issues: parsed.issues.filter((i) => typeof i === 'string').slice(0, 4),
        suggestions: parsed.suggestions.filter((s) => typeof s === 'string').slice(0, 4),
        lineFixes,
    };

    const parsingDuration = performance.now() - parsingStart;
    const totalDuration = performance.now() - totalStart;

    logger.info(`[LATENCY STAGES]
- Prompt construction: ${promptDuration.toFixed(2)}ms
- Model inference: ${inferenceDuration.toFixed(2)}ms
- Parsing & validation: ${parsingDuration.toFixed(2)}ms
- Total end-to-end: ${totalDuration.toFixed(2)}ms`);

    // Save to cache
    if (reviewCache.size >= MAX_CACHE_SIZE) {
        const firstKey = reviewCache.keys().next().value;
        reviewCache.delete(firstKey);
    }
    reviewCache.set(cacheKey, result);

    return result;
};

module.exports = { analyzeCode };