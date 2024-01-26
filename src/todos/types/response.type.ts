import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '../schemas/todo.schema';

export class TodosResponseType<T = Todo | Todo[]> {
  @ApiProperty({ example: 'success', enum: ['succes', 'error'] })
  status: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ example: 'Example message!', required: false })
  message?: string;

  @ApiProperty({ type: Todo, required: false })
  data?: T;
}
