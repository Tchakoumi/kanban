import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './tasks.dto';
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
        `Oops! They was an error updating column: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
