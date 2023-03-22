import { ITask, ITaskDetails } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateTaskDto, EditTaskDto } from './tasks.dto';

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
      column_id,
      ...newTask
    }: EditTaskDto
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
    return this.prismaService.$transaction([
      this.prismaService.task.update({
        data: {
          ...newTask,
          Column: { connect: { column_id } },
          TaskAudits: {
            create: { ...excludeKeys(task, 'created_at', 'task_id') },
          },
          Subtasks: {
            updateMany: {
              data: { is_deleted: true },
              where: {
                OR: deletedSubtaskIds.map((subtask_id) => ({ subtask_id })),
              },
            },
            createMany: {
              data: newSubtasks,
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
    ]);
  }
}
