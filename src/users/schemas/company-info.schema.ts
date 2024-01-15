import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CompanyInfoDocument = HydratedDocument<CompanyInfo>;

@Schema({ versionKey: false, _id: false })
export class CompanyInfo {
  @ApiProperty({ example: 'Company name' })
  @Prop({ default: null })
  companyName: string;

  @ApiProperty({ example: 'Profession' })
  @Prop({ default: null })
  profession: string;

  @ApiProperty({ example: new Date() })
  @Prop({ default: new Date() })
  startWork: Date;

  @ApiProperty({ example: 25 })
  @Prop({ default: 0 })
  salaryPerHour: number;
}
