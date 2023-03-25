import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  async getMovedTasksStatistics(@Query('interval') interval: number) {
    return await this.statisticsService.getMovedTasksStatistics(interval ?? 1);
  }
}
