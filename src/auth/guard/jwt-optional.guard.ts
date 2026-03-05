import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import type { Request } from 'express';

type AdminRequest = Request & {
  isAdmin?: boolean;
};

@Injectable()
export class JwtOptionalGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AdminRequest>();

    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string') {
      req.isAdmin = false;
      return true;
    }

    if (!authHeader.startsWith('Bearer ')) {
      req.isAdmin = false;
      return true;
    }

    const token = authHeader.slice(7);
    console.log('AUTH HEADER:', authHeader);
    req.isAdmin = this.authService.verifyToken(token);
    console.log('ADMIN:', req.isAdmin);

    return true;
  }
}
