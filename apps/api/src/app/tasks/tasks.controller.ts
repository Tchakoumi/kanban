import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTaskDto,
  Task,
  TaskDetails,
  UpdateSubtaskDto,
  UpdateTaskDto,
} from './tasks.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiResponse({
    type: Task,
    isArray: true,
  })
  @ApiOperation({ description: 'Get all tasks under a given column' })
  async getTasks(@Query('column_id') columnId: string) {
    return await this.tasksService.findAll(columnId);
  }

  @Get(':task_id/details')
  @ApiResponse({ type: TaskDetails })
  @ApiOperation({ description: 'Get given task and its subtasks' })
  async getTaskDetails(@Param('task_id') task_id: string) {
    return this.tasksService.findOne(task_id);
  }

  @Post('new')
  @ApiResponse({ type: Task })
  @ApiOperation({
    description: 'Create a new task and returns the newly created task',
  })
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

  @Put('subtasks/edit')
  @ApiOperation({ description: "Update task's subtask" })
  async updateSubtasks(@Body() updateData: UpdateSubtaskDto) {
    try {
      return await this.tasksService.updateSubtask(updateData);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error deleting task: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':task_id/edit')
  @ApiOperation({ description: "Update task and task's subtasks" })
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

  @Delete(':task_id/delete')
  @ApiOperation({ description: 'Delete given task' })
  async deleteTask(@Param('task_id') taskId: string) {
    try {
      return await this.tasksService.delete(taskId);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error deleting task: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
