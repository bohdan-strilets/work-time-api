import { ApiProperty } from '@nestjs/swagger';

export class LocationType {
  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;
}
