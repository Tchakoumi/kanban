import { IBoard, IBoardDetails } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateBoardDto } from './boards.dto';

@Injectable()
export class BoardsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<IBoard[]> {
    const boards = await this.prismaService.board.findMany({
      where: { is_deleted: false },
    });
    return boards.map(({ board_id, board_name }) => ({ board_id, board_name }));
  }

  async findOne(board_id: string): Promise<IBoardDetails> {
    const { Columns, ...board } =
      await this.prismaService.board.findUniqueOrThrow({
        select: {
          board_id: true,
          board_name: true,
          Columns: { include: { Tasks: { include: { Subtasks: true } } } },
        },
        where: { board_id },
      });
    return {
      ...board,
      columns: Columns.map(({ Tasks, ...column }) => ({
        ...excludeKeys(column, 'board_id', 'created_at', 'is_deleted'),
        tasks: Tasks.map(({ Subtasks, ...task }) => {
          const [total_done_subtasks, total_undone_subtasks] = Subtasks.reduce(
            ([totalDone, totalUndone], { is_done }) =>
              is_done ? [++totalDone, totalUndone] : [totalDone, ++totalUndone],
            [0, 0]
          );
          return {
            total_done_subtasks,
            total_undone_subtasks,
            ...excludeKeys(task, 'created_at', 'is_deleted'),
          };
        }),
      })),
    };
  }

  async create(newBoard: CreateBoardDto) {
    const board = await this.prismaService.board.create({
      select: { board_id: true, board_name: true },
      data: newBoard,
    });
    return board;
  }

  async update(board_id: string, updateData: Prisma.BoardUpdateInput) {
    const { board_name } = await this.prismaService.board.findUniqueOrThrow({
      select: { board_name: true },
      where: { board_id },
    });
    await this.prismaService.board.update({
      data: {
        ...updateData,
        BoardAudits: {
          create: {
            board_name,
          },
        },
      },
      where: { board_id },
    });
  }
}
