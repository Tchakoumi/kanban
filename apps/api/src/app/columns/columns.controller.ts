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
import { CreateColumnDto } from './columns.dto';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  async getColumns() {
    return await this.columnsService.findAll();
  }

  @Get(':column_id')
  async getColumn(@Param('column_id') column_id: string) {
    return await this.columnsService.findOne(column_id);
  }

  @Post('new')
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
  async updateColumn(
    @Param('column_id') columnId: string,
    @Body() newColumn: CreateColumnDto
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
  async deleteColumn(@Param('column_id') columnId: string) {
    try {
      return await this.columnsService.update(columnId, { is_deleted: true });
    } catch (error) {
      throw new HttpException(
        `Oops! They was an error deleting column: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
