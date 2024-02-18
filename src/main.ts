import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CLIENT_URL_DEV, CLIENT_URL_PROD, API_URL } from './utilities/constants';

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
    .addTag('todos', 'Method for getting each users to-do list.')
    .addTag('weather', 'Method for obtaining weather forecast.')
    .addServer(`${API_URL}api/v1/`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: [CLIENT_URL_DEV, CLIENT_URL_PROD] });
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
