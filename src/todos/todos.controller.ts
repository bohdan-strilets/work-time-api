import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  UseGuards,
  Param,
  Req,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TodosResponseType } from './types/response.type';
import { TodoDocument } from './schemas/todo.schema';
import { PayloadType } from 'src/tokens/types/payload.type';
import { AuthRequest } from 'src/users/types/auth-request.type';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateCompletedDto } from './dto/update-completed.dto';
import { ErrorResponseType } from 'src/common/types/error-response.type';

@UseGuards(JwtAuthGuard)
@Controller('todos')
@ApiTags('todos')
@ApiBearerAuth()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: 'Get information for one todo by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful get of todo information by id.',
    type: TodosResponseType<TodoDocument>,
  })
  @ApiResponse({
    status: 404,
    description: 'Todo with current ID not found.',
    type: ErrorResponseType,
  })
  @Get('one-todo/:todoId')
  async getOneTodo(
    @Param('todoId') todoId: string,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    const data = await this.todosService.getOneTodo(todoId);
    return data;
  }

  @ApiOperation({ summary: 'Get information for all todos.' })
  @ApiResponse({
    status: 200,
    description: 'Successful get of all todos information.',
    type: TodosResponseType<TodoDocument>,
  })
  @Get('all-todos')
  async getAllTodo(
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<TodosResponseType<TodoDocument[]> | undefined> {
    const { _id } = req.user;
    const data = await this.todosService.getAllTodos(_id);
    return data;
  }

  @ApiOperation({ summary: 'Create a new todo.' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new day',
    type: TodosResponseType<TodoDocument>,
  })
  @ApiResponse({
    status: 400,
    description: 'Check correct entered data.',
    type: ErrorResponseType,
  })
  @Post('create-todo')
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: AuthRequest<PayloadType>,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    const { _id } = req.user;
    const data = await this.todosService.createTodo(createTodoDto, _id);
    return data;
  }

  @ApiOperation({ summary: 'Update todo by id.' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the todo.',
    type: TodosResponseType<TodoDocument>,
  })
  @ApiResponse({
    status: 400,
    description: 'Check correct entered data.',
    type: ErrorResponseType,
  })
  @Patch('update-todo/:todoId')
  async updateTodo(
    @Body() updateTodoDto: UpdateTodoDto,
    @Param('todoId') todoId: string,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    const data = await this.todosService.updateTodo(updateTodoDto, todoId);
    return data;
  }

  @ApiOperation({ summary: 'Delete an existing todo.' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the todo',
  })
  @ApiResponse({
    status: 404,
    description: 'Todo with current ID not found.',
  })
  @Delete('delete-todo/:todoId')
  async deleteTodo(@Param('todoId') todoId: string): Promise<TodosResponseType | undefined> {
    const data = await this.todosService.deleteTodo(todoId);
    return data;
  }

  @ApiOperation({ summary: 'Update completed status for todo by id.' })
  @ApiResponse({
    status: 200,
    description: 'Successfully update copleted status.',
    type: TodosResponseType<TodoDocument>,
  })
  @ApiResponse({
    status: 404,
    description: 'Todo with current ID not found.',
  })
  @Put('update-completed/:todoId')
  async updateCompleted(
    @Param('todoId') todoId: string,
    @Body() updateCompletedDto: UpdateCompletedDto,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    const data = await this.todosService.updateCompleted(todoId, updateCompletedDto);
    return data;
  }

  @ApiOperation({ summary: 'Get a to-do list for a specific day.' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of to-do list by day ID.',
    type: TodosResponseType<TodoDocument>,
  })
  @ApiResponse({
    status: 400,
    description: 'There was no ID specified for the day.',
  })
  @Get('get-todos-by-date/:dayId')
  async getTodosByDate(
    @Param('dayId') dayId: string,
  ): Promise<TodosResponseType<TodoDocument[]> | undefined> {
    const data = await this.todosService.getTodosByDate(dayId);
    return data;
  }
}
