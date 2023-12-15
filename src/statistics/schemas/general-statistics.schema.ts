import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GeneralStatisticsDocument = HydratedDocument<GeneralStatistics>;

@Schema({ versionKey: false, _id: false })
export class GeneralStatistics {
  @Prop({ default: 0 })
  numberWorkingDays: number;

  @Prop({ default: 0 })
  numberDaysOff: number;

  @Prop({ default: 0 })
  numberVacationDays: number;

  @Prop({ default: 0 })
  numberSickDays: number;

  @Prop({ default: 0 })
  numberAdditionalWorkingDays: number;

  @Prop({ default: 0 })
  numberWorkingHours: number;

  @Prop({ default: 0 })
  numberFreeHours: number;

  @Prop({ default: 0 })
  numberVacationHours: number;

  @Prop({ default: 0 })
  numberSickHours: number;

  @Prop({ default: 0 })
  numberAdditionalWorkingHours: number;

  @Prop({ default: 0 })
  totalDays: number;

  @Prop({ default: 0 })
  totalHours: number;

  @Prop({ default: 0 })
  numberFirstShifts: number;

  @Prop({ default: 0 })
  numberSecondShifts: number;

  @Prop({ default: 0 })
  numberNightHours: number;

  @Prop({ default: 0 })
  grossAmountMoneyForWorkingDays: number;

  @Prop({ default: 0 })
  nettoAmountMoneyForWorkingDays: number;

  @Prop({ default: 0 })
  grossAmountMoneyForVacationDays: number;

  @Prop({ default: 0 })
  nettoAmountMoneyForVacationDays: number;

  @Prop({ default: 0 })
  grossAmountMoneyForSickDays: number;

  @Prop({ default: 0 })
  nettoAmountMoneyForSickDays: number;

  @Prop({ default: 0 })
  totalMoneyEarnedGross: number;

  @Prop({ default: 0 })
  totalMoneyEarnedNetto: number;

  @Prop({ default: 0 })
  totalTaxPaid: number;
}
