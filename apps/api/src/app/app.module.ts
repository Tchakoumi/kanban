import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [PrismaModule, BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
