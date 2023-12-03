import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from 'src/tokens/dto/create-token.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: CreateTokenDto) {
    return {
      _id: payload._id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isActivated: payload.isActivated,
    };
  }
}
