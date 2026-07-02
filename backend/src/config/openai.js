const OpenAI = require('openai');
const logger = require('./logger');

// Ollama runs locally at port 11434
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434/v1';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

if (!OLLAMA_MODEL) {
    logger.warn('⚠️ OLLAMA_MODEL is not set. AI features will not work.');
}

const openai = new OpenAI({
    baseURL: OLLAMA_BASE_URL,
    apiKey: 'ollama', // Ollama doesn't require a real API key
});

logger.info(`🤖 Using Ollama model: ${OLLAMA_MODEL}`);

module.exports = openai;
