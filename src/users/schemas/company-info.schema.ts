import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyInfoDocument = HydratedDocument<CompanyInfo>;

@Schema({ versionKey: false, _id: false })
export class CompanyInfo {
  @Prop({ default: null })
  companyName: string;

  @Prop({ default: null })
  profession: string;

  @Prop({ default: new Date() })
  startWork: Date;

  @Prop({ default: 0 })
  salaryPerHour: number;
}
