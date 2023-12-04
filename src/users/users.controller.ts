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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseType } from './types/response.type';
import { CLIENT_URL } from 'src/utilities/constants';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { AuthRequest } from './types/auth-request.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('activation-email/:activationToken')
  @Redirect(CLIENT_URL)
  async activationEmail(
    @Param('activationToken') activationToken: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.activationEmail(activationToken);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('repeat-activation-email')
  async repeatActivationEmail(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.repeatActivationEmail(emailDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getCurrentUser(
    @Req() req: AuthRequest,
  ): Promise<ResponseType<UserDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.usersService.getCurrentUser(_id);
    return data;
  }
}
