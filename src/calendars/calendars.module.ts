import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { Day, DaySchema } from './schemas/day.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Day.name, schema: DaySchema }])],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
