import { ApiProperty } from '@nestjs/swagger';
import { StatisticsDocument, Statistics } from '../schemas/statistics.schema';

export class ResponseType<S = StatisticsDocument> {
  @ApiProperty({ example: 'success', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Example message!' })
  message?: string;

  @ApiProperty({ type: Statistics })
  data?: S;
}
