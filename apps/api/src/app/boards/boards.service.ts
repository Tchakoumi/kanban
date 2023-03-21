import { IBoard } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<IBoard[]> {
    const boards = await this.prismaService.board.findMany({
      where: { is_deleted: false },
    });
    return boards.map(({ board_id, board_name }) => ({ board_id, board_name }));
  }
}
