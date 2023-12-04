import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Day, DayDocument } from './schemas/day.schema';
import { ResponseType } from './types/response.type';

@Injectable()
export class CalendarsService {
  constructor(@InjectModel(Day.name) private DayModel: Model<DayDocument>) {}

  async getAllDaysInfo(userId: Types.ObjectId): Promise<ResponseType<DayDocument[]> | undefined> {
    const days = await this.DayModel.find({ owner: userId });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: days,
    };
  }

  async getOneDayInfo(dayId: string): Promise<ResponseType<DayDocument> | undefined> {
    const day = await this.DayModel.findOne({ _id: dayId });

    if (!day) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Day with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: day,
    };
  }
}
