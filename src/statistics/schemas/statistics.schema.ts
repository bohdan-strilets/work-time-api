import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { MonthStatisticsDocument, MonthStatistics } from './month-statistics.schema';

export type StatisticsDocument = HydratedDocument<Statistics>;

@Schema({ versionKey: false, timestamps: true })
export class Statistics {
  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @ApiProperty({ type: MonthStatistics })
  @Prop({ type: MonthStatistics })
  statisticsByMonths: MonthStatisticsDocument;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
