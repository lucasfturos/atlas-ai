import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfigError } from '../errors/auth.error';

type AdminPayload = {
  admin: true;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validatePassword(password: string): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new AuthConfigError('ADMIN_PASSWORD');
    }

    return password === adminPassword;
  }

  generateToken(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AuthConfigError('JWT_SECRET');
    }

    const payload: AdminPayload = { admin: true };

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '12h',
    });
  }

  verifyToken(token: string): boolean {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AuthConfigError('JWT_SECRET');
    }

    try {
      const payload = this.jwtService.verify<AdminPayload>(token, {
        secret,
      });

      return payload.admin === true;
    } catch {
      return false;
    }
  }
}
