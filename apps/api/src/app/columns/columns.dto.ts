import { ICreateColumn } from '@kanban/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateColumnDto implements ICreateColumn {
  @IsUUID()
  @ApiProperty()
  board_id: string;

  @IsString()
  @MaxLength(45)
  @ApiProperty({ maxLength: 45 })
  column_title: string;

  @IsInt()
  @ApiProperty()
  column_position: number;

  @IsHexColor()
  @ApiProperty({ description: 'Hexadecimal code' })
  column_color_code: string;
}
