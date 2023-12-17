import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Day, DayDocument } from './schemas/day.schema';
import { ResponseType } from './types/response.type';
import { DayDto } from './dto/day.dto';
import { Statistics, StatisticsDocument } from 'src/statistics/schemas/statistics.schema';
import Status from './enums/status.enum';
import WorkShiftNumber from './enums/work-shift-number.enum';
import { StatisticsService } from 'src/statistics/statistics.service';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectModel(Day.name) private DayModel: Model<DayDocument>,
    @InjectModel(Statistics.name) private StatisticsModel: Model<StatisticsDocument>,
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
    const month = Number(date.slice(3, 5));
    const year = date.slice(6, date.length);
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const dto = createDayDto.data[date];

    if (dto.status === Status.work) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberWorkingDays': 1,
          'generalStatistics.totalDays': 1,
          'generalStatistics.numberWorkingHours': dto.numberHoursWorked,
          'generalStatistics.totalHours': dto.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingHours',
        defaultValue: dto.numberHoursWorked,
        value: dto.numberHoursWorked,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: dto.numberHoursWorked,
        value: dto.numberHoursWorked,
      });
    }
    if (dto.status === Status.work && dto.additionalHours) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberAdditionalWorkingDays': 1,
          'generalStatistics.numberAdditionalWorkingHours': dto.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingHours',
        defaultValue: dto.numberHoursWorked,
        value: dto.numberHoursWorked,
      });
    }
    if (dto.status === Status.dayOff) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberDaysOff': 1,
          'generalStatistics.numberFreeHours': 12,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberDaysOff',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFreeHours',
        defaultValue: 12,
        value: 12,
      });
    }
    if (dto.status === Status.vacation) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberVacationDays': 1,
          'generalStatistics.totalDays': 1,
          'generalStatistics.numberVacationHours': dto.numberHoursWorked,
          'generalStatistics.totalHours': dto.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationHours',
        defaultValue: dto.numberHoursWorked,
        value: dto.numberHoursWorked,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: dto.numberHoursWorked,
        value: dto.numberHoursWorked,
      });
    }
    if (dto.status === Status.sickLeave) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSickDays': 1,
          'generalStatistics.totalDays': 1,
          'generalStatistics.numberSickHours': dto.numberHoursWorked,
          'generalStatistics.totalHours': dto.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: 1,
        value: 1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickHours',
        defaultValue: 12,
        value: 12,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: 12,
        value: 12,
      });
    }
    if (dto.workShiftNumber === WorkShiftNumber.Shift1) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberFirstShifts': 1,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFirstShifts',
        defaultValue: 1,
        value: 1,
      });
    }
    if (dto.workShiftNumber === WorkShiftNumber.Shift2) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSecondShifts': 1,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSecondShifts',
        defaultValue: 1,
        value: 1,
      });
    }

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

    const updatedPost = await this.DayModel.findByIdAndUpdate(dayId, updateDayDto, { new: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedPost,
    };
  }

  async deleteDay(dayId: string): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
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

    await this.DayModel.findByIdAndDelete(dayId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Information about the selected day has been successfully deleted.',
    };
  }
}
