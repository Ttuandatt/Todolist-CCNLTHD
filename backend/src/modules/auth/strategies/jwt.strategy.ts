import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../shared/prisma/prisma.service'; // Import PrismaService để kiểm tra InvalidatedToken (Token Blacklist)
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined. Set JWT_SECRET in .env or environment.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    // ═══ TOKEN BLACKLIST CHECK ═══
    const token = req?.headers?.authorization?.replace('Bearer ', '');

    if (token) {
      const isInvalidated = await this.prisma.invalidatedToken.findUnique({
        where: { token },
      });
      if (isInvalidated) {
        throw new UnauthorizedException('Token is invalidated');
      }
    }

    return { id: payload.sub, email: payload.email };
  }
}
