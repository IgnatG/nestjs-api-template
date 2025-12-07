import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      algorithms: ['HS256'], // Specify allowed algorithms
    });
  }

  validate(payload: JwtPayload): any {
    // Enhanced validation
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token: missing subject');
    }

    if (!payload.iat) {
      throw new UnauthorizedException('Invalid token: missing issued at time');
    }

    if (!payload.exp) {
      throw new UnauthorizedException('Invalid token: missing expiration time');
    }

    // Check if token is expired (additional safety check)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      throw new UnauthorizedException('Token has expired');
    }

    // Restrict access to allowed users only
    const allowedUsers = ['local-admin', 'test-user'];
    if (!allowedUsers.includes(payload.sub)) {
      throw new UnauthorizedException('Access denied: user not authorized');
    }

    // Return sanitized user payload
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role || 'user',
      iat: payload.iat,
    };
  }
}
