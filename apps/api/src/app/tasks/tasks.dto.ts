import {
    ICreateSubtask,
    ICreateTask,
    IEditTask
} from '@kanban/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean, IsNumber,
    IsOptional,
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
  @IsString()
  @ApiProperty()
  column_id: string;

  @IsString()
  @ApiProperty()
  task_title: string;

  @IsString()
  @ApiProperty()
  task_description: string;

  @IsArray()
  @ApiProperty()
  @Type(() => CreateSubtaskDto)
  @ValidateNested({ each: true })
  newSubtasks: CreateSubtaskDto[];
}

export class EditSubtaskDto extends PartialType(CreateSubtaskDto) {
  @IsUUID()
  @ApiProperty()
  subtask_id: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  is_done?: boolean;
}

export class EditTaskDto
  extends PartialType(CreateTaskDto)
  implements IEditTask
{
  @IsNumber()
  @ApiProperty()
  task_position: number;

  @IsString()
  @ApiProperty()
  deletedSubtaskIds: string[];

  @IsArray()
  @ApiProperty()
  @Type(() => EditSubtaskDto)
  @ValidateNested({ each: true })
  updatedSubtasks: EditSubtaskDto[];
}
