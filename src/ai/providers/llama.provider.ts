import LlamaAPIClient from 'llama-api-client';
import { ChatMessage } from 'src/chat/dto/chat.dto';

import { AIConfigError, AIError, AIProviderError } from '../errors/ai.error';
import { AIProvider } from './interface/ai-provider.interface';

export class LlamaProvider implements AIProvider {
  private client: LlamaAPIClient;

  constructor() {
    const apiKey = process.env.LLAMA_API_KEY;

    if (!apiKey) {
      throw new AIConfigError('LLAMA API KEY not configured');
    }

    this.client = new LlamaAPIClient({ apiKey });
  }

  async generate(model: string, messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
      });

      const message = response.completion_message;

      if (!message || !message.content) {
        throw new AIProviderError('Empty response from Llama');
      }

      return this.extractTextContent(message.content);
    } catch (err) {
      if (err instanceof AIError) {
        throw err;
      }

      throw new AIProviderError('Llama provider failed');
    }
  }

  extractTextContent(
    content: string | { text?: string } | { text?: string }[],
  ): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item) => item.text ?? '').join('');
    }

    return content.text ?? '';
  }
}
