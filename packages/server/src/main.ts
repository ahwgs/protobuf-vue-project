import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const logger = new Logger('NestApplication');
    logger.log(`Server running on ${url}`);
  });
}
bootstrap();
