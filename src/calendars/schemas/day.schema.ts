import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { DayInfoDocument } from './day-info.schema';

export type DayDocument = HydratedDocument<Day>;

@Schema({ versionKey: false, timestamps: true })
export class Day {
  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @ApiProperty()
  @Prop({ type: Map, of: mongoose.Schema.Types.Mixed, default: new Map() })
  data: Map<string, DayInfoDocument>;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const DaySchema = SchemaFactory.createForClass(Day);
