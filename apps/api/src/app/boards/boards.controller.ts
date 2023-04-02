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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Board,
  BoardDetails,
  CreateBoardDto,
  UpdateBoardDto,
} from './boards.dto';
import { BoardsService } from './boards.service';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  @ApiResponse({ type: Board, isArray: true })
  @ApiOperation({ description: 'Get all boards' })
  async getBoards() {
    return await this.boardService.findAll();
  }

  @Get(':board_id')
  @ApiResponse({ type: Board })
  @ApiOperation({ description: 'Get a given board' })
  async getBoard(@Param('board_id') board_id: string) {
    return await this.boardService.findOne(board_id);
  }

  @Get(':board_id/details')
  @ApiResponse({ type: BoardDetails })
  @ApiOperation({
    description: 'Get a given board name and columns with thier nested tasks',
  })
  async getBoardDetails(@Param('board_id') board_id: string) {
    return await this.boardService.findOneWithChildren(board_id);
  }

  @Post('new')
  @ApiResponse({ type: Board })
  @ApiOperation({ description: 'Create and returns a given board' })
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
  @ApiOperation({ description: 'Update a given board data' })
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
  @ApiOperation({ description: 'Delete a given board' })
  async deleteBoard(@Param('board_id') boardId: string) {
    try {
      return await this.boardService.delete(boardId);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error deleting board: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
