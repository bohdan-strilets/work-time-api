import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';
import Status from 'src/calendars/enums/status.enum';
import WorkShiftNumber from 'src/calendars/enums/work-shift-number.enum';
import TypeOperation from './enums/type-operation.enum';
import { DayInfoType } from 'src/calendars/types/day-info.type';

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
    const arr = date.split('-');
    const month = Number(arr[1]);
    return month;
  }

  getYear(date: string): string {
    const arr = date.split('-');
    const year = arr[arr.length - 1];
    return year;
  }

  calculateNightHours(time: string, numberHoursWorked: number): number {
    const [startStr, endStr] = time.split('-');
    const startTime = parseInt(startStr.split(':')[0], 10);
    const endTime = parseInt(endStr.split(':')[0], 10);
    const midnight = 24;
    const startNightTime = 22;

    if (startTime < startNightTime && numberHoursWorked < 4) {
      return 0;
    }
    if (endTime < midnight && startTime < midnight && numberHoursWorked < 4) {
      return midnight - startNightTime;
    }
    return midnight - startNightTime + endTime;
  }

  async changeStatisticsForDaysAndHours(params: {
    dataByClient: DayInfoType;
    month: number;
    year: string;
    userId: Types.ObjectId;
    type: TypeOperation;
  }) {
    const { dataByClient, month, year, userId, type } = params;
    const {
      grossEarnings,
      netEarnings,
      numberHoursWorked,
      status,
      workShiftNumber,
      additionalHours,
      time,
    } = dataByClient;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const checkTypeForNumberHoursWorked =
      type === TypeOperation.Increment ? numberHoursWorked : -numberHoursWorked;
    const checkTypeForValueWithOne = type === TypeOperation.Increment ? 1 : -1;
    const checkTypeForValueWithTwelve = type === TypeOperation.Increment ? 12 : -12;
    const checkTypeForValueGross =
      type === TypeOperation.Increment ? grossEarnings : -grossEarnings;
    const checkTypeForValueNet = type === TypeOperation.Increment ? netEarnings : -netEarnings;
    const totalTax = grossEarnings - netEarnings;
    const checkTypeForTax = type === TypeOperation.Increment ? totalTax : -totalTax;
    const nightHours = this.calculateNightHours(time, numberHoursWorked) ?? 0;
    const checkTypeForNightHours = type == TypeOperation.Increment ? nightHours : -nightHours;

    if (status === Status.work) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberWorkingDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberWorkingHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
          'generalStatistics.grossAmountMoneyForWorkingDays': checkTypeForValueGross,
          'generalStatistics.nettoAmountMoneyForWorkingDays': checkTypeForValueNet,
          'generalStatistics.totalMoneyEarnedGross': checkTypeForValueGross,
          'generalStatistics.totalMoneyEarnedNetto': checkTypeForValueNet,
          'generalStatistics.totalTaxPaid': checkTypeForTax,
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
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForWorkingDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForWorkingDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
      });
    }
    if (status === Status.work && additionalHours) {
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
    if (status === Status.dayOff) {
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
    if (status === Status.vacation) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberVacationDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberVacationHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
          'generalStatistics.grossAmountMoneyForVacationDays': checkTypeForValueGross,
          'generalStatistics.nettoAmountMoneyForVacationDays': checkTypeForValueNet,
          'generalStatistics.totalMoneyEarnedGross': checkTypeForValueGross,
          'generalStatistics.totalMoneyEarnedNetto': checkTypeForValueNet,
          'generalStatistics.totalTaxPaid': checkTypeForTax,
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
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForVacationDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForVacationDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
      });
    }
    if (status === Status.sickLeave) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberSickDays': checkTypeForValueWithOne,
          'generalStatistics.totalDays': checkTypeForValueWithOne,
          'generalStatistics.numberSickHours': checkTypeForNumberHoursWorked,
          'generalStatistics.totalHours': checkTypeForNumberHoursWorked,
          'generalStatistics.grossAmountMoneyForSickDays': checkTypeForValueGross,
          'generalStatistics.nettoAmountMoneyForSickDays': checkTypeForValueNet,
          'generalStatistics.totalMoneyEarnedGross': checkTypeForValueGross,
          'generalStatistics.totalMoneyEarnedNetto': checkTypeForValueNet,
          'generalStatistics.totalTaxPaid': checkTypeForTax,
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
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForSickDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForSickDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
      });
    }
    if (workShiftNumber === WorkShiftNumber.Shift1) {
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
    if (workShiftNumber === WorkShiftNumber.Shift2) {
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
    if (workShiftNumber === WorkShiftNumber.Shift2 && nightHours > 0) {
      await this.StatisticsModel.findByIdAndUpdate(statistics._id, {
        $inc: {
          'generalStatistics.numberNightHours': checkTypeForNightHours,
        },
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberNightHours',
        defaultValue: checkTypeForNightHours,
        value: checkTypeForNightHours,
      });
    }
  }
}
