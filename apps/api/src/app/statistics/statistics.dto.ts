import { IStatistic, IStatistics } from '@kanban/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class Statistic implements IStatistic {
  @ApiProperty({ type: Date })
  datetime: Date;

  @ApiProperty({ type: Number })
  count: number;
}

export class Statistics implements IStatistics {
  @ApiProperty({ type: Statistic, isArray: true })
  movedTasksStats: IStatistic[];

  @ApiProperty({ type: Statistic, isArray: true })
  updatedTaskStats: IStatistic[];
}
