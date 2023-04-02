import { IBoard, IBoardDetails } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateBoardDto, UpdateBoardDto } from './boards.dto';

@Injectable()
export class BoardsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<IBoard[]> {
    const boards = await this.prismaService.board.findMany({
      where: { is_deleted: false },
    });
    return boards.map(({ board_id, board_name }) => ({ board_id, board_name }));
  }

  async findOne(board_id: string): Promise<IBoard> {
    const board = await this.prismaService.board.findUnique({
      select: { board_id: true, board_name: true },
      where: { board_id },
    });
    return board;
  }

  async findOneWithChildren(board_id: string): Promise<IBoardDetails> {
    const uniqueBoard = await this.prismaService.board.findUnique({
      select: {
        board_id: true,
        board_name: true,
        Columns: {
          include: {
            Tasks: {
              include: { Subtasks: true },
              orderBy: { task_position: 'asc' },
              where: { is_deleted: false },
            },
          },
          where: { is_deleted: false },
          orderBy: { column_position: 'asc' },
        },
      },
      where: { board_id },
    });
    if (!uniqueBoard) return null;
    const { Columns, ...board } = uniqueBoard;
    return {
      ...board,
      columns: Columns.map(({ Tasks, ...column }) => ({
        ...excludeKeys(column, 'created_at', 'is_deleted'),
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

  async create({ board_name, newColumns }: CreateBoardDto): Promise<IBoard> {
    const board = await this.prismaService.board.create({
      select: { board_id: true, board_name: true },
      data: {
        board_name,
        Columns: {
          createMany: {
            data: newColumns.map((column, index) => ({
              ...column,
              column_position: index + 1,
            })),
          },
        },
      },
    });
    return board;
  }

  async update(
    board_id: string,
    { board_name, newColumns, deletedColumnIds, updatedColumns }: UpdateBoardDto
  ) {
    const {
      board_name: oldName,
      _count: { Columns: numberOfColumns },
    } = await this.prismaService.board.findUniqueOrThrow({
      select: { board_name: true, _count: { select: { Columns: true } } },
      where: { board_id },
    });
    const auditedColumns = await this.prismaService.column.findMany({
      where: {
        OR: [
          ...deletedColumnIds,
          ...updatedColumns.map((_) => _.column_id),
        ].map((column_id) => ({ column_id })),
      },
    });
    await this.prismaService.$transaction([
      this.prismaService.board.update({
        data: {
          board_name,
          BoardAudits: {
            create: { board_name: oldName },
          },
          Columns: {
            createMany: {
              data: newColumns
                ? newColumns.map((column) => ({
                    ...column,
                    column_position: numberOfColumns + 1,
                  }))
                : [],
            },
            updateMany: {
              data: { is_deleted: true },
              where: {
                OR: deletedColumnIds.map((column_id) => ({ column_id })),
              },
            },
          },
        },
        where: { board_id },
      }),
      ...updatedColumns.map(({ column_id, ...newColumn }) =>
        this.prismaService.column.update({
          data: newColumn,
          where: { column_id },
        })
      ),
      this.prismaService.columnAudit.createMany({
        data: auditedColumns.map((column) =>
          excludeKeys(column, 'board_id', 'created_at')
        ),
      }),
    ]);
  }

  async delete(board_id: string) {
    const { board_name } = await this.prismaService.board.findUniqueOrThrow({
      select: { board_name: true },
      where: { board_id },
    });
    await this.prismaService.board.update({
      data: {
        is_deleted: true,
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
