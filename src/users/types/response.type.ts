import { User } from 'src/users/schemas/user.schema';
import { TokensType } from 'src/tokens/types/tokens.type';

export type ResponseType<T = TokensType, U = User | User[]> = {
  status: string;
  code: number;
  success: boolean;
  message?: string;
  tokens?: T;
  data?: U;
};
