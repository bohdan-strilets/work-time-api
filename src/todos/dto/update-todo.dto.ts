import { IsString, IsBoolean, IsIn, MinLength, MaxLength, IsOptional } from 'class-validator';
import Priority from '../enums/priority.enum';

export class UpdateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsOptional()
  task?: string;

  @IsString()
  @IsIn([Priority])
  @IsOptional()
  priority?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
