import { Controller, Get, Param } from '@nestjs/common';
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
}
