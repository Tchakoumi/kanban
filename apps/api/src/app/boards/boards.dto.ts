import { ICreateBoard } from '@kanban/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBoardDto implements ICreateBoard {
  @IsString()
  @MaxLength(45)
  @ApiProperty({ maxLength: 45 })
  board_name: string;
}

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
