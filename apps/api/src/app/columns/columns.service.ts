import { IColumn } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateColumnDto, UpdateColumnDto } from './columns.dto';

@Injectable()
export class ColumnsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(board_id: string): Promise<IColumn[]> {
    const columns = await this.prismaService.column.findMany({
      orderBy: { column_position: 'asc' },
      where: { is_deleted: false, board_id },
    });
    return columns.map((column) =>
      excludeKeys(column, 'created_at', 'is_deleted')
    );
  }

  async findOne(column_id: string): Promise<IColumn> {
    const column = await this.prismaService.column.findUniqueOrThrow({
      where: { column_id },
    });
    return excludeKeys(column, 'created_at', 'is_deleted');
  }

  async create({ board_id, ...newColumn }: CreateColumnDto) {
    const numberOfColumns = await this.prismaService.column.count({
      where: { board_id },
    });
    const column = await this.prismaService.column.create({
      data: {
        ...newColumn,
        Board: { connect: { board_id } },
        column_position: numberOfColumns + 1,
      },
    });
    return excludeKeys(column, 'created_at', 'is_deleted');
  }

  async update(
    column_id: string,
    { column_position, ...updateData }: UpdateColumnDto
  ) {
    const column = await this.prismaService.column.findUniqueOrThrow({
      where: { column_id },
    });

    const hasColumnPositionChanged =
      column_position && column_position !== column.column_position;
    const { updatedColumns, auditedColumns } = hasColumnPositionChanged
      ? await this.updateColumnPosition(
          column_id,
          column_position,
          column.column_position
        )
      : { updatedColumns: [], auditedColumns: [] };

    await this.prismaService.$transaction([
      this.prismaService.column.update({
        data: {
          ...updateData,
          column_position,
          ColumnAudits: {
            create: excludeKeys(column, 'created_at', 'column_id', 'board_id'),
          },
        },
        where: { column_id },
      }),
      ...updatedColumns.map(({ column_id, column_position }) =>
        this.prismaService.column.update({
          data: { column_position },
          where: { column_id: column_id as string },
        })
      ),
      this.prismaService.columnAudit.createMany({
        data: auditedColumns,
      }),
    ]);
  }

  private async updateColumnPosition(
    column_id: string,
    new_column_position: number,
    current_column_position: number
  ) {
    const isMovedLeft = new_column_position < current_column_position;
    const [lowBound, upperBound] = isMovedLeft
      ? [new_column_position, current_column_position]
      : [current_column_position, new_column_position];

    const columns = await this.prismaService.column.findMany({
      where: {
        column_position: { gte: lowBound, lte: upperBound },
        column_id: { not: column_id },
      },
    });
    const auditedColumns: Prisma.ColumnAuditCreateManyInput[] = columns.map(
      (task) => ({
        ...excludeKeys(task, 'created_at', 'is_deleted', 'board_id'),
      })
    );
    const updatedColumns: Prisma.ColumnUpdateInput[] = columns.map(
      ({ column_id, column_position }) => ({
        column_id,
        column_position: isMovedLeft ? ++column_position : --column_position,
      })
    );
    return { updatedColumns, auditedColumns };
  }

  async delete(column_id: string) {
    const column = await this.prismaService.column.findUniqueOrThrow({
      where: { column_id },
    });
    await this.prismaService.column.update({
      data: {
        is_deleted: true,
        ColumnAudits: {
          create: excludeKeys(column, 'created_at', 'column_id', 'board_id'),
        },
      },
      where: { column_id },
    });
  }
}
