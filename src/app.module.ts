import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 20 }],
    }),
    ChatModule,
  ],
})
export class AppModule {}
