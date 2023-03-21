import { IBoard } from '@kanban/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { BoardsService } from './boards.service';

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsService, PrismaService],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be Array<IBoard>', async () => {
    const boards = await service.findAll();
    expect(Array.isArray(boards)).toBeTruthy();
    const object: IBoard = { board_id: '', board_name: '' };
    boards.forEach((board) => {
      Object.keys(object).forEach((key) => {
        expect(Object.hasOwnProperty.call(board, key)).toBeTruthy();
      });
    });
  });
});
