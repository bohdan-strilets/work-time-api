import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { Token } from 'src/tokens/schemas/token.schema.ts';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AuthResponseType } from './types/response.type';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { API_URL, REFRESH_TOKEN } from 'src/utilities/constants';
import { TokenDocument } from 'src/tokens/schemas/token.schema.ts';
import { ErrorResponseType } from 'src/common/types/error-response.type';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user',
    externalDocs: {
      url: `${API_URL}api/v1/auth/registration`,
      description: 'Link to user registration endpoint',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successful registration',
    type: AuthResponseType<Token, UserDocument>,
  })
  @ApiResponse({
    status: 409,
    description: 'Bad email or password.',
    type: ErrorResponseType,
  })
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseType<Token, UserDocument> | AuthResponseType | undefined> {
    const data = await this.authService.registration(registrationDto);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken, { sameSite: 'none', secure: true });
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Endpoint for user login',
    externalDocs: {
      url: `${API_URL}api/v1/auth/login`,
      description: 'Link to user login endpoint',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponseType<Token, UserDocument>,
  })
  @ApiResponse({
    status: 401,
    description: 'Email is wrong!',
    type: ErrorResponseType,
  })
  @ApiResponse({
    status: 401,
    description: 'Password is wrong!',
    type: ErrorResponseType,
  })
  @ApiResponse({
    status: 401,
    description: 'Email is not activated.',
    type: ErrorResponseType,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseType<Token, UserDocument> | AuthResponseType | undefined> {
    const data = await this.authService.login(loginDto);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken, { sameSite: 'none', secure: true });
    return data;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Endpoint for user logout',
    externalDocs: {
      url: `${API_URL}api/v1/auth/logout`,
      description: 'Link to user logout endpoint',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
    type: AuthResponseType,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not unauthorized.',
    type: ErrorResponseType,
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseType | undefined> {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    const data = await this.authService.logout(refreshToken);
    res.clearCookie(REFRESH_TOKEN, { sameSite: 'none', secure: true });
    return data;
  }

  @Post('google-auth')
  @ApiOperation({
    summary: 'Google Authentication',
    description: 'Endpoint to authenticate with Google using a provided token.',
    externalDocs: {
      url: `${API_URL}api/v1/auth/google-auth`,
      description: 'Link to Google Authentication endpoint',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successful logout',
    type: AuthResponseType,
  })
  async googleAuth2(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseType<TokenDocument, UserDocument> | AuthResponseType | undefined> {
    const data = await this.authService.googleAuth(token);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken, { sameSite: 'none', secure: true });
    return data;
  }
}
