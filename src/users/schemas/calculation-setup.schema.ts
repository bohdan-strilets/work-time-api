import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ContractTypeEnum } from '../enums/contract-type.enum';

export type CalculationSetupDocument = HydratedDocument<CalculationSetup>;

@Schema({ versionKey: false, _id: false })
export class CalculationSetup {
  @ApiProperty({ example: ContractTypeEnum.ContractEmployment, enum: ContractTypeEnum })
  @Prop({ default: ContractTypeEnum.ContractEmployment, enum: ContractTypeEnum })
  contractType: ContractTypeEnum;

  @ApiProperty({ default: true })
  @Prop({ default: true })
  areYouAlready26Years: boolean;

  @ApiProperty({ default: false })
  @Prop({ default: false })
  ppk: boolean;

  @ApiProperty({ default: 2 })
  @Prop({ default: 2 })
  ppkRate: number;
}
