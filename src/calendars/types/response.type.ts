import { ApiProperty } from '@nestjs/swagger';
import { DayDocument, Day } from '../schemas/day.schema';

export class CalendarResponseType<D = DayDocument | DayDocument[]> {
  @ApiProperty({ example: 'success', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 'Example message!', required: false })
  message?: string;

  @ApiProperty({ type: Day, required: false })
  data?: D;
}
