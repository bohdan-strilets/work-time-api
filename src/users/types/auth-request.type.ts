import { Request } from 'express';
import { PayloadType } from 'src/tokens/types/payload.type';
import { UserFromGoogle } from 'src/auth/types/user-from-google.type';

export interface AuthRequest<U = PayloadType | UserFromGoogle> extends Request {
  user?: U;
}
