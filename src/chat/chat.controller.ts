import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }

  @Post()
  async chat(@Body() body: ChatRequestDto) {
    const output = await this.chatService.generateResponse(body);

    return {
      provider: body.provider,
      model: body.model,
      message: {
        role: 'assistant',
        content: output,
      },
    };
  }
}
