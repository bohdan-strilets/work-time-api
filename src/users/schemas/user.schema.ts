import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyInfo, CompanyInfoDocument } from './company-info.schema';
import Gender from '../enums/gender.enum';
import { Statistics } from 'src/statistics/schemas/statistics.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @ApiProperty({ example: 'Banan' })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ example: 'Yellow' })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ example: 'yellow.banan@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '123456M' })
  @Prop({ default: null })
  password: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: new Date() })
  dateBirth: Date;

  @ApiProperty({ example: Gender.Man, enum: Gender })
  @Prop({ default: Gender.Other, enum: Gender })
  gender: Gender;

  @ApiProperty({ example: 'Example text about user.' })
  @Prop({ default: null })
  description: string;

  @ApiProperty({ type: CompanyInfo })
  @Prop({ type: CompanyInfo, default: {} })
  companyInfo: CompanyInfoDocument;

  @ApiProperty({ example: 'www.user/avatar' })
  @Prop({ default: null })
  avatarUrl: string;

  @ApiProperty({ example: 'Activation token' })
  @Prop({ default: null })
  activationToken: string;

  @ApiProperty({ example: true })
  @Prop({ default: false })
  isActivated: boolean;

  @ApiProperty({
    example: new Types.ObjectId(),
    type: Types.ObjectId,
    description: 'Statistics ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Statistics' })
  statistics: Statistics;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
