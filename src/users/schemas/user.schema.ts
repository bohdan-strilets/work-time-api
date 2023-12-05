import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyInfo, CompanyInfoDocument } from './company-info.schema';
import Gender from '../enums/gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  password: string;

  @Prop({ default: new Date() })
  dateBirth: Date;

  @Prop({ default: Gender.Other, enum: Gender })
  gender: Gender;

  @Prop({ default: null })
  description: string;

  @Prop({ type: CompanyInfo, default: {} })
  companyInfo: CompanyInfoDocument;

  @Prop({ default: null })
  avatarUrl: string;

  @Prop({ default: null })
  activationToken: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
