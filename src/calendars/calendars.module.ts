import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { Day, DaySchema } from './schemas/day.schema';
import { StatisticsModule } from 'src/statistics/statistics.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Day.name, schema: DaySchema }]), StatisticsModule],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
