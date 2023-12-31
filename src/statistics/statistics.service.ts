import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';
import Status from 'src/calendars/enums/status.enum';
import WorkShiftNumber from 'src/calendars/enums/work-shift-number.enum';
import TypeOperation from './enums/type-operation.enum';
import { DayInfoType } from 'src/calendars/types/day-info.type';
import { MonthType } from './types/month.type';
import { ResponseType } from './types/response.type';
import statisticsGroup from './utilities/statistics-group';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel(Statistics.name) private StatisticsModel: Model<StatisticsDocument>) {}

  async findAndUpdateStatisticksField(
    userId: Types.ObjectId,
    params: {
      month: number;
      year: string;
      fieldNameFromDb: string;
      defaultValue?: number;
      value?: number;
      dayId?: Types.ObjectId;
      type: TypeOperation;
    },
  ): Promise<void> {
    const FIELD_NAME_DB = 'statisticsByMonths';
    const { month, year, fieldNameFromDb, defaultValue, value, dayId, type } = params;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const monthStats = statistics.statisticsByMonths;

    const selectedMonth: MonthType = monthStats[fieldNameFromDb].find(
      (item: MonthType) => item.month === month && item.year === year,
    );

    const updatedData: MonthType[] = [...monthStats[fieldNameFromDb]];
    const index = updatedData.findIndex(item => item.month === month && item.year === year);

    if (index !== -1) {
      if (type === TypeOperation.Increment) {
        updatedData[index] = {
          ...selectedMonth,
          value: [...selectedMonth.value, { dayId, value }],
        };
      } else {
        const filteredValue = selectedMonth.value.filter(item => !item.dayId.equals(dayId));
        updatedData[index] = { ...selectedMonth, value: filteredValue };
      }
    } else {
      defaultValue !== 0
        ? updatedData.push({ month, year, value: [{ dayId, value: defaultValue }] })
        : updatedData.push({ month, year, value: [] });
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

  async addDefaultValueForEachField(params: {
    userId: Types.ObjectId;
    fields: string[];
    month: number;
    year: string;
    type: TypeOperation;
  }) {
    const { userId, fields, month, year, type } = params;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });

    fields.map(async name => {
      const existingField = statistics.statisticsByMonths[name].find(
        (item: MonthType) => item.month === month && item.year === year,
      );
      if (!existingField) {
        await this.findAndUpdateStatisticksField(userId, {
          month,
          year,
          fieldNameFromDb: name,
          defaultValue: 0,
          type,
        });
      }
      return;
    });
  }

  async changeStatisticsForDaysAndHours(params: {
    dataByClient: DayInfoType;
    month: number;
    year: string;
    userId: Types.ObjectId;
    type: TypeOperation;
    dayId: Types.ObjectId;
  }): Promise<void> {
    const { dataByClient, month, year, userId, type, dayId } = params;
    const {
      grossEarnings,
      netEarnings,
      numberHoursWorked,
      status,
      workShiftNumber,
      additionalHours,
      time,
    } = dataByClient;
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
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberWorkingHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForWorkingDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForWorkingDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.works,
        month,
        year,
        type,
      });
    }
    if (status === Status.work && additionalHours) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberAdditionalWorkingHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.additionalWork,
        month,
        year,
        type,
      });
    }
    if (status === Status.dayOff) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberDaysOff',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFreeHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.dayOff,
        month,
        year,
        type,
      });
    }
    if (status === Status.vacation) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberVacationHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForNumberHoursWorked,
        value: checkTypeForNumberHoursWorked,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForVacationDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForVacationDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.vacation,
        month,
        year,
        type,
      });
    }
    if (status === Status.sickLeave) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalDays',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSickHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalHours',
        defaultValue: checkTypeForValueWithTwelve,
        value: checkTypeForValueWithTwelve,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'grossAmountMoneyForSickDays',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'nettoAmountMoneyForSickDays',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedGross',
        defaultValue: checkTypeForValueGross,
        value: checkTypeForValueGross,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalMoneyEarnedNetto',
        defaultValue: checkTypeForValueNet,
        value: checkTypeForValueNet,
        dayId,
        type,
      });
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'totalTaxPaid',
        defaultValue: checkTypeForTax,
        value: checkTypeForTax,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.siclLeave,
        month,
        year,
        type,
      });
    }
    if (workShiftNumber === WorkShiftNumber.Shift1) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberFirstShifts',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.firstShift,
        month,
        year,
        type,
      });
    }
    if (workShiftNumber === WorkShiftNumber.Shift2) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberSecondShifts',
        defaultValue: checkTypeForValueWithOne,
        value: checkTypeForValueWithOne,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.secondShift,
        month,
        year,
        type,
      });
    }
    if (workShiftNumber === WorkShiftNumber.Shift2 && nightHours > 0) {
      await this.findAndUpdateStatisticksField(userId, {
        month,
        year,
        fieldNameFromDb: 'numberNightHours',
        defaultValue: checkTypeForNightHours,
        value: checkTypeForNightHours,
        dayId,
        type,
      });
      await this.addDefaultValueForEachField({
        userId,
        fields: statisticsGroup.nightHours,
        month,
        year,
        type,
      });
    }
  }

  async deletUserStatistics(userId: Types.ObjectId): Promise<void> {
    await this.StatisticsModel.findOneAndDelete({ owner: userId });
  }

  async getStatistics(
    userId: Types.ObjectId,
  ): Promise<ResponseType<StatisticsDocument> | undefined> {
    const statistics = await this.StatisticsModel.findOne({ owner: userId });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: statistics,
    };
  }
}
