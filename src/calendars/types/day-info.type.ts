import Status from '../enums/status.enum';
import WorkShiftNumber from '../enums/work-shift-number.enum';

export type DayInfoType = {
  status: Status;
  numberHoursWorked: number;
  time: string;
  workShiftNumber: WorkShiftNumber;
  additionalHours: boolean;
  grossEarnings: number;
  netEarnings: number;
};
