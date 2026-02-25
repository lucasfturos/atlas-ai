import { Module } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { ChatController } from '../controller/chat.controller';
import { GeminiProvider } from 'src/ai/providers/gemini.provider';

@Module({
  controllers: [ChatController],
  providers: [
    {
      provide: 'AI_PROVIDERS',
      useFactory: () => ({
        gemini: new GeminiProvider(),
      }),
    },
    {
      provide: ChatService,
      useFactory: (providers) => new ChatService(providers),
      inject: ['AI_PROVIDERS'],
    },
  ],
})
export class ChatModule {}
