import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
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
    const month = this.statisticksService.getMonth(date);
    const year = this.statisticksService.getYear(date);
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

    // const oldInformationAboutDay = await this.DayModel.findById(dayId);
    const updatedPost = await this.DayModel.findByIdAndUpdate(dayId, updateDayDto, { new: true });
    // const date = Object.keys(updateDayDto.data)[0];
    // const month = this.statisticksService.getMonth(date);
    // const year = this.statisticksService.getYear(date);
    // const statistics = await this.StatisticsModel.findOne({ owner: updatedPost.owner });
    // const dto = updateDayDto.data[date];
    // const oldDto = oldInformationAboutDay.data.get(date);

    // if (oldDto.status !== dto.status) {
    //   if (oldDto.status === Status.work) {
    //     await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
    //       $inc: {
    //         'generalStatistics.numberWorkingDays': -1,
    //         'generalStatistics.totalDays': -1,
    //         'generalStatistics.numberWorkingHours': -oldDto.numberHoursWorked,
    //         'generalStatistics.totalHours': -oldDto.numberHoursWorked,
    //       },
    //     });
    //   }
    // }

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
    const statistics = await this.StatisticsModel.findOne({ owner: userId });

    if (dayInformation.status === Status.work) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberWorkingDays': -1,
          'generalStatistics.totalDays': -1,
          'generalStatistics.numberWorkingHours': -dayInformation.numberHoursWorked,
          'generalStatistics.totalHours': -dayInformation.numberHoursWorked,
        },
      });

      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingHours',
        defaultValue: -dayInformation.numberHoursWorked,
        value: -dayInformation.numberHoursWorked,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: -dayInformation.numberHoursWorked,
        value: -dayInformation.numberHoursWorked,
      });
    }
    if (dayInformation.status === Status.work && dayInformation.additionalHours) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberAdditionalWorkingDays': -1,
          'generalStatistics.numberAdditionalWorkingHours': -dayInformation.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingHours',
        defaultValue: -dayInformation.numberHoursWorked,
        value: -dayInformation.numberHoursWorked,
      });
    }
    if (dayInformation.status === Status.dayOff) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberDaysOff': -1,
          'generalStatistics.numberFreeHours': -12,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberDaysOff',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFreeHours',
        defaultValue: -12,
        value: -12,
      });
    }
    if (dayInformation.status === Status.vacation) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberVacationDays': -1,
          'generalStatistics.totalDays': -1,
          'generalStatistics.numberVacationHours': -dayInformation.numberHoursWorked,
          'generalStatistics.totalHours': -dayInformation.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationHours',
        defaultValue: -dayInformation.numberHoursWorked,
        value: -dayInformation.numberHoursWorked,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: -dayInformation.numberHoursWorked,
        value: -dayInformation.numberHoursWorked,
      });
    }
    if (dayInformation.status === Status.sickLeave) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSickDays': -1,
          'generalStatistics.totalDays': -1,
          'generalStatistics.numberSickHours': -dayInformation.numberHoursWorked,
          'generalStatistics.totalHours': -dayInformation.numberHoursWorked,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: -1,
        value: -1,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickHours',
        defaultValue: -12,
        value: -12,
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: -12,
        value: -12,
      });
    }
    if (dayInformation.workShiftNumber === WorkShiftNumber.Shift1) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberFirstShifts': -1,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFirstShifts',
        defaultValue: -1,
        value: -1,
      });
    }
    if (dayInformation.workShiftNumber === WorkShiftNumber.Shift2) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSecondShifts': -1,
        },
      });
      await this.statisticksService.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSecondShifts',
        defaultValue: -1,
        value: -1,
      });
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Information about the selected day has been successfully deleted.',
    };
  }
}
