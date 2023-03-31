import { http } from '@kanban/axios';
import {
  ICreateTask,
  IEditTask,
  ISubtask,
  ITask,
  ITaskDetails,
} from '@kanban/interfaces';

import useSWR from 'swr';

export function useSubtasks(task_id: string) {
  return useSWR<ITaskDetails>(
    `/tasks/${task_id?.length === 0 ?? task_id}/details`
  );
}

export async function createNewTask(newTask: ICreateTask) {
  const { data } = await http.post<ITask>('/tasks/new', newTask);
  return data;
}

export async function updateTask(task_id: string, updateData: IEditTask) {
  await http.put(`/tasks/${task_id}/edit`, updateData);
}

export async function deleteTask(task_id: string) {
  await http.put(`/tasks/${task_id}/delete`);
}

export async function updateSubtask(
  subtask_id: string,
  updateData: Partial<ISubtask>
) {
  await http.put('/tasks/subtasks/edit', { ...updateData, subtask_id });
}
