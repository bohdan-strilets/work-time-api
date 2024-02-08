import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { TodosResponseType } from './types/response.type';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateCompletedDto } from './dto/update-completed.dto';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private TodoModel: Model<TodoDocument>) {}

  async getOneTodo(todoId: string): Promise<TodosResponseType<TodoDocument> | undefined> {
    const todo = await this.TodoModel.findOne({ _id: todoId });

    if (!todo) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Todo with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: todo,
    };
  }

  async getAllTodos(
    userId: Types.ObjectId,
  ): Promise<TodosResponseType<TodoDocument[]> | undefined> {
    const todos = await this.TodoModel.find({ owner: userId });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: todos,
    };
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    userId: Types.ObjectId,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    if (!createTodoDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = { ...createTodoDto, owner: userId };
    const newTodo = await this.TodoModel.create(data);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      success: true,
      data: newTodo,
    };
  }

  async updateTodo(
    updateTodoDto: UpdateTodoDto,
    todoId: string,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    if (!updateTodoDto) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check correct entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedTodo = await this.TodoModel.findByIdAndUpdate(todoId, updateTodoDto, {
      new: true,
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedTodo,
    };
  }

  async deleteTodo(todoId: string): Promise<TodosResponseType | undefined> {
    if (!todoId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Todo with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.TodoModel.findByIdAndDelete(todoId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      message: 'Todo is successfully deleted.',
    };
  }

  async updateCompleted(
    todoId: string,
    updateCompletedDto: UpdateCompletedDto,
  ): Promise<TodosResponseType<TodoDocument> | undefined> {
    if (!todoId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Todo with current ID not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const data = { isCompleted: updateCompletedDto.isCompleted };
    const updatedTodo = await this.TodoModel.findByIdAndUpdate(todoId, data, { new: true });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: updatedTodo,
    };
  }

  async getTodosByDate(dayId: string): Promise<TodosResponseType<TodoDocument[]> | undefined> {
    if (!dayId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'There was no ID specified for the day.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const todosForDay = await this.TodoModel.find({ dayId });

    return {
      status: 'success',
      code: HttpStatus.OK,
      success: true,
      data: todosForDay,
    };
  }

  async deleteTodosByDayId(dayId: string): Promise<void> {
    if (!dayId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'There was no ID specified for the day.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.TodoModel.deleteMany({ dayId });
  }

  async deleteTodoByUserId(userId: Types.ObjectId): Promise<void> {
    if (!userId) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not unauthorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.TodoModel.deleteMany({ owner: userId });
  }
}
