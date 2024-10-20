import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import for NestExpressApplication

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Cast the app to NestExpressApplication for static assets support
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.enableCors();

  // Serve static assets from the 'uploads' folder
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  logger.log('Application is starting...');

  await app.listen(3000);
  logger.log('Application is listening on port 3000');
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
});
