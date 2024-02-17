import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';

export class ContactEmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDate()
  dateOfEntry: Date;
}
