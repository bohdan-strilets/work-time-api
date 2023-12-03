import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema.ts';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { RegistrationDto } from './dto/registration.dto';
import { ResponseType } from './types/response.type';
import { LoginDto } from './dto/login.dto';
import { AMOUNT_SALT } from 'src/utilities/constants';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private readonly tokensService: TokensService,
    private readonly sendgridService: SendgridService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<ResponseType<TokenDocument, UserDocument> | ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: registrationDto.email });

    if (user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'This email in use, try other.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const activationToken = v4();
    const password = bcrypt.hashSync(registrationDto.password, bcrypt.genSaltSync(AMOUNT_SALT));
    const avatarUrl =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1701604494/work-time/users/default/njeuufmfgvdsbqgoi2yn.jpg';

    const newUser = await this.UserModel.create({
      ...registrationDto,
      activationToken,
      avatarUrl,
      password,
    });

    const payload = this.tokensService.createPayload(newUser);
    const tokens = await this.tokensService.createTokens(payload);
     const email = this.sendgridService.confirmEmail(newUser.email, newUser.activationToken);
     await this.sendgridService.sendEmail(email);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      tokens,
      data: newUser,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<ResponseType<TokenDocument, UserDocument> | ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: loginDto.email });
    const checkPassword = bcrypt.compareSync(loginDto.password, user.password);

    if (!user || !checkPassword || !user.isActivated) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Email or password is wrong or email is not activated.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = this.tokensService.createPayload(user);
    const tokens = await this.tokensService.createTokens(payload);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      tokens,
      data: user,
    };
  }

  async logout(refreshToken: string): Promise<ResponseType | undefined> {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User is not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.tokensService.checkToken(refreshToken, 'refresh');
    const tokenFromDb = await this.tokensService.findTokenFromDb(userData._id);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User is not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.TokenModel.findByIdAndDelete(tokenFromDb._id);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
    };
  }
}
