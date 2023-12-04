import { Controller, Get, Redirect, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseType } from './types/response.type';
import { CLIENT_URL } from 'src/utilities/constants';

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
}
