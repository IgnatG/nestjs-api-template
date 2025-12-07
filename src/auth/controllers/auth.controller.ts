import { Public } from '@app/auth/decorators/public.decorator';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

// Allowed users who can generate tokens
const ALLOWED_USERS = ['local-admin', 'test-user'];

@ApiTags('Authentication')
@Controller('auth')
export class AuthTestController {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('token')
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // Max 3 requests per minute
  @ApiOperation({ summary: 'Generate a test JWT token' })
  @ApiResponse({ status: 201, description: 'Token generated successfully' })
  @ApiResponse({ status: 401, description: 'User not authorized to generate tokens' })
  generateToken(@Body() payload: { userId: string; email?: string; role?: string }) {
    const userId = payload?.userId?.trim();

    // Validate that only allowed users can generate tokens
    if (!userId || !ALLOWED_USERS.includes(userId)) {
      throw new UnauthorizedException('Access denied: user not authorized to generate tokens');
    }

    const now = Math.floor(Date.now() / 1000);
    const token = this.jwtService.sign(
      {
        sub: userId,
        email: payload?.email?.trim() || 'local-test@example.com',
        role: payload?.role?.trim() || 'user',
        iat: now,
      },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn') as any,
        algorithm: 'HS256',
      },
    );

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
      issuedAt: new Date(now * 1000).toISOString(),
      usage: 'Add this token to Authorization header as: Bearer <token>',
    };
  }
}
