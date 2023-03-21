import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './boards.dto';
import { BoardsService } from './boards.service';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  async getBoards() {
    return await this.boardService.findAll();
  }

  @Get(':board_id')
  async getBoard(@Param('board_id') board_id: string) {
    return await this.boardService.findOne(board_id);
  }

  @Post('new')
  async createBoard(@Body() newBoard: CreateBoardDto) {
    try {
      return await this.boardService.create(newBoard);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error creating new board: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
