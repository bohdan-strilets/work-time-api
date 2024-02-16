import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { WeatherDto } from './dto/WeatherDto';
import { WeatherResponseType } from './types/response.type';
import { WeatherType } from './types/weather.type';
import { WeatherApiPaths } from './enums/weather-api-paths.enum';

@Injectable()
export class WeatherService {
  async getWeatherForecast(
    weatherDto: WeatherDto,
  ): Promise<WeatherResponseType<WeatherType> | undefined> {
    if (!weatherDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const params = {
      key: process.env.WEATHER_API_KEY,
      q: `${weatherDto.latitude},${weatherDto.longitude}`,
      dt: weatherDto.date,
      lang: weatherDto.lang,
    };

    const today = new Date();
    let forecast: any;
    const date = new Date(weatherDto.date);

    try {
      if (date.getTime() < today.getTime()) {
        const { data } = await axios.get(WeatherApiPaths.History, { params });
        forecast = data;
      }
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      if (date.getTime() > futureDate.getTime()) {
        const { data } = await axios.get(WeatherApiPaths.Future, { params });
        forecast = data;
      }
      if (date.getTime() > today.getTime()) {
        const { data } = await axios.get(WeatherApiPaths.Forecast, { params });
        forecast = data;
      }

      const forecastForDay = forecast?.forecast.forecastday[0].day;
      const location = forecast.location;

      if (forecastForDay) {
        const normalizedForecast = {
          averageTemperature: forecastForDay.avgtemp_c,
          weatherCondition: forecastForDay.condition.text,
          weatherIcon: forecastForDay.condition.icon,
          maximumTemperature: forecastForDay.maxtemp_c,
          minimumTemperature: forecastForDay.mintemp_c,
          location: {
            country: location.country,
            city: location.name,
          },
        };
        return {
          status: 'success',
          code: HttpStatus.CREATED,
          success: true,
          data: normalizedForecast,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
