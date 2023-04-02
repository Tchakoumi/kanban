import {
  IColumn,
  IColumnDetails,
  ICreateColumn
} from '@kanban/interfaces';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsHexColor,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Task } from '../tasks/tasks.dto';

export class CreateColumnDto implements ICreateColumn {
  @IsUUID()
  @ApiProperty()
  board_id: string;

  @IsString()
  @MaxLength(45)
  @ApiProperty({ maxLength: 45 })
  column_title: string;

  @IsHexColor()
  @ApiProperty({ description: 'Hexadecimal color code', example: '#ba3925' })
  column_color_code: string;
}

export class UpdateColumnDto extends PartialType(
  OmitType(CreateColumnDto, ['board_id'])
) {
  @IsNumber()
  @ApiPropertyOptional()
  column_position?: number;
}

export class Column implements IColumn {
  @ApiProperty({ type: String })
  column_id: string;

  @ApiProperty({ type: Number })
  column_position: number;

  @ApiProperty({ type: String })
  board_id: string;

  @ApiProperty({ type: String })
  column_title: string;

  @ApiProperty({ type: String })
  column_color_code: string;
}

export class ColumnDetails implements IColumnDetails {
  @ApiProperty({ type: String })
  column_id: string;

  @ApiProperty({ type: Number })
  column_position: number;

  @ApiProperty({ type: String })
  board_id: string;

  @ApiProperty({ type: String })
  column_title: string;

  @ApiProperty({ type: String })
  column_color_code: string;

  @ApiProperty({ type: Task, isArray: true })
  tasks: Task[];
}
