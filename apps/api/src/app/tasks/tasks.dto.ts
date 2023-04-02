import { ICreateSubtask, ICreateTask, IEditTask } from '@kanban/interfaces';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator';

export class CreateSubtaskDto implements ICreateSubtask {
  @IsString()
  @ApiProperty()
  subtask_title: string;
}

export class CreateTaskDto implements ICreateTask {
  @IsUUID()
  @ApiProperty()
  column_id: string;

  @IsString()
  @ApiProperty()
  task_title: string;

  @IsString()
  @ApiProperty()
  task_description: string;

  @IsArray()
  @Type(() => CreateSubtaskDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateSubtaskDto, isArray: true })
  newSubtasks: CreateSubtaskDto[];
}

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
  @IsUUID()
  @ApiProperty()
  subtask_id: string;

  @IsBoolean()
  @ApiPropertyOptional()
  is_done?: boolean;
}

export class UpdateTaskDto
  extends PartialType(CreateTaskDto)
  implements Omit<IEditTask, 'task_id'>
{
  @IsNumber()
  @ApiPropertyOptional()
  task_position?: number;

  @ApiProperty()
  @IsString({ each: true })
  deletedSubtaskIds: string[];

  @IsArray()
  @Type(() => UpdateSubtaskDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: UpdateSubtaskDto, isArray: true })
  updatedSubtasks: UpdateSubtaskDto[];
}
