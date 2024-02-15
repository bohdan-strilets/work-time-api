import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherDto } from './dto/WeatherDto';
import { WeatherResponseType } from './types/response.type';
import { WeatherType } from './types/weather.type';
import { ErrorResponseType } from 'src/common/types/error-response.type';

@Controller('weather')
@ApiTags('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('get-weather')
  @ApiOperation({ summary: 'Get information for weather forecast by date.' })
  @ApiResponse({
    status: 200,
    description: 'Successful get of weather forecast information by date.',
    type: WeatherResponseType<WeatherType>,
  })
  @ApiResponse({
    status: 404,
    description: 'Check correct entered data.',
    type: ErrorResponseType,
  })
  async getWeatherForecast(
    @Body() weatherDto: WeatherDto,
  ): Promise<WeatherResponseType<WeatherType> | undefined> {
    const data = await this.weatherService.getWeatherForecast(weatherDto);
    return data;
  }
}
