import {
  IsString,
  IsDateString,
  IsIn,
  MinLength,
  MaxLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CompanyInfoDto } from './company-info.dto';
import Gender from '../enums/gender.enum';

export class ChangeProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateBirth?: Date;

  @IsString()
  @IsIn([Gender])
  @IsOptional()
  gender?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @ValidateNested()
  @IsOptional()
  companyInfo?: CompanyInfoDto;
}
