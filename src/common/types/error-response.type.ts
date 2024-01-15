import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseType {
  @ApiProperty({ example: 'error', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 'Example message!', required: false })
  message?: string;
}
