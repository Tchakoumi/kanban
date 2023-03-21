import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
