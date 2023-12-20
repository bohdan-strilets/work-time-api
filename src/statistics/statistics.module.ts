import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsService } from './statistics.service';
import { Statistics, StatisticsSchema } from './schemas/statistics.schema';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Statistics.name, schema: StatisticsSchema }])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
  exports: [StatisticsService],
})
export class StatisticsModule {}
