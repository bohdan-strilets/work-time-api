import { Request } from 'express';
import { PayloadType } from 'src/tokens/types/payload.type';

export interface AuthRequest extends Request {
  user?: PayloadType;
}
