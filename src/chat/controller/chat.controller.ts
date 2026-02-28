import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  AIConfigError,
  AIInvalidModelError,
  AIPromptTooLargeError,
  AIProviderError,
  AIUnsupportedProviderError,
} from 'src/ai/errors/ai.error';
import { DEFAULT_MODELS } from 'src/ai/models/allowed-models';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';

import { ChatRequestDto } from '../dto/chat.dto';
import { ChatService } from '../service/chat.service';
import { renderError, renderResult, renderTestForm } from './chat-test.view';

import type { Response } from 'express';
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
      return this.handleApiError(err, res);
    }
  }

  @Get('test')
  async test(
    @Query('q') q: string,
    @Res() res: Response,
    @Query('provider') provider: AIProviderName = AIProviderName.GEMINI,
    @Query('model') model?: string,
  ) {
    if (!q) {
      return res.send(
        renderTestForm({
          provider,
          model: DEFAULT_MODELS[provider],
        }),
      );
    }

    try {
      const output = await this.chatService.generateResponse({
        provider: provider,
        model: model ?? DEFAULT_MODELS[provider],
        messages: [{ role: 'user', content: q }],
      });

      return res.send(renderResult(output));
    } catch (err) {
      return res.send(renderError(err));
    }
  }

  private handleApiError(err: unknown, res: Response) {
    if (err instanceof AIConfigError) {
      return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ error: err.message });
    }

    if (err instanceof AIUnsupportedProviderError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }

    if (err instanceof AIInvalidModelError) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
    }

    if (err instanceof AIPromptTooLargeError) {
      return res
        .status(HttpStatus.PAYLOAD_TOO_LARGE)
        .json({ error: err.message });
    }

    if (err instanceof AIProviderError) {
      return res.status(HttpStatus.BAD_GATEWAY).json({ error: err.message });
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal error' });
  }
}
