import { BaseAIProvider } from './base.provider';
import { AIConfigError } from 'src/ai/errors/ai.error';

export class LlamaProvider extends BaseAIProvider {
  constructor() {
    const apiKey = process.env.LLAMA_API_KEY;

    if (!apiKey) {
      throw new AIConfigError('LLAMA API KEY not configured');
    }

    super(apiKey, 'https://api.llama.com/compat/v1/');
  }
}
