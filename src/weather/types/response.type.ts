import { ApiProperty } from '@nestjs/swagger';
import { WeatherType } from './weather.type';

export class WeatherResponseType<W = WeatherType> {
  @ApiProperty({ example: 'success', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 'Example message!', required: false })
  message?: string;

  @ApiProperty({ type: WeatherType, required: false })
  data?: W;
}
