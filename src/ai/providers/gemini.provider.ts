import { BaseAIProvider } from './base.provider';
import { AIConfigError } from 'src/ai/errors/ai.error';

export class GeminiProvider extends BaseAIProvider {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new AIConfigError('GEMINI API KEY not configured');
    }

    super(apiKey, 'https://generativelanguage.googleapis.com/v1beta/openai/');
  }
}
