import { ICreateBoard, IEditBoard } from '@kanban/interfaces';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateColumnDto, UpdateColumnDto } from '../columns/columns.dto';

export class CreateColumnWithBoard extends OmitType(CreateColumnDto, [
  'board_id',
]) {}

export class CreateBoardDto implements ICreateBoard {
  @IsString()
  @MaxLength(45)
  @ApiProperty({ maxLength: 45 })
  board_name: string;

  @IsArray()
  @Type(() => CreateColumnDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: Array<CreateColumnWithBoard> })
  newColumns: CreateColumnWithBoard[];
}

export class UpdateBoardDto
  extends PartialType(CreateBoardDto)
  implements IEditBoard
{
  @ApiProperty()
  @IsString({ each: true })
  deletedColumnIds: string[];

  @IsArray()
  @ApiProperty()
  @Type(() => UpdateBoardDto)
  @ValidateNested({ each: true })
  updatedColumns: UpdateColumnDto[];
}
