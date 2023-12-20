import { StatisticsDocument } from '../schemas/statistics.schema';

export type ResponseType<S = StatisticsDocument> = {
  status: string;
  code: number;
  success: boolean;
  message?: string;
  data?: S;
};
