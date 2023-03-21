import { ICreateBoard } from '@kanban/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBoardDto implements ICreateBoard {
  @IsString()
  @ApiProperty()
  board_name: string;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
