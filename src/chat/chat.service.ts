import { Injectable } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat.dto';
import { generateGeminiResponse } from '../ai/providers/gemini.provider';

@Injectable()
export class ChatService {
  async generateResponse(data: ChatRequestDto) {
    const { provider, model, messages } = data;

    if (provider === 'gemini') {
      return generateGeminiResponse(model, messages);
    }

    throw new Error('Provider não suportado');
  }
}
