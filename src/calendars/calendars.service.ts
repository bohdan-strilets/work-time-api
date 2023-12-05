import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Day, DayDocument } from './schemas/day.schema';
import { ResponseType } from './types/response.type';
import { DayDto } from './dto/day.dto';

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

  async createDay(
    createDayDto: DayDto,
    userId: Types.ObjectId,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    if (!createDayDto) {
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

    const data = { ...createDayDto, owner: userId };
    const newDay = await this.DayModel.create(data);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      data: newDay,
    };
  }

  async updateDay(
    updateDayDto: DayDto,
    dayId: string,
  ): Promise<ResponseType<DayDocument> | ResponseType | undefined> {
    if (!updateDayDto) {
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

    const updatedPost = await this.DayModel.findByIdAndUpdate(dayId, updateDayDto, { new: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedPost,
    };
  }
}
