import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { API_URL } from './utilities/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: API_URL });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
