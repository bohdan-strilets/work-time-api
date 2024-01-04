import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CalendarsModule } from './calendars/calendars.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    MulterModule.register({ storage: diskStorage({ destination: '/tmp/uploads' }) }),
    TokensModule,
    UsersModule,
    AuthModule,
    SendgridModule,
    CloudinaryModule,
    CalendarsModule,
    StatisticsModule,
  ],
})
export class AppModule {}
