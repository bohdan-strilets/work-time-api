import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import Priority from '../enums/priority.enum';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ versionKey: false, timestamps: true })
export class Todo {
  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'User ID' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @ApiProperty({ example: 'Example text for todo.' })
  @Prop({ required: true })
  task: string;

  @ApiProperty({ example: Priority.Low, enum: Priority })
  @Prop({ required: true, default: Priority.Low, enum: Priority })
  priority: Priority;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isCompleted: boolean;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
