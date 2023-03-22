import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto, UpdateBoardDto } from './boards.dto';
import { BoardsService } from './boards.service';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  async getBoards() {
    return await this.boardService.findAll();
  }

  @Get(':board_id/details')
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

  @Put(':board_id/edit')
  async updateBoard(
    @Param('board_id') boardId: string,
    @Body() updateData: UpdateBoardDto
  ) {
    try {
      return await this.boardService.update(boardId, updateData);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error updating board: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':board_id/delete')
  async deleteBoard(@Param('board_id') boardId: string) {
    try {
      return await this.boardService.update(boardId, { is_deleted: true });
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error updating board: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
