import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { MonthStatisticsDocument, MonthStatistics } from './month-statistics.schema';

export type StatisticsDocument = HydratedDocument<Statistics>;

@Schema({ versionKey: false, timestamps: true })
export class Statistics {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: MonthStatistics, default: {} })
  statisticsByMonths: MonthStatisticsDocument;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
