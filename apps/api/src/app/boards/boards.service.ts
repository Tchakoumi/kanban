import { IBoard } from '@kanban/interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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

  async findOne(board_id: string): Promise<IBoard> {
    const board = await this.prismaService.board.findUniqueOrThrow({
      select: { board_id: true, board_name: true },
      where: { board_id },
    });
    return board;
  }

  async create(newBoard: CreateBoardDto) {
    const board = await this.prismaService.board.create({
      select: { board_id: true, board_name: true },
      data: newBoard,
    });
    return board;
  }
}
