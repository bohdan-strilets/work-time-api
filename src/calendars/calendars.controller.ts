import { Controller, Get, UseGuards, Req, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { ResponseType } from './types/response.type';
import { DayDocument } from './schemas/day.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { DayDto } from './dto/day.dto';

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

  @Post('create-day')
  async createDay(
    @Body() createDayDto: DayDto,
    @Req() req: AuthRequest,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.createDay(createDayDto, _id);
    return data;
  }

  @Patch('update-day/:dayId')
  async updateDay(
    @Body() updateDayDto: DayDto,
    @Param('dayId') dayId: string,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    const data = await this.calendarsService.updateDay(updateDayDto, dayId);
    return data;
  }

  @Delete('delete-day/:dayId')
  async deletePost(
    @Param('dayId') dayId: string,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    const data = await this.calendarsService.deleteDay(dayId);
    return data;
  }
}
