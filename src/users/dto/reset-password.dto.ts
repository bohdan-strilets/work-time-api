import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from 'src/utilities/constants';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
