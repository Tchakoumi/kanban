import { ICreateSubtask, ICreateTask, IEditTask } from '@kanban/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
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
  @ApiProperty({ type: Array<CreateSubtaskDto> })
  newSubtasks: CreateSubtaskDto[];
}

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
  @IsUUID()
  @ApiProperty()
  subtask_id: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  is_done?: boolean;
}

export class UpdateTaskDto
  extends PartialType(CreateTaskDto)
  implements Omit<IEditTask, 'task_id'>
{
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  task_position?: number;

  @ApiProperty()
  @IsString({ each: true })
  deletedSubtaskIds: string[];

  @IsArray()
  @ApiProperty()
  @Type(() => UpdateSubtaskDto)
  @ValidateNested({ each: true })
  updatedSubtasks: UpdateSubtaskDto[];
}
