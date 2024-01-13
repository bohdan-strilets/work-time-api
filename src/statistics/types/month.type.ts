import { ApiProperty } from '@nestjs/swagger';
import { ValueType } from './value.type';

export class MonthType {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: '2020' })
  year: string;

  @ApiProperty({ type: [ValueType] })
  value: ValueType[];
}
