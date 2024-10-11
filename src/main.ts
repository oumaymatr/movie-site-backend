import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  logger.log('Application is starting...');

  await app.listen(3000);
  logger.log('Application is listening on port 3000');
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
});
