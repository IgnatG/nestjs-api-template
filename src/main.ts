import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { TransformInterceptor } from '@app/helpers';
import { MainModule } from '@app/main.module';
import { SwaggerDocs } from '@app/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

const main = async () => {
  const app: NestApplication = await NestFactory.create(MainModule, { bufferLogs: true });
  const configService = app.get<ConfigService>(ConfigService);

  const env: string = configService.get<string>('app.env');
  process.env.NODE_ENV = env;

  const port = configService.get<number>('app.port');
  const globalPrefix: string = configService.get<string>('app.globalPrefix');
  const version: string = configService.get<string>('app.versioning.version');
  const versioningPrefix: string = configService.get<string>('app.versioning.prefix');

  // Security headers (API-focused configuration)
  const isProduction = env === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable browser-specific protections - not needed for API
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: false,
      ieNoOpen: false,
      dnsPrefetchControl: false,
      // API-relevant security headers
      noSniff: true, // Prevent MIME type sniffing on JSON responses
      hidePoweredBy: true, // Hide X-Powered-By header
      hsts: isProduction
        ? {
            maxAge: 31536000, // 1 year in seconds
            includeSubDomains: true,
            preload: true,
          }
        : false,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
    prefix: versioningPrefix,
  });

  // Enable CORS for both HTTP and WebSocket connections
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Set global API prefix for all routes
  // app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger docs
  SwaggerDocs(app);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(app.get(Logger));

  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false; // don't compress responses with this request header
        }

        // fallback to standard filter function
        return compression.filter(req, res);
      },
    }),
  );

  // Enable graceful shutdown hooks for proper container lifecycle
  app.enableShutdownHooks();

  const logger = new NestLogger();
  logger.log(`==========================================================`);
  logger.log(`Main app will serve on PORT ${port}`, 'MainApplication');
  logger.log(`==========================================================`);
  await app.listen(port);
};;

main();
