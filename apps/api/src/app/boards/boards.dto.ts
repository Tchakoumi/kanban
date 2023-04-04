import {
  IBoard,
  IBoardDetails,
  ICreateBoard,
  IEditBoard,
} from '@kanban/interfaces';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  ColumnDetails,
  CreateColumnDto,
  UpdateColumnDto,
} from '../columns/columns.dto';

export class CreateColumnWithBoard extends OmitType(CreateColumnDto, [
  'board_id',
]) {}

export class CreateBoardDto implements ICreateBoard {
  @IsString()
  @MaxLength(45)
  @ApiProperty({ maxLength: 45 })
  board_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateColumnWithBoard)
  @ApiProperty({ type: CreateColumnWithBoard, isArray: true })
  newColumns: CreateColumnWithBoard[];
}

export class UpdateColumnWithBoard extends UpdateColumnDto {
  @IsUUID()
  @ApiProperty()
  column_id: string;
}

export class UpdateBoardDto
  extends PartialType(CreateBoardDto)
  implements Omit<IEditBoard, 'board_id'>
{
  @ApiProperty()
  @IsString({ each: true })
  deletedColumnIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateColumnWithBoard)
  @ApiProperty({ type: UpdateColumnWithBoard, isArray: true })
  updatedColumns: UpdateColumnWithBoard[];
}

export class Board implements IBoard {
  @ApiProperty({ type: String })
  board_id: string;

  @ApiProperty({ type: String })
  board_name: string;
}

export class BoardDetails extends Board implements IBoardDetails {
  @ApiProperty({ type: ColumnDetails, isArray: true })
  columns: ColumnDetails[];
}
