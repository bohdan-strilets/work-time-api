import { ApiProperty } from '@nestjs/swagger';
import { LocationType } from './location.type';

export class WeatherType {
  @ApiProperty()
  averageTemperature: number;

  @ApiProperty()
  weatherCondition: string;

  @ApiProperty()
  weatherIcon: string;

  @ApiProperty()
  maximumTemperature: number;

  @ApiProperty()
  minimumTemperature: number;

  @ApiProperty()
  location: LocationType;
}
