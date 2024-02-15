import { IsString, IsNumber, IsDate } from 'class-validator';

export class WeatherDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsDate()
  date: Date;

  @IsString()
  lang: string;
}
