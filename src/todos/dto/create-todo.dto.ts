import { IsString, IsBoolean, IsIn, MinLength, MaxLength, IsOptional } from 'class-validator';
import Priority from '../enums/priority.enum';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  task: string;

  @IsString()
  @IsIn([Priority])
  priority?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
