import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Query('column_id') columnId: string) {
    return await this.tasksService.findAll(columnId);
  }

  @Get(':task_id/details')
  async getTaskDetails(@Param('task_id') task_id: string) {
    return this.tasksService.findOne(task_id);
  }

  @Post('new')
  async createNewTask(@Body() newTask: CreateTaskDto) {
    try {
      return await this.tasksService.create(newTask);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error creating new task: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':task_id/edit')
  async updateTask(
    @Param('task_id') task_id: string,
    @Body() updateData: UpdateTaskDto
  ) {
    try {
      return await this.tasksService.update(task_id, updateData);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error updating task: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
