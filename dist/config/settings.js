import dotenv from 'dotenv';
dotenv.config();
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
export const MODEL_USE = process.env.MODEL_USE || 'perplexity/sonar';
export const PERPLEXITY_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const CHARACTER_LIMIT = 25000;
if (!OPENROUTER_API_KEY) {
    console.error('Warning: OPENROUTER_API_KEY not set in environment variables');
    console.error('Please set it in your .env file or environment');
}
// Log configuration on startup
console.error(`Configuration loaded:`);
console.error(`- Model: ${MODEL_USE}`);
console.error(`- API Key: ${OPENROUTER_API_KEY ? 'Set' : 'NOT SET'}`);
//# sourceMappingURL=settings.js.map