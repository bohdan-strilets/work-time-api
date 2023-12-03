import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SendgridModule } from './sendgrid/sendgrid.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    TokensModule,
    UsersModule,
    AuthModule,
    SendgridModule,
  ],
})
export class AppModule {}
