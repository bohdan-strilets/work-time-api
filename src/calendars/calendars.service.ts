import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Day, DayDocument } from './schemas/day.schema';
import { ResponseType } from './types/response.type';
import { DayDto } from './dto/day.dto';
import { StatisticsService } from 'src/statistics/statistics.service';
import TypeOperation from 'src/statistics/enums/type-operation.enum';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectModel(Day.name) private DayModel: Model<DayDocument>,
    private readonly statisticksService: StatisticsService,
  ) {}

  async getAllDaysInfo(userId: Types.ObjectId): Promise<ResponseType<DayDocument[]> | undefined> {
    const days = await this.DayModel.find({ owner: userId });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: days,
    };
  }

  async getOneDayInfo(dayId: string): Promise<ResponseType<DayDocument> | undefined> {
    const day = await this.DayModel.findOne({ _id: dayId });

    if (!day) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Day with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: day,
    };
  }

  async createDay(
    createDayDto: DayDto,
    userId: Types.ObjectId,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    if (!createDayDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = { ...createDayDto, owner: userId };
    const newDay = await this.DayModel.create(data);
    const date = Object.keys(createDayDto.data)[0];
    const month = this.statisticksService.getMonth(date);
    const year = this.statisticksService.getYear(date);
    const dto = createDayDto.data[date];

    await this.statisticksService.changeStatisticsForDaysAndHours({
      dataByClient: dto,
      month,
      year,
      userId,
      type: TypeOperation.Increment,
    });

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      data: newDay,
    };
  }

  async updateDay(
    updateDayDto: DayDto,
    dayId: string,
    userId: Types.ObjectId,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    if (!updateDayDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldInformationAboutDay = await this.DayModel.findById(dayId);
    const updatedPost = await this.DayModel.findByIdAndUpdate(dayId, updateDayDto, { new: true });
    const date = Object.keys(updateDayDto.data)[0];
    const month = this.statisticksService.getMonth(date);
    const year = this.statisticksService.getYear(date);
    const dto = updateDayDto.data[date];
    const oldDto = { ...oldInformationAboutDay.data.get(date), grossEarnings: 0, netEarnings: 0 };

    if (
      oldDto.status !== dto.status ||
      oldDto.workShiftNumber !== dto.workShiftNumber ||
      oldDto.additionalHours !== dto.additionalHours
    ) {
      await this.statisticksService.changeStatisticsForDaysAndHours({
        dataByClient: oldDto,
        month,
        year,
        userId,
        type: TypeOperation.Decrement,
      });
      await this.statisticksService.changeStatisticsForDaysAndHours({
        dataByClient: dto,
        month,
        year,
        userId,
        type: TypeOperation.Increment,
      });
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedPost,
    };
  }

  async deleteDay(
    dayId: string,
    userId: Types.ObjectId,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    if (!dayId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Day with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedDay: any = await this.DayModel.findByIdAndDelete(dayId);
    const date = [...deletedDay.data.keys()][0];
    const dayInformation = deletedDay.data.get(date);
    const month = this.statisticksService.getMonth(date);
    const year = this.statisticksService.getYear(date);

    await this.statisticksService.changeStatisticsForDaysAndHours({
      dataByClient: dayInformation,
      month,
      year,
      userId,
      type: TypeOperation.Decrement,
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Information about the selected day has been successfully deleted.',
    };
  }
}
