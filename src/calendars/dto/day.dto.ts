import { IsNotEmpty } from 'class-validator';
import { DayInfoType } from '../types/day-info.type';

export class DayDto {
  @IsNotEmpty()
  data: { [key: string]: DayInfoType };
}
