import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';
import { Token, TokenSchema } from './schemas/token.schema.ts';

const jwtConfig = {
  secret: process.env.ACCESS_TOKEN_KEY,
  signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME },
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register(jwtConfig),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
