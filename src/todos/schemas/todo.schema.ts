import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import Priority from '../enums/priority.enum';
import { Day } from 'src/calendars/schemas/day.schema';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ versionKey: false, timestamps: true })
export class Todo {
  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'Day ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Day' })
  dayId: Day;

  @ApiProperty({ example: 'Example text for todo.' })
  @Prop({ required: true })
  task: string;

  @ApiProperty({ example: Priority.Low, enum: Priority })
  @Prop({ required: true, default: Priority.Low, enum: Priority })
  priority: Priority;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isCompleted: boolean;

  @ApiProperty({ example: new Date() })
  @Prop({ required: true })
  appointmentDate: Date;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
