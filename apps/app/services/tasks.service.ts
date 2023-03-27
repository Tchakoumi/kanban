import { ISubtask, ITaskDetails } from '@kanban/interfaces';

import useSWR from 'swr';

export function useSubtasks(task_id: string): {
  subtasks: ISubtask[];
  isLoading: boolean;
  error: string | undefined;
} {
  const { data, error, isLoading } = useSWR<ITaskDetails>(
    `/tasks/${task_id}/details`
  );
  return {
    subtasks: data.subtasks,
    isLoading,
    error,
  };
}
