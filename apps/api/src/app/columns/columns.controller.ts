import { Controller, Get } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  async getColumns() {
    return await this.columnsService.findAll();
  }
}
