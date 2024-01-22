import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';
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
}
