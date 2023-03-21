export interface ICreateSubtask {
  subtask_title: string;
}

export interface ISubtask extends ICreateSubtask {
  subtask_id: string;
  is_done: boolean;
}

export interface ICreateTask {
  column_id: string;
  task_title: string;
  task_position: number;
  task_description: string;
  newSubtasks: ICreateSubtask[];
}

export interface IEditTask extends Partial<ICreateTask> {
  deletedTaskIds: string[];
  updatedSubtasks: Partial<ISubtask>[];
}

export interface ITask extends Omit<ICreateTask, 'newSubtasks'> {
  task_id: string;
  total_done_subtasks: number;
  total_undone_subtasks: number;
}

export interface ITaskDetails extends ITask {
  subtasks: ISubtask[];
}

export interface ICreateColumn {
  column_title: string;
  column_color_code: string;
}

export interface IColumn extends ICreateColumn {
  column_id: string;
}

export interface ICreateBoard {
  board_name: string;
  newColumns: ICreateColumn[];
}

export interface IEditBoard extends Partial<ICreateBoard> {
  deletedColumnIds: string[];
  updatedColumns: Partial<ICreateColumn>[];
}

export interface IBoard extends ICreateBoard {
  board_id: string;
}
