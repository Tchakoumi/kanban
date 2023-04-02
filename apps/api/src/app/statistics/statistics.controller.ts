import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Statistics } from './statistics.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get()
  @ApiResponse({ type: Statistics })
  @ApiOperation({ description: 'Get moved and updated task rate statistics.' })
  async getMovedTasksStatistics(@Query('interval') interval: number) {
    return await this.statisticsService.getMovedTasksStatistics(interval ?? 1);
  }
}
