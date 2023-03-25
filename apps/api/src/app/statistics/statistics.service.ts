import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface IStatistic {
  datetime: Date;
  count: number;
}

@Injectable()
export class StatisticsService {
  constructor(private prismaService: PrismaService) {}

  async getMovedTasksStatistics(interval: number) {
    let auditedTasks = await this.prismaService.taskAudit.findMany({
      select: { audited_at: true },
      orderBy: { audited_at: 'asc' },
      distinct: ['task_id', 'task_position'],
    });
    const movedTasksStats = this.getStatistics(auditedTasks, interval);
    auditedTasks = await this.prismaService.taskAudit.findMany({
      select: { audited_at: true },
      orderBy: { audited_at: 'asc' },
      distinct: ['task_id', 'task_description', 'task_title'],
    });
    const updatedTaskStats = this.getStatistics(auditedTasks, interval);
    return {
      movedTasksStats,
      updatedTaskStats,
    };
  }

  private getStatistics(
    auditedTasks: { audited_at: Date }[],
    interval: number
  ) {
    return auditedTasks.reduce<IStatistic[]>((stats, { audited_at }) => {
      const currentDate = audited_at.getTime();
      const stat: IStatistic | undefined = stats.find(
        (_) =>
          currentDate >= _.datetime.getTime() &&
          currentDate < _.datetime.getTime() + interval * 60 * 1000
      );
      const newStats =
        stats.length === 0 || !stat
          ? [...stats, { datetime: audited_at, count: 1 }]
          : stats.map((_) =>
              _.datetime.getTime() === stat.datetime.getTime()
                ? { datetime: _.datetime, count: _.count + 1 }
                : _
            );
      return newStats;
    }, []);
  }
}
