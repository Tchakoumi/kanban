export interface ICreateBoard {
  board_name: string;
}

export interface IBoard extends ICreateBoard {
  board_id: string;
}

export interface ICreateColumn {
  board_id: string;
  column_title: string;
  column_color_code: string;
}

export interface IColumn extends ICreateColumn {
  column_id: string;
}

export interface ICreateTask {
  column_id: string;
  task_title: string;
  task_position: number;
  task_description: string;
}

export interface ITask extends ICreateTask {
  task_id: string;
  total_done_subtasks: number;
  total_undone_subtasks: number;
}

export interface ICreateSubtask {
  task_id: string;
  subtask_title: string;
}

export interface ISubtask extends ICreateSubtask {
  subtask_id: string;
  is_done: boolean;
}
