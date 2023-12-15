import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel(Statistics.name) private StatisticsModel: Model<StatisticsDocument>) {}
}
