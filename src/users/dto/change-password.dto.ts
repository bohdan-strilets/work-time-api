import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from 'src/utilities/constants';

export class ChangePasswordDto {
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  newPassword: string;
}
