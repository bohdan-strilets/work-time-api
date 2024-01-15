import { Controller, Get, UseGuards, Req, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CalendarsService } from './calendars.service';
import { CalendarResponseType } from './types/response.type';
import { DayDocument } from './schemas/day.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { DayDto } from './dto/day.dto';
import { PayloadType } from 'src/tokens/types/payload.type';
import { API_URL } from 'src/utilities/constants';
import { ErrorResponseType } from 'src/common/types/error-response.type';

@UseGuards(JwtAuthGuard)
@Controller('calendars')
@ApiTags('calendars')
@ApiBearerAuth()
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @Get('all-days')
  @ApiOperation({
    summary: 'Get information for all days',
    description:
      'Endpoint to retrieve information for all days associated with the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/calendars/all-days`,
      description: 'Link to detailed documentation for retrieving all days information.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of day information',
    type: CalendarResponseType<DayDocument[]>,
  })
  async getAllDaysInfo(
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<CalendarResponseType<DayDocument[]> | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.getAllDaysInfo(_id);
    return data;
  }

  @Get('one-day/:dayId')
  @ApiOperation({
    summary: 'Get information for one specific day',
    description:
      'Endpoint to retrieve information for a specific day associated with the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/calendars/one-day/{dayId}`,
      description: 'Link to detailed documentation for retrieving information for a specific day.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of day information',
    type: CalendarResponseType<DayDocument>,
  })
  @ApiResponse({
    status: 404,
    description: 'Day with current ID not found.',
    type: ErrorResponseType,
  })
  async getOneDayInfo(
    @Param('dayId') dayId: string,
  ): Promise<CalendarResponseType<DayDocument> | CalendarResponseType | undefined> {
    const data = await this.calendarsService.getOneDayInfo(dayId);
    return data;
  }

  @ApiOperation({
    summary: 'Create a new day',
    description: 'Endpoint to create a new day associated with the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/calendars/create-day`,
      description: 'Link to detailed documentation for creating a new day.',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new day',
    type: CalendarResponseType<DayDocument>,
  })
  @ApiResponse({
    status: 400,
    description: 'Check correct entered data.',
    type: ErrorResponseType,
  })
  @Post('create-day')
  async createDay(
    @Body() createDayDto: DayDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<CalendarResponseType<DayDocument> | CalendarResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.createDay(createDayDto, _id);
    return data;
  }

  @ApiOperation({
    summary: 'Update an existing day',
    description: 'Endpoint to update an existing day associated with the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/calendars/update-day/{dayId}`,
      description: 'Link to detailed documentation for updating an existing day.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the day',
    type: CalendarResponseType<DayDocument>,
  })
  @ApiResponse({
    status: 400,
    description: 'Check correct entered data.',
    type: ErrorResponseType,
  })
  @Patch('update-day/:dayId')
  async updateDay(
    @Body() updateDayDto: DayDto,
    @Param('dayId') dayId: string,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<CalendarResponseType<DayDocument> | CalendarResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.updateDay(updateDayDto, dayId, _id);
    return data;
  }

  @ApiOperation({
    summary: 'Delete an existing day',
    description: 'Endpoint to delete an existing day associated with the authenticated user.',
    externalDocs: {
      url: `${API_URL}api/v1/calendars/delete-day/{dayId}`,
      description: 'Link to detailed documentation for deleting an existing day.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the day',
  })
  @ApiResponse({
    status: 404,
    description: 'Day with current ID not found.',
  })
  @Delete('delete-day/:dayId')
  async deletePost(
    @Param('dayId') dayId: string,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<CalendarResponseType<DayDocument> | CalendarResponseType | undefined> {
    const { _id } = req.user;
    const data = await this.calendarsService.deleteDay(dayId, _id);
    return data;
  }
}
