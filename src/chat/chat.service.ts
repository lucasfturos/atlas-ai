import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat.dto';
import { AIProvider } from '../ai/providers/ai-provider.interface';
import { GeminiProvider } from '../ai/providers/gemini.provider';
import { AIError, AIUnsupportedProviderError } from 'src/ai/errors/ai.error';

@Injectable()
export class ChatService {
  private providers: Record<string, AIProvider>;

  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
    };
  }

  async generateResponse(data: ChatRequestDto): Promise<string> {
    const provider = this.providers[data.provider];

    if (!provider) {
      throw new AIUnsupportedProviderError(
        `Provider not supported: ${data.provider}`,
      );
    }

    try {
      return await provider.generate(data.model, data.messages);
    } catch (err) {
      if (err instanceof AIError) {
        throw err;
      }

      throw err;
    }
  }
}
