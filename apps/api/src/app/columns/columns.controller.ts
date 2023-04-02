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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Column, CreateColumnDto, UpdateColumnDto } from './columns.dto';
import { ColumnsService } from './columns.service';

@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  @ApiResponse({
    type: Column,
    isArray: true,
  })
  @ApiOperation({ description: 'Get all columns under a given board' })
  async getColumns(@Query('board_id') board_id: string) {
    return await this.columnsService.findAll(board_id);
  }

  @Get(':column_id')
  @ApiResponse({ type: Column })
  @ApiOperation({ description: 'Get one column' })
  async getColumn(@Param('column_id') column_id: string) {
    return await this.columnsService.findOne(column_id);
  }

  @Post('new')
  @ApiResponse({ type: Column })
  @ApiOperation({ description: 'Get given column data' })
  async createColumn(@Body() newColumn: CreateColumnDto) {
    try {
      return await this.columnsService.create(newColumn);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error creating new column: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':column_id/edit')
  @ApiOperation({ description: 'Update a given column data' })
  async updateColumn(
    @Param('column_id') columnId: string,
    @Body() newColumn: UpdateColumnDto
  ) {
    try {
      return await this.columnsService.update(columnId, newColumn);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error updating column: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':column_id/delete')
  @ApiOperation({ description: 'Delete a given column data' })
  async deleteColumn(@Param('column_id') columnId: string) {
    try {
      return await this.columnsService.delete(columnId);
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error deleting column: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
