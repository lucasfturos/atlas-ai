import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './ai-provider.interface';
import { ChatMessage } from '../../chat/dto/chat.dto';
import { AIConfigError, AIError, AIProviderError } from '../errors/ai.error';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new AIConfigError('GEMINI API KEY not configured');
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  async generate(model: string, messages: ChatMessage[]): Promise<string> {
    try {
      const prompt = messages.map((m) => m.content).join('\n');

      const response = await this.client.models.generateContent({
        model,
        contents: prompt,
      });

      if (!response.text) {
        throw new AIProviderError('Empty response from Gemini');
      }

      return response.text;
    } catch (err) {
      if (err instanceof AIError) {
        throw err;
      }

      throw new AIProviderError('Error communicating with Gemini.');
    }
  }
}
