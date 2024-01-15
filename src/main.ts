import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CLIENT_URL, API_URL } from './utilities/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Worktime API')
    .setDescription('API for managing user registration, calendars, and statistics on WORKTIME.')
    .setVersion('1.0.5')
    .addTag('auth', 'Methods for user authentication')
    .addTag('users', 'Methods for user profile management')
    .addTag('calendars', 'Methods for managing user calendars')
    .addTag('statistics', 'Methods for retrieving user statistics')
    .addServer(`${API_URL}api/v1/`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: CLIENT_URL });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
