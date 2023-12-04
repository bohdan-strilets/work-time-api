import { DayDocument } from '../schemas/day.schema';

export type ResponseType<D = DayDocument | DayDocument[]> = {
  status: string;
  code: number;
  success: boolean;
  message?: string;
  data?: D;
};
