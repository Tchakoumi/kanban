import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';

import { AppController } from './app.controller';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TasksModule } from './tasks/tasks.module';
import * as shell from 'shelljs';

@Module({
  imports: [
    PrismaModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('Hello world', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      shell.exec(`npx prisma migrate dev --name deploy`);
      shell.exec(`npx prisma migrate deploy`);
    }
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
