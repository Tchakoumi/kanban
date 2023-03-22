import { ITask, ITaskDetails } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async findAll(column_id?: string): Promise<ITask[]> {
    const tasks = await this.prismaService.task.findMany({
      orderBy: { task_position: 'asc' },
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

  async create({
    newSubtasks,
    column_id,
    ...newTask
  }: CreateTaskDto): Promise<ITask> {
    const numberOfTasks = await this.prismaService.task.count({
      where: { is_deleted: false },
    });
    const task = await this.prismaService.task.create({
      data: {
        ...newTask,
        task_position: numberOfTasks + 1,
        Column: { connect: { column_id } },
        Subtasks: {
          createMany: {
            data: newSubtasks,
          },
        },
      },
    });
    return {
      total_done_subtasks: 0,
      total_undone_subtasks: 0,
      ...excludeKeys(task, 'created_at', 'is_deleted'),
    };
  }

  async update(
    task_id: string,
    {
      deletedSubtaskIds,
      updatedSubtasks,
      newSubtasks,
      task_position,
      ...newTask
    }: UpdateTaskDto
  ) {
    const task = await this.prismaService.task.findUniqueOrThrow({
      where: { task_id },
    });
    const auditedSubtasks = await this.prismaService.subtask.findMany({
      where: {
        OR: [
          ...deletedSubtaskIds,
          ...updatedSubtasks.map((_) => _.subtask_id),
        ].map((subtask_id) => ({ subtask_id })),
      },
    });
    const hasTaskPositionChanged =
      task_position && task_position !== task.task_position;
    const { updatedTasks, auditedTasks } = hasTaskPositionChanged
      ? await this.updateTaskPosition(
          task_id,
          task_position,
          task.task_position
        )
      : { updatedTasks: [], auditedTasks: [] };

    await this.prismaService.$transaction([
      this.prismaService.task.update({
        data: {
          ...newTask,
          task_position,
          TaskAudits: {
            create: {
              ...excludeKeys(task, 'created_at', 'task_id', 'column_id'),
            },
          },
          Subtasks: {
            updateMany: {
              data: { is_deleted: true },
              where: {
                OR: deletedSubtaskIds.map((subtask_id) => ({ subtask_id })),
              },
            },
            createMany: {
              data: newSubtasks ?? [],
            },
          },
        },
        where: { task_id },
      }),
      this.prismaService.subtaskAudit.createMany({
        data: auditedSubtasks.map((subtask) =>
          excludeKeys(subtask, 'created_at', 'task_id')
        ),
      }),
      ...updatedSubtasks.map(({ subtask_id, ...newSubtask }) =>
        this.prismaService.subtask.update({
          data: newSubtask,
          where: { subtask_id },
        })
      ),
      ...updatedTasks.map(({ task_id, task_position }) =>
        this.prismaService.task.update({
          data: { task_position },
          where: { task_id: task_id as string },
        })
      ),
      this.prismaService.taskAudit.createMany({
        data: auditedTasks,
      }),
    ]);
  }

  private async updateTaskPosition(
    task_id: string,
    new_task_position: number,
    current_task_position: number
  ) {
    const isMovedUp = new_task_position < current_task_position;
    const [lowBound, upperBound] = isMovedUp
      ? [new_task_position, current_task_position]
      : [current_task_position, new_task_position];

    const tasks = await this.prismaService.task.findMany({
      where: {
        task_position: { gte: lowBound, lte: upperBound },
        task_id: { not: task_id },
      },
    });
    const auditedTasks: Prisma.TaskAuditCreateManyInput[] = tasks.map(
      (task) => ({
        ...excludeKeys(task, 'created_at', 'is_deleted', 'column_id'),
      })
    );
    const updatedTasks: Prisma.TaskUpdateInput[] = tasks.map(
      ({ task_id, task_position }) => ({
        task_id,
        task_position: isMovedUp ? ++task_position : --task_position,
      })
    );
    return { updatedTasks, auditedTasks };
  }
}
