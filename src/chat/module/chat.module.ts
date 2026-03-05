import { Module } from '@nestjs/common';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';
import { GeminiProvider } from 'src/ai/providers/gemini.provider';
import { AIProvider } from 'src/ai/providers/interface/ai-provider.interface';
import { LlamaProvider } from 'src/ai/providers/llama.provider';

import { ChatController } from '../controller/chat.controller';
import { ChatService } from '../service/chat.service';
import { AuthModule } from 'src/auth/module/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [
    {
      provide: 'AI_PROVIDERS',
      useFactory: (): Record<AIProviderName, AIProvider> => ({
        [AIProviderName.GEMINI]: new GeminiProvider(),
        [AIProviderName.LLAMA]: new LlamaProvider(),
      }),
    },
    {
      provide: ChatService,
      useFactory: (providers: Record<AIProviderName, AIProvider>) =>
        new ChatService(providers),
      inject: ['AI_PROVIDERS'],
    },
  ],
})
export class ChatModule {}
