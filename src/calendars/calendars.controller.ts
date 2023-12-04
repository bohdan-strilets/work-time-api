import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { ResponseType } from './types/response.type';
import { DayDocument } from './schemas/day.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';

@UseGuards(JwtAuthGuard)
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('all-days')
  async getAllPosts(@Req() req: AuthRequest): Promise<ResponseType<DayDocument[]> | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.getAllDaysInfo(_id);
    return data;
  }
}
