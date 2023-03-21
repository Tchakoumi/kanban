import { IColumn } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { excludeKeys } from '../../utils';

@Injectable()
export class ColumnsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<IColumn[]> {
    const columns = await this.prismaService.column.findMany({
      where: { is_deleted: false },
    });
    return columns.map((column) =>
      excludeKeys(column, 'created_at', 'is_deleted')
    );
  }
}
