import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';
import Status from 'src/calendars/enums/status.enum';
import WorkShiftNumber from 'src/calendars/enums/work-shift-number.enum';
import TypeOperation from './enums/type-operation.enum';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel(Statistics.name) private StatisticsModel: Model<StatisticsDocument>) {}

  async findAndUpdateStatisticksField(
    userId: Types.ObjectId,
    params: {
      month: number;
      year: string;
      fieldNameFromDb: string;
      defaultValue: number;
      value: number;
    },
  ) {
    const FIELD_NAME_DB = 'statisticsByMonths';
    const { month, year, fieldNameFromDb, defaultValue, value } = params;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const monthStats = statistics.statisticsByMonths;

    const current = monthStats[fieldNameFromDb].find(
      (item: { month: number; year: string; value: number }) =>
        item.month === month && item.year === year,
    );

    const updatedData = [...monthStats[fieldNameFromDb]];
    const index = updatedData.findIndex(item => item.month === month && item.year === year);

    if (index !== -1) {
      updatedData[index] = { ...current, value: current.value + value };
    } else {
      updatedData.push({ month, year, value: defaultValue });
    }

    const updateField = `${FIELD_NAME_DB}.${fieldNameFromDb}`;
    const updateObject = { [updateField]: updatedData };
    await this.StatisticsModel.findByIdAndUpdate(statistics._id, updateObject);
  }

  getMonth(date: string): number {
    const month = Number(date.slice(3, 5));
    return month;
  }

  getYear(date: string): string {
    const year = date.slice(6, date.length);
    return year;
  }

  async changeStatisticsForDaysAndHours(params: {
    dataByClient: any;
    month: number;
    year: string;
    userId: Types.ObjectId;
    type: TypeOperation;
  }) {
    const { dataByClient, month, year, userId, type } = params;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const checkTypeForNumberHoursWorked =
      type === TypeOperation.Increment
        ? dataByClient.numberHoursWorked
        : -dataByClient.numberHoursWorked;
    const checkTypeForValueWithOne = type === TypeOperation.Increment ? 1 : -1;
    const checkTypeForValueWithTwelve = type === TypeOperation.Increment ? 12 : -12;

    if (dataByClient.status === Status.work) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberWorkingDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberWorkingHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
        },
      });

      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
      });
    }
    if (dataByClient.status === Status.work && dataByClient.additionalHours) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberAdditionalWorkingDays': checkTypeForValueWithOne,
          'generalStatistics.numberAdditionalWorkingHours': checkTypeForNumberHoursWorked,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
      });
    }
    if (dataByClient.status === Status.dayOff) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberDaysOff': checkTypeForValueWithOne,
          'generalStatistics.numberFreeHours': checkTypeForValueWithTwelve,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberDaysOff',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFreeHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
      });
    }
    if (dataByClient.status === Status.vacation) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberVacationDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberVacationHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
      });
    }
    if (dataByClient.status === Status.sickLeave) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSickDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberSickHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
      });
    }
    if (dataByClient.workShiftNumber === WorkShiftNumber.Shift1) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberFirstShifts': checkTypeForValueWithOne,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFirstShifts',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
    }
    if (dataByClient.workShiftNumber === WorkShiftNumber.Shift2) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSecondShifts': checkTypeForValueWithOne,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSecondShifts',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
      });
    }
  }
}
