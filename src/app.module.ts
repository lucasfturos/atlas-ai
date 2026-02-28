import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { ChatModule } from './chat/module/chat.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 20 }],
    }),
    ChatModule,
  ],
})
export class AppModule {}
