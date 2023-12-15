import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MonthType } from '../types/month.type';

export type MonthStatisticsDocument = HydratedDocument<MonthStatistics>;

@Schema({ versionKey: false, _id: false })
export class MonthStatistics {
  @Prop({ default: [] })
  numberWorkingDays: MonthType[];

  @Prop({ default: [] })
  numberDaysOff: MonthType[];

  @Prop({ default: [] })
  numberVacationDays: MonthType[];

  @Prop({ default: [] })
  numberSickDays: MonthType[];

  @Prop({ default: [] })
  numberAdditionalWorkingDays: MonthType[];

  @Prop({ default: [] })
  numberWorkingHours: MonthType[];

  @Prop({ default: [] })
  numberFreeHours: MonthType[];

  @Prop({ default: [] })
  numberVacationHours: MonthType[];

  @Prop({ default: [] })
  numberSickHours: MonthType[];

  @Prop({ default: [] })
  numberAdditionalWorkingHours: MonthType[];

  @Prop({ default: [] })
  totalDays: MonthType[];

  @Prop({ default: [] })
  totalHours: MonthType[];

  @Prop({ default: [] })
  numberFirstShifts: MonthType[];

  @Prop({ default: [] })
  numberSecondShifts: MonthType[];

  @Prop({ default: [] })
  numberNightHours: MonthType[];

  @Prop({ default: [] })
  grossAmountMoneyForWorkingDays: MonthType[];

  @Prop({ default: [] })
  nettoAmountMoneyForWorkingDays: MonthType[];

  @Prop({ default: [] })
  grossAmountMoneyForVacationDays: MonthType[];

  @Prop({ default: [] })
  nettoAmountMoneyForVacationDays: MonthType[];

  @Prop({ default: [] })
  grossAmountMoneyForSickDays: MonthType[];

  @Prop({ default: [] })
  nettoAmountMoneyForSickDays: MonthType[];

  @Prop({ default: [] })
  totalMoneyEarnedGross: MonthType[];

  @Prop({ default: [] })
  totalMoneyEarnedNetto: MonthType[];

  @Prop({ default: [] })
  totalTaxPaid: MonthType[];
}
