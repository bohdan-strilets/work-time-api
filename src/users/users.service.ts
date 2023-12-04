import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Token, TokenDocument } from 'src/tokens/schemas/token.schema.ts';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TokensService } from 'src/tokens/tokens.service';
import { ResponseType } from './types/response.type';
import { EmailDto } from './dto/email.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  async repeatActivationEmail(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const activationToken = v4();
    const mail = this.sendgridService.confirmEmail(user.email, activationToken);
    await this.sendgridService.sendEmail(mail);
    await this.UserModel.findByIdAndUpdate(user._id, { isActivated: false, activationToken });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The confirmation email has been sent again.',
    };
  }

  async getCurrentUser(
    userId: Types.ObjectId,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.UserModel.findById(userId);

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: user,
    };
  }

  async changeProfile(
    userId: Types.ObjectId,
    changeProfileDto: ChangeProfileDto,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedUser = await this.UserModel.findByIdAndUpdate(userId, changeProfileDto, {
      new: true,
    });

    if (!updatedUser) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedUser,
    };
  }

  async changeEmail(userId: Types.ObjectId, emailDto: EmailDto): Promise<ResponseType | undefined> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const activationToken = v4();
    const email = this.sendgridService.confirmEmail(emailDto.email, activationToken);
    await this.sendgridService.sendEmail(email);

    await this.UserModel.findByIdAndUpdate(
      userId,
      {
        email: emailDto.email,
        activationToken,
        isActivated: false,
      },
      { new: true },
    );

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The email address has been successfully changed, now you need to re-verify it.',
    };
  }

  async requestResetPassword(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const email = this.sendgridService.resetPassword(user.email, user.firstName);
    await this.sendgridService.sendEmail(email);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'An email with a link to reset your password has been sent to your email address.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseType | undefined> {
    const password = bcrypt.hashSync(resetPasswordDto.password, bcrypt.genSaltSync(10));
    const user = await this.UserModel.findOne({ email: resetPasswordDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.UserModel.findByIdAndUpdate(user._id, { password });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'The password has been successfully changed.',
    };
  }
}
