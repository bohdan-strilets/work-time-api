import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import Status from '../enums/status.enum';
import WorkShiftNumber from '../enums/work-shift-number.enum';

export type DayInfoDocument = HydratedDocument<DayInfo>;

@Schema({ versionKey: false, _id: false })
export class DayInfo {
  @ApiProperty({ type: Status })
  @Prop({ default: Status.dayOff })
  status: Status;

  @ApiProperty()
  @Prop({ default: 0 })
  numberHoursWorked: number;

  @ApiProperty()
  @Prop({ default: null })
  time: string;

  @ApiProperty({ type: WorkShiftNumber })
  @Prop({ default: WorkShiftNumber.Shift0 })
  workShiftNumber: WorkShiftNumber;

  @ApiProperty()
  @Prop({ default: false })
  additionalHours: boolean;
}
