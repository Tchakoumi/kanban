import { IStatistic, IStatistics } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prismaService: PrismaService) {}

  async getMovedTasksStatistics(interval: number): Promise<IStatistics> {
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
      movedTasksStats: [
        { count: 0, datetime: new Date(process.env.DEPLOYMENT_DATE) },
        ...movedTasksStats,
      ],
      updatedTaskStats: [
        { count: 0, datetime: new Date(process.env.DEPLOYMENT_DATE) },
        ...updatedTaskStats,
      ],
    };
  }

  private getStatistics(
    auditedTasks: { audited_at: Date }[],
    interval: number
  ) {
    return auditedTasks.reduce<IStatistic[]>((statistics, { audited_at }) => {
      const currentDate = audited_at.getTime();
      const statistic: IStatistic | undefined = statistics.find(
        (_) =>
          currentDate >= _.datetime.getTime() &&
          currentDate < _.datetime.getTime() + interval * 60 * 1000
      );
      const newStats =
        statistics.length === 0 || !statistic
          ? [...statistics, { datetime: audited_at, count: 1 }]
          : statistics.map((stat) =>
              stat.datetime.getTime() === statistic.datetime.getTime()
                ? { datetime: stat.datetime, count: stat.count + 1 }
                : stat
            );
      return newStats;
    }, []);
  }
}
