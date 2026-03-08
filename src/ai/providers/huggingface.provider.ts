import { BaseAIProvider } from './base.provider';
import { AIConfigError } from 'src/ai/errors/ai.error';

export class HuggingFaceProvider extends BaseAIProvider {
  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      throw new AIConfigError('HUGGINGFACE API KEY not configured');
    }

    super(apiKey, 'https://router.huggingface.co/v1');
  }
}
