import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CALLBACK_URL } from 'src/utilities/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;
    const email = emails[0].value;
    const userFromDB = await this.UserModel.findOne({ email });
    const user = {
      email,
      firstName: name.givenName,
      lastName: name.familyName,
      isActivated: true,
      avatarUrl: photos[0].value,
    };

    if (!userFromDB) {
      await this.UserModel.create({ ...user });
      return done(null, user);
    }

    done(null, user);
  }
}
