import { Types } from 'mongoose';

export class CreateTokenDto {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  isActivated: boolean;
}
