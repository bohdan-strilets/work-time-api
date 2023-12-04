import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
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
  async getAllDaysInfo(@Req() req: AuthRequest): Promise<ResponseType<DayDocument[]> | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.getAllDaysInfo(_id);
    return data;
  }

  @Get('one-day/:dayId')
  async getOneDayInfo(
    @Param('dayId') dayId: string,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    const data = await this.calendarsService.getOneDayInfo(dayId);
    return data;
  }
}
