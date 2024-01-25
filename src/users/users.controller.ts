import {
  Controller,
  Get,
  Redirect,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Put,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseType } from './types/response.type';
import { API_URL, CLIENT_URL_PROD } from 'src/utilities/constants';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { AuthRequest } from './types/auth-request.type';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { imageValidator } from './pipes/image-validator.pipe';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TokensType } from 'src/tokens/types/tokens.type';
import { REFRESH_TOKEN } from 'src/utilities/constants';
import { PayloadType } from 'src/tokens/types/payload.type';
import { ChangeSettingsDto } from './dto/change-settings.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('activation-email/:activationToken')
  @Redirect(CLIENT_URL_PROD)
  @ApiOperation({
    summary: 'Activate user account',
    description: 'Endpoint to activate a user account using the provided activation token.',
    externalDocs: {
      url: `${API_URL}api/v1/users/activation-email/{activationToken}`,
      description: 'Link to detailed documentation for user account activation.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The confirmation email has been sent again.',
  })
  @ApiResponse({
    status: 404,
    description: 'Activation token is wrong.',
  })
  async activationEmail(
    @Param('activationToken') activationToken: string,
  ): Promise<UserResponseType | undefined> {
    const data = await this.usersService.activationEmail(activationToken);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend activation email',
    description: 'Endpoint to resend the activation email for a user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/repeat-activation-email`,
      description: 'Link to detailed documentation for resending activation emails.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The confirmation email has been sent again.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Post('repeat-activation-email')
  async repeatActivationEmail(@Body() emailDto: EmailDto): Promise<UserResponseType | undefined> {
    const data = await this.usersService.repeatActivationEmail(emailDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current user information',
    description: 'Endpoint to retrieve information about the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/current-user`,
      description: 'Link to detailed documentation for retrieving current user information.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Get current user information',
    type: UserResponseType<UserDocument>,
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiBearerAuth()
  @Get('current-user')
  async getCurrentUser(
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType<UserDocument> | UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.getCurrentUser(_id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change user profile information',
    description: 'Endpoint to change profile information for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/change-profile`,
      description: 'Link to detailed documentation for changing user profile information.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The profile information has been successfully update.',
    type: UserResponseType<UserDocument>,
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiBearerAuth()
  @Put('change-profile')
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType<UserDocument> | UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeProfile(_id, changeProfileDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change user email',
    description: 'Endpoint to change the email address for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/change-email`,
      description: 'Link to detailed documentation for changing user email.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The email address has been successfully changed, now you need to re-verify it.',
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiBearerAuth()
  @Patch('change-email')
  async changeEmail(
    @Body() emailDto: EmailDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeEmail(_id, emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Endpoint to request a password reset for the user with the provided email address.',
    externalDocs: {
      url: `${API_URL}api/v1/users/request-reset-password`,
      description: 'Link to detailed documentation for requesting a password reset.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'An email with a link to reset your password has been sent to your email address.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Post('request-reset-password')
  async requestResetPassword(@Body() emailDto: EmailDto): Promise<UserResponseType | undefined> {
    const data = await this.usersService.requestResetPassword(emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Endpoint to reset the password for the user with the provided reset token.',
    externalDocs: {
      url: `${API_URL}api/v1/users/reset-password`,
      description: 'Link to detailed documentation for resetting user passwords.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The password has been successfully changed.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<UserResponseType | undefined> {
    const data = await this.usersService.resetPassword(resetPasswordDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('upload-avatar')
  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'Endpoint to upload a new avatar for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/upload-avatar`,
      description: 'Link to detailed documentation for uploading user avatars.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Upload user avatar',
    type: UserResponseType<UserDocument>,
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar', { dest: '/tmp/uploads' }))
  async uploadAvatar(
    @UploadedFile(imageValidator)
    file: Express.Multer.File,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType<UserDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.uploadAvatar(file, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Endpoint to change the password for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/change-password`,
      description: 'Link to detailed documentation for changing user passwords.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiBearerAuth()
  async chnangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.chnangePassword(changePasswordDto, _id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-profile')
  @ApiOperation({
    summary: 'Delete user profile',
    description: 'Endpoint to delete the profile for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/delete-profile`,
      description: 'Link to detailed documentation for deleting user profiles.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Your account and all your data has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiBearerAuth()
  async deleteProfile(@Req() req: AuthRequest<PayloadType>): Promise<UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.deleteProfile(_id);
    return data;
  }

  @Get('refresh-user')
  @ApiOperation({
    summary: 'Refresh user tokens',
    description: 'Endpoint to refresh the authentication tokens for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/refresh-user`,
      description: 'Link to detailed documentation for refreshing user tokens.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a valid token pair.',
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  async refreshUser(
    @Req() req: AuthRequest<PayloadType>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseType<TokensType> | undefined> {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    const data = await this.usersService.refreshUser(refreshToken);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Method for getting a list of all users.',
    description: 'Endpoint for getting a list of all registered users.',
    externalDocs: {
      url: `${API_URL}api/v1/users/get-all-users`,
      description: 'Link to get a list of all users.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a users list.',
  })
  @ApiBearerAuth()
  @Get('get-all-users')
  async getAllUsers(): Promise<UserResponseType<UserDocument[]> | undefined> {
    const data = await this.usersService.getAllUsers();
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change user calculation settings.',
    description: 'Endpoint to change calculation settings for the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/users/change-settings`,
      description: 'Link to detailed documentation for changing user calculation settings.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The calculation settings has been successfully update.',
    type: UserResponseType<UserDocument>,
  })
  @ApiResponse({
    status: 401,
    description: 'User not unauthorized.',
  })
  @ApiBearerAuth()
  @Put('change-settings')
  async changeSettings(
    @Body() changeSettingsDto: ChangeSettingsDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<UserResponseType<UserDocument> | UserResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.changeSettings(changeSettingsDto, _id);
    return data;
  }
}
