import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Statistics, StatisticsDocument } from './schemas/statistics.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel(Statistics.name) private StatisticsModel: Model<StatisticsDocument>) {}

  async findAndUpdateStatisticksField(
    userId: Types.ObjectId,
    params: {
      month: number;
      year: string;
      fieldNameFromDb: string;
      defaultValue: number;
      value: number;
    },
  ) {
    const { month, year, fieldNameFromDb, defaultValue, value } = params;
    const statistics = await this.StatisticsModel.findOne({ owner: userId });
    const monthStats = statistics.statisticsByMonths;
    const current = monthStats[fieldNameFromDb].find(
      (item: { month: number; year: string; value: number }) =>
        item.month === month && item.year === year,
    );
    const updatedData = [...monthStats[fieldNameFromDb]];
    const index = updatedData.findIndex(item => item.month === month && item.year === year);
    if (index !== -1) {
      updatedData[index] = { ...current, value: current.value + value };
    } else {
      updatedData.push({ month, year, value: defaultValue });
    }

    const updateField = `statisticsByMonths.${fieldNameFromDb}`;
    const updateObject = { [updateField]: updatedData };
    await this.StatisticsModel.findByIdAndUpdate(statistics._id, updateObject);
  }
}
