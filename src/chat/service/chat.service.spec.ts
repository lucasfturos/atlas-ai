import { ChatService } from './chat.service';
import { ChatRequestDto } from '../dto/chat.dto';
import {
  AIUnsupportedProviderError,
  AIInvalidModelError,
  AIPromptTooLargeError,
} from 'src/ai/errors/ai.error';
import { AIProvider } from 'src/ai/providers/ai-provider.interface';
import { checkRateLimit } from 'src/ai/limits/rate-limits';

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

    service = new ChatService({ gemini: providerMock });
  });

  it('should throw if provider is not supported', async () => {
    const request = {
      provider: 'invalid',
      model: 'any',
      messages: [{ role: 'user', content: 'test' }],
    } as unknown as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toBeInstanceOf(
      AIUnsupportedProviderError,
    );
  });

  it('should throw if model is not allowed', async () => {
    const request = {
      provider: 'gemini',
      model: 'invalid-model',
      messages: [{ role: 'user', content: 'test' }],
    } as ChatRequestDto;

    await expect(service.generateResponse(request)).rejects.toBeInstanceOf(
      AIInvalidModelError,
    );
  });

  it('should throw if prompt exceeds max size', async () => {
    const request = {
      provider: 'gemini',
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
      provider: 'gemini',
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
      gemini: providerMock,
    });

    const request = {
      provider: 'gemini',
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
