import { ICreateColumn } from '@kanban/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNumber,
  IsOptional,
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

  @IsHexColor()
  @ApiProperty({ description: 'Hexadecimal color code', example: '#ba3925' })
  column_color_code: string;
}

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  column_position?: number;
}
