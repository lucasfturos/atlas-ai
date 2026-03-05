import {
  AIInvalidModelError,
  AIPromptTooLargeError,
  AIUnsupportedProviderError,
} from 'src/ai/errors/ai.error';
import { checkRateLimit } from 'src/ai/limits/rate-limits';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';
import { AIProvider } from 'src/ai/providers/interface/ai-provider.interface';

import { ChatRequestDto } from 'src/chat/dto/chat.dto';
import { ChatService } from './chat.service';

jest.mock('src/ai/limits/rate-limits', () => ({
  checkRateLimit: jest.fn(),
}));

const mockedCheckRateLimit = checkRateLimit as jest.Mock;

describe('ChatService', () => {
  let service: ChatService;

  const providerMock: AIProvider = {
    generate: jest.fn(),
  };

  beforeEach(() => {
    mockedCheckRateLimit.mockClear();
    mockedCheckRateLimit.mockImplementation(() => {});

    service = new ChatService({ [AIProviderName.GEMINI]: providerMock });
  });

  it('should throw if provider is not supported', async () => {
    const request = {
      provider: 'invalid' as AIProviderName,
      model: 'any',
      messages: [{ role: 'user', content: 'test' }],
    } as unknown as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toBeInstanceOf(
      AIUnsupportedProviderError,
    );
  });

  it('should throw if model is not allowed', async () => {
    const request = {
      provider: AIProviderName.GEMINI,
      model: 'invalid-model',
      messages: [{ role: 'user', content: 'test' }],
    } as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toBeInstanceOf(
      AIInvalidModelError,
    );
  });

  it('should throw if prompt exceeds max size', async () => {
    const request = {
      provider: AIProviderName.GEMINI,
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: 'a'.repeat(5000) }],
    } as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toBeInstanceOf(
      AIPromptTooLargeError,
    );
  });

  it('should throw when rate limit is exceeded', async () => {
    mockedCheckRateLimit.mockImplementation(() => {
      throw new Error('Rate limit exceeded');
    });

    const request = {
      provider: AIProviderName.GEMINI,
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: 'test' }],
    } as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toThrow(
      'Rate limit exceeded',
    );
  });

  it('should return response when input is valid', async () => {
    const mockGenerate = jest.fn().mockResolvedValue('ok');

    const providerMock: AIProvider = {
      generate: mockGenerate,
    };

    service = new ChatService({
      [AIProviderName.GEMINI]: providerMock,
    });

    const request = {
      provider: AIProviderName.GEMINI,
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: 'hello' }],
    } as ChatRequestDto;

    const result = await service.generateResponse(request);

    expect(result).toBe('ok');
    expect(mockGenerate).toHaveBeenCalledWith(
      'gemini-3-flash-preview',
      request.messages,
    );
  });
});
