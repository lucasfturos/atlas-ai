import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';
import {
  AIConfigError,
  AIProviderError,
  AIUnsupportedProviderError,
} from '../ai/errors/ai.error';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequestDto, @Res() res: Response) {
    try {
      const output = await this.chatService.generateResponse(body);

      return res.status(HttpStatus.OK).json({
        provider: body.provider,
        model: body.model,
        message: {
          role: 'assistant',
          content: output,
        },
      });
    } catch (err) {
      if (err instanceof AIConfigError) {
        return res
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json({ error: err.message });
      }

      if (err instanceof AIUnsupportedProviderError) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
      }

      if (err instanceof AIProviderError) {
        return res.status(HttpStatus.BAD_GATEWAY).json({ error: err.message });
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal error' });
    }
  }

  @Get('test')
  async test(@Query('q') q: string, @Res() res: Response) {
    try {
      if (!q) {
        return res.send(`
          <html>
            <body>
              <h2>Atlas AI - Teste</h2>
              <form method="get">
                <input name="q" style="width:300px" placeholder="Digite sua pergunta" />
                <button type="submit">Enviar</button>
              </form>
            </body>
          </html>
        `);
      }

      const output = await this.chatService.generateResponse({
        provider: 'gemini',
        model: 'gemini-3-flash-preview',
        messages: [{ role: 'user', content: q }],
      });

      return res.send(`<html><pre>${output}</pre></html>`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      return res.send(`
        <html>
          <body>
            <h2>Atlas AI - Erro</h2>
            <pre>${message}</pre>
          </body>
        </html>
      `);
    }
  }
}
