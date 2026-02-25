import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat.dto';
import { AIProvider } from '../ai/providers/ai-provider.interface';
import { GeminiProvider } from '../ai/providers/gemini.provider';
import {
  AIError,
  AIUnsupportedProviderError,
  AIPromptTooLargeError,
  AIInvalidModelError,
} from 'src/ai/errors/ai.error';
import { ALLOWED_MODELS } from 'src/ai/models/allowed-models';
import { ChatMessage } from './dto/chat.dto';

const MAX_CHARS = 4000;

@Injectable()
export class ChatService {
  private providers: Record<string, AIProvider>;

  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
    };
  }

  async generateResponse(data: ChatRequestDto): Promise<string> {
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

  private getProvider(provider: string): AIProvider {
    const aiProvider = this.providers[provider];

    if (!aiProvider) {
      throw new AIUnsupportedProviderError(
        `Provider not supported: ${provider}`,
      );
    }

    return aiProvider;
  }

  private validateModel(provider: string, model: string): void {
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
