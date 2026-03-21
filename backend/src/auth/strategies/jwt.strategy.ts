import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service'; // Import PrismaService để kiểm tra InvalidatedToken (Token Blacklist)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
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
