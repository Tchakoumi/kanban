import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';

@Module({
  imports: [PrismaModule, BoardsModule, ColumnsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
