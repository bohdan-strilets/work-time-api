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
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { Token } from 'src/tokens/schemas/token.schema.ts';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ResponseType } from './types/response.type';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { REFRESH_TOKEN } from 'src/utilities/constants';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { UserFromGoogle } from './types/user-from-google.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Token, UserDocument> | ResponseType | undefined> {
    const data = await this.authService.registration(registrationDto);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Token, UserDocument> | ResponseType | undefined> {
    const data = await this.authService.login(loginDto);
    res.cookie(REFRESH_TOKEN, data.tokens.refreshToken);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    const data = await this.authService.logout(refreshToken);
    res.clearCookie(REFRESH_TOKEN);
    return data;
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {
    return;
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleAuthRedirect(
    @Req() req: AuthRequest<UserFromGoogle>,
  ): Promise<ResponseType<Token, UserDocument> | ResponseType | undefined> {
    return await this.authService.googleLogin(req.user);
  }
}
