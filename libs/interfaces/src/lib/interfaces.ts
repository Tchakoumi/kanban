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
  task_description: string;
  newSubtasks: ICreateSubtask[];
}

export interface IEditTask extends Partial<ICreateTask> {
  task_position?: number;
  deletedSubtaskIds: string[];
  updatedSubtasks: Partial<ISubtask>[];
  //TODO: Verify if these should be added
  newTasks: ICreateSubtask[];
  task_id: string;
}

export interface ITask extends Omit<ICreateTask, 'newSubtasks'> {
  task_id: string;
  task_position: number;
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
  column_position: number;
}

export interface IColumnDetails extends IColumn {
  tasks: ITask[];
}

export interface ICreateBoard {
  board_name: string;
  newColumns: ICreateColumn[];
}

export interface IEditBoard extends Partial<ICreateBoard> {
  deletedColumnIds: string[];
  updatedColumns: Partial<IColumn>[];
}

export interface IBoard extends Omit<ICreateBoard, 'newColumns'> {
  board_id: string;
}

export interface IBoardDetails extends IBoard {
  columns: IColumnDetails[];
}
export interface IStatistic {
  datetime: Date;
  count: number;
}
export interface IStatistics {
  movedTasksStats: IStatistic[];
  updatedTaskStats: IStatistic[];
}
