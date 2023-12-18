import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsService } from './statistics.service';
import { Statistics, StatisticsSchema } from './schemas/statistics.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Statistics.name, schema: StatisticsSchema }])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
