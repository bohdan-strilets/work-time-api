import {
  IsString,
  IsBoolean,
  IsIn,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
} from 'class-validator';
import Priority from '../enums/priority.enum';

export class CreateTodoDto {
  @IsString()
  dayId: string;

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

  @IsDateString()
  appointmentDate: Date;
}
