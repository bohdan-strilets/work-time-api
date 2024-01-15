import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { TokensType } from 'src/tokens/types/tokens.type';

export class UserResponseType<T = TokensType, U = User | User[]> {
  @ApiProperty({ example: 'success', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 'Example message!', required: false })
  message?: string;

  @ApiProperty({ type: TokensType, required: false })
  tokens?: T;

  @ApiProperty({ type: User, required: false })
  data?: U;
}
