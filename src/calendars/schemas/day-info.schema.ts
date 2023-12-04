import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Status from '../enums/status.enum';
import WorkShiftNumber from '../enums/work-shift-number.enum';

export type DayInfoDocument = HydratedDocument<DayInfo>;

@Schema({ versionKey: false, _id: false })
export class DayInfo {
  @Prop({ default: Status.dayOff })
  status: Status;

  @Prop({ default: 0 })
  numberHoursWorked: number;

  @Prop({ default: null })
  time: string;

  @Prop({ default: WorkShiftNumber.Shift0 })
  workShiftNumber: WorkShiftNumber;

  @Prop({ default: false })
  additionalHours: boolean;
}
