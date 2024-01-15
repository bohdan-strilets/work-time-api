import { ApiProperty } from '@nestjs/swagger';

export class TokensType {
  @ApiProperty({ example: 'Access token' })
  accessToken: string;

  @ApiProperty({ example: 'Refresh token' })
  refreshToken: string;
}
