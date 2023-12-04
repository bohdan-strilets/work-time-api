import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CompanyInfoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  companyName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  profession?: string;

  @IsDateString()
  @IsOptional()
  startWork?: Date;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1000)
  salaryPerHour: number;
}
