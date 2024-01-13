import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { MonthType } from '../types/month.type';

export type MonthStatisticsDocument = HydratedDocument<MonthStatistics>;

@Schema({ versionKey: false, _id: false })
export class MonthStatistics {
  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberWorkingDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberDaysOff: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberVacationDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberSickDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberAdditionalWorkingDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberWorkingHours: MonthType[];

  @Prop({ default: [] })
  numberFreeHours: MonthType[];

  @ApiProperty({ type: [MonthType] }) 1;
  @Prop({ default: [] })
  numberVacationHours: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberSickHours: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberAdditionalWorkingHours: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  totalDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  totalHours: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberFirstShifts: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberSecondShifts: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  numberNightHours: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  grossAmountMoneyForWorkingDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  nettoAmountMoneyForWorkingDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  grossAmountMoneyForVacationDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  nettoAmountMoneyForVacationDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  grossAmountMoneyForSickDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  nettoAmountMoneyForSickDays: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  totalMoneyEarnedGross: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  totalMoneyEarnedNetto: MonthType[];

  @ApiProperty({ type: [MonthType] })
  @Prop({ default: [] })
  totalTaxPaid: MonthType[];
}
