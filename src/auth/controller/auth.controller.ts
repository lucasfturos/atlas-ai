import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { unlockGlobalChatLimit } from 'src/ai/limits/global-chat-limits';
import { AuthService } from 'src/auth/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  getToken(@Body('password') password: string) {
    if (!this.authService.validatePassword(password)) {
      throw new UnauthorizedException('Invalid password');
    }

    unlockGlobalChatLimit();

    return {
      token: this.authService.generateToken(),
    };
  }
}
