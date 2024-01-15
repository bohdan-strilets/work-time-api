import { ApiProperty } from '@nestjs/swagger';
import Status from '../enums/status.enum';
import WorkShiftNumber from '../enums/work-shift-number.enum';

export class DayInfoType {
  @ApiProperty()
  status: Status;

  @ApiProperty()
  numberHoursWorked: number;

  @ApiProperty()
  time: string;

  @ApiProperty({ type: WorkShiftNumber })
  workShiftNumber: WorkShiftNumber;

  @ApiProperty()
  additionalHours: boolean;

  @ApiProperty()
  grossEarnings: number;

  @ApiProperty()
  netEarnings: number;
}
