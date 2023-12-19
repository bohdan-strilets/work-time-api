import { Types } from 'mongoose';

export type ValueType = {
  dayId: Types.ObjectId;
  value: number;
};
