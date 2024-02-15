import { ApiProperty } from '@nestjs/swagger';

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
}
