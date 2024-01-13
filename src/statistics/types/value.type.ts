import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ValueType {
  @ApiProperty({ example: new Types.ObjectId(), type: Types.ObjectId, description: 'Day ID' })
  dayId: Types.ObjectId;

  @ApiProperty({ example: 1 })
  value: number;
}
