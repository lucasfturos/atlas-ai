import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  AIConfigError,
  AIGlobalLimitError,
  AIInvalidModelError,
  AIPromptTooLargeError,
  AIProviderError,
  AIUnsupportedProviderError,
} from 'src/ai/errors/ai.error';
import {
  checkGlobalChatLimit,
  unlockGlobalChatLimit,
} from 'src/ai/limits/global-chat-limits';
import { ALLOWED_MODELS, DEFAULT_MODELS } from 'src/ai/models/allowed-models';
import { AIProviderName } from 'src/ai/providers/enum/ai-provider.enum';
import { JwtOptionalGuard } from 'src/auth/guard/jwt-optional.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { extractPasswordFromPrompt } from 'src/auth/utils/extract-password';
import { ChatRequestDto } from 'src/chat/dto/chat.dto';
import { ChatService } from 'src/chat/service/chat.service';

import { renderError, renderResult, renderTestForm } from './chat-test.view';

import type { Response, Request } from 'express';
@Controller('v1/chat')
@UseGuards(JwtOptionalGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async chat(
    @Body() body: ChatRequestDto,
    @Req() req: Request & { isAdmin?: boolean },
    @Res() res: Response,
  ) {
    try {
      console.log(JSON.stringify(body.messages, null, 2));

      const messages = body.messages ?? [];

      for (const message of messages) {
        if (!message?.content) continue;

        const { password, prompt } = extractPasswordFromPrompt(message.content);

        if (password && this.authService.validatePassword(password)) {
          unlockGlobalChatLimit();
          req.isAdmin = true;
        }

        message.content = prompt;
      }

      if (!req.isAdmin) {
        const limit = Number(process.env.GLOBAL_CHAT_LIMIT ?? 5);
        checkGlobalChatLimit(limit);
      }

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

  @Get('models')
  getModels(@Query('provider') provider?: AIProviderName) {
    if (provider) {
      const models = ALLOWED_MODELS[provider];

      if (!models) {
        throw new AIUnsupportedProviderError(provider);
      }

      return {
        provider,
        default: DEFAULT_MODELS[provider],
        models,
      };
    }

    return {
      providers: Object.values(AIProviderName).map((p) => ({
        provider: p,
        default: DEFAULT_MODELS[p],
        models: ALLOWED_MODELS[p],
      })),
    };
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
      const { password, prompt } = extractPasswordFromPrompt(q);

      let isAdmin = false;

      if (password && this.authService.validatePassword(password)) {
        unlockGlobalChatLimit();
        isAdmin = true;
      }

      if (!isAdmin) {
        const limit = Number(process.env.GLOBAL_CHAT_LIMIT ?? 5);
        checkGlobalChatLimit(limit);
      }

      const output = await this.chatService.generateResponse({
        provider: provider,
        model: model ?? DEFAULT_MODELS[provider],
        messages: [{ role: 'user', content: prompt }],
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

    if (err instanceof AIGlobalLimitError) {
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: err.message,
      });
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal error' });
  }
}
