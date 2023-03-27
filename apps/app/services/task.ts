import { ISubtask } from '@kanban/interfaces';
import { useState } from 'react';

export function useSubtasks(task_id: string) {
  const [data, setData] = useState<{
    subTasks: ISubtask[];
    isLoading: boolean;
    error: string | undefined;
  }>({
    subTasks: [],
    isLoading: true,
    error: undefined,
  });

  //TODO: call api to load subtasks with data task_id
  //   const { data, error, isLoading } = useSWR(`/api/tasks/${task_id}`, fetcher);
  setTimeout(() => {
    setData({
      subTasks: [
        {
          is_done: true,
          subtask_id: 'wieosl',
          subtask_title: 'Make it rain heavily',
        },
        {
          is_done: false,
          subtask_id: 'wieodsl',
          subtask_title: 'Make it rain heavily',
        },
      ],
      isLoading: false,
      error: undefined,
    });
  }, 3000);
  return data;
}
