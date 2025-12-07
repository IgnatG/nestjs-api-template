import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  helmet: {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  },
  rateLimit: {
    short: {
      ttl: parseInt(process.env.RATE_LIMIT_SHORT_TTL || '1000'),
      limit: parseInt(process.env.RATE_LIMIT_SHORT_LIMIT || '3'),
    },
    medium: {
      ttl: parseInt(process.env.RATE_LIMIT_MEDIUM_TTL || '10000'),
      limit: parseInt(process.env.RATE_LIMIT_MEDIUM_LIMIT || '20'),
    },
    long: {
      ttl: parseInt(process.env.RATE_LIMIT_LONG_TTL || '60000'),
      limit: parseInt(process.env.RATE_LIMIT_LONG_LIMIT || '100'),
    },
  },
}));
