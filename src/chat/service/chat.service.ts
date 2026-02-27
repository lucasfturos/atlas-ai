import { Injectable } from '@nestjs/common';
import {
  AIError,
  AIInvalidModelError,
  AIPromptTooLargeError,
  AIUnsupportedProviderError,
} from 'src/ai/errors/ai.error';
import { checkRateLimit } from 'src/ai/limits/rate-limits';
import { ALLOWED_MODELS } from 'src/ai/models/allowed-models';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';
import { AIProvider } from 'src/ai/providers/interface/ai-provider.interface';

import { ChatMessage, ChatRequestDto } from '../dto/chat.dto';

const MAX_CHARS = 4000;

@Injectable()
export class ChatService {
  constructor(
    private readonly providers: Partial<Record<AIProviderName, AIProvider>>,
  ) {}

  async generateResponse(data: ChatRequestDto): Promise<string> {
    checkRateLimit('global');

    const { provider, model, messages } = data;

    const aiProvider = this.getProvider(provider);

    this.validateModel(provider, model);
    this.validatePromptSize(messages);

    try {
      return await aiProvider.generate(model, messages);
    } catch (err) {
      if (err instanceof AIError) {
        throw err;
      }

      throw err;
    }
  }

  private getProvider(provider: AIProviderName): AIProvider {
    const aiProvider = this.providers[provider];

    if (!aiProvider) {
      throw new AIUnsupportedProviderError(
        `Provider not supported: ${provider}`,
      );
    }

    return aiProvider;
  }

  private validateModel(provider: AIProviderName, model: string): void {
    const allowedModels = ALLOWED_MODELS[provider];

    if (!allowedModels || !allowedModels.includes(model)) {
      throw new AIInvalidModelError(provider, model);
    }
  }

  private validatePromptSize(messages: ChatMessage[]): void {
    const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);

    if (totalChars > MAX_CHARS) {
      throw new AIPromptTooLargeError(
        `Prompt too large: ${totalChars} characters (max ${MAX_CHARS})`,
      );
    }
  }
}
