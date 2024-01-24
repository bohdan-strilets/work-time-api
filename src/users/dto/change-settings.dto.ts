import { IsString, IsOptional, IsIn, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ContractTypeEnum } from '../enums/contract-type.enum';

export class ChangeSettingsDto {
  @IsString()
  @IsIn([ContractTypeEnum])
  @IsOptional()
  contractType?: string;

  @IsBoolean()
  @IsOptional()
  areYouAlready26Years?: boolean;

  @IsBoolean()
  @IsOptional()
  ppk?: boolean;

  @IsNumber()
  @Min(0.5)
  @Max(4)
  @IsOptional()
  ppkRate?: number;
}
