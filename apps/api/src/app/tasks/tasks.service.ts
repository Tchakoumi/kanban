import { ITask, ITaskDetails } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async findAll(column_id?: string): Promise<ITask[]> {
    const tasks = await this.prismaService.task.findMany({
      include: { Subtasks: { select: { is_done: true } } },
      where: { is_deleted: false, column_id },
    });
    return tasks.map(({ Subtasks, ...task }) => {
      const [total_done_subtasks, total_undone_subtasks] = Subtasks.reduce(
        ([totalDone, totalUndone], { is_done }) =>
          is_done ? [totalDone++, totalUndone] : [totalDone, totalUndone++],
        [0, 0]
      );
      return {
        total_done_subtasks,
        total_undone_subtasks,
        ...excludeKeys(task, 'created_at', 'is_deleted'),
      };
    });
  }

  async findOne(task_id: string): Promise<ITaskDetails> {
    const { Subtasks, ...task } =
      await this.prismaService.task.findUniqueOrThrow({
        include: {
          Subtasks: {
            select: { subtask_id: true, subtask_title: true, is_done: true },
            where: { is_deleted: false },
          },
        },
        where: { task_id },
      });
    const [total_done_subtasks, total_undone_subtasks] = Subtasks.reduce(
      ([totalDone, totalUndone], { is_done }) =>
        is_done ? [totalDone++, totalUndone] : [totalDone, totalUndone++],
      [0, 0]
    );
    return {
      subtasks: Subtasks,
      total_done_subtasks,
      total_undone_subtasks,
      ...excludeKeys(task, 'created_at', 'is_deleted'),
    };
  }
}
