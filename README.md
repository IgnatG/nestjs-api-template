# 🌐 Realtime Translator API

A high-performance, production-ready REST API built with [NestJS](https://nestjs.com/). This project provides a robust foundation with enterprise-grade features including security hardening, rate limiting, structured logging, and comprehensive API documentation.

## 🚀 Features

### Core Capabilities

- ⚡ **High Performance** - Optimized for low-latency responses with response compression
- 🔒 **Security First** - Helmet.js integration with API-focused security headers
- 📊 **Structured Logging** - Pino.js for high-performance JSON logging
- 📖 **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- 🎯 **API Versioning** - URI-based versioning (`/v1`, `/v2`, etc.)
- ✅ **Request Validation** - Class-validator powered DTO validation
- 🛡️ **Rate Limiting** - Multi-tier throttling protection (short/medium/long)

### Developer Experience

- 🐳 **Docker Ready** - Containerized with optimized multi-stage builds
- 🔄 **Hot Reload** - Fast development iteration with watch mode
- 📝 **Conventional Commits** - Enforced via Commitlint
- 🎨 **Code Quality** - ESLint, Prettier, and CSpell integration
- 🧪 **Testing Ready** - Jest configuration for unit and e2e tests
- 📦 **Path Aliases** - Clean imports with `@app/*` aliases

### Production Features

- 🔄 **Graceful Shutdown** - Proper container lifecycle management
- 📈 **Auto Versioning** - Semantic versioning based on commits
- 🔧 **Environment Config** - Flexible configuration via environment variables
- 🚦 **HSTS Support** - Strict Transport Security in production

## 📋 Prerequisites

- Node.js >= 24
- npm or yarn
- Docker & Docker Compose (optional)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd realtime-translator-api

# Install dependencies
npm install

# Copy environment variables
cp .env.sample .env
```

## ⚙️ Configuration

Configure the application via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `nestjs-api` |
| `APP_ENV` | Environment (`development`, `production`) | `development` |
| `HTTP_PORT` | Server port | `3003` |
| `HTTP_VERSION` | API version number | `1` |
| `HTTP_VERSIONING_ENABLE` | Enable API versioning | `false` |

## 🚀 Running the Application

### Development Mode

```bash
# Start with hot-reload
npm run start:dev

# Start with debug mode
npm run start:debug
```

### Using Docker

```bash
# Build and run with Docker Compose
docker compose up --build

# Run in detached mode
docker compose up -d --build
```

### Production

```bash
# Build the application
npm run build:prod

# Start production server
npm run start:prod
```

## 📖 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3003/docs
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📁 Project Structure

```
src/
├── config/           # Configuration modules
│   ├── app.config.ts # Application settings
│   └── doc.config.ts # Swagger documentation config
├── helpers/          # Utility functions and interceptors
├── main.module.ts    # Root application module
├── main.ts           # Application entry point
└── swagger.ts        # Swagger setup
```

## 🔒 Security Features

This API implements several security best practices:

- **Helmet.js** - Sets various HTTP headers for security
- **HSTS** - Enforces HTTPS in production (1-year max-age)
- **Rate Limiting** - Three-tier protection:
  - Short: 3 requests/second
  - Medium: 20 requests/10 seconds
  - Long: 100 requests/minute
- **Input Validation** - Whitelist-based DTO validation
- **No MIME Sniffing** - Prevents content-type attacks

## 📝 Logging

The application uses [Pino](https://github.com/pinojs/pino) for high-performance structured logging:

```typescript
// In your service
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(YourService.name);

// Log messages
this.logger.log('Operation completed', 'context');
this.logger.error('Something went wrong', error.stack);
```

## 🔄 Generating Resources

Use the NestJS CLI to scaffold new resources:

```bash
# Generate a complete CRUD resource
nest g resource modules/your-resource

# Generate individual components
nest g controller modules/your-resource
nest g service modules/your-resource
nest g module modules/your-resource
```

## 📌 Conventional Commits

This project enforces [Conventional Commits](https://www.conventionalcommits.org/). Common prefixes:

| Prefix | Description | Version Bump |
|--------|-------------|--------------|
| `feat:` | New feature | Minor |
| `fix:` | Bug fix | Patch |
| `docs:` | Documentation only | - |
| `refactor:` | Code refactoring | - |
| `test:` | Adding tests | - |
| `chore:` | Maintenance | - |
| `feat!:` / `fix!:` | Breaking change | Major |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
