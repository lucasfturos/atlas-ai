import OpenAI from 'openai';
import { ChatMessage } from 'src/chat/dto/chat.dto';
import { AIProviderError } from 'src/ai/errors/ai.error';

export abstract class BaseAIProvider {
  protected client: OpenAI;

  constructor(apiKey: string, baseURL?: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async generate(model: string, messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
      });

      const text = response.choices?.[0]?.message?.content;

      if (!text) {
        throw new AIProviderError('Empty response from provider');
      }

      return text;
    } catch {
      throw new AIProviderError('Provider communication failed');
    }
  }
}
