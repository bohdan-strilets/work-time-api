import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema.ts';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TokensService } from 'src/tokens/tokens.service';
import { ResponseType } from './types/response.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private readonly sendgridService: SendgridService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly tokenService: TokensService,
  ) {}

  async activationEmail(activationToken: string): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ activationToken });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Activation token is wrong.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.UserModel.findByIdAndUpdate(user._id, { activationToken: null, isActivated: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Email is successfully activated.',
    };
  }
}
