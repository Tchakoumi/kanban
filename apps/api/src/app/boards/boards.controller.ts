import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get('/')
  async getBoards() {
    return await this.boardService.findAll();
  }
}
