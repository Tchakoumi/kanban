import { IColumn } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';
import { CreateColumnDto } from './columns.dto';

@Injectable()
export class ColumnsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(board_id: string): Promise<IColumn[]> {
    const columns = await this.prismaService.column.findMany({
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

  async create(newColumn: CreateColumnDto) {
    const numberOfColumns = await this.prismaService.column.count();
    const column = await this.prismaService.column.create({
      data: {
        ...newColumn,
        column_position: numberOfColumns,
      },
    });
    return excludeKeys(column, 'created_at', 'is_deleted');
  }

  async update(column_id: string, updateData: Prisma.ColumnUpdateInput) {
    const column = await this.prismaService.column.findUniqueOrThrow({
      where: { column_id },
    });
    await this.prismaService.column.update({
      data: {
        ...updateData,
        ColumnAudits: {
          create: excludeKeys(column, 'created_at', 'column_id', 'board_id'),
        },
      },
      where: { column_id },
    });
  }
}
