import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { User, UserSchema } from './schemas/user.schema';
import { Token, TokenSchema } from 'src/tokens/schemas/token.schema.ts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    SendgridModule,
    CloudinaryModule,
    TokensModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
