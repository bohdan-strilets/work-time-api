import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { DayInfoDocument } from './day-info.schema';

export type DayDocument = HydratedDocument<Day>;

@Schema({ versionKey: false, timestamps: true })
export class Day {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  data: { [key: string]: DayInfoDocument };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DaySchema = SchemaFactory.createForClass(Day);
