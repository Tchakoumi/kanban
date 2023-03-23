import { ITask } from '@kanban/interfaces';
import axios from 'axios';

describe('GET /tasks', () => {
  it('should return an array of tasks', async () => {
    const res = await axios.get<ITask[]>(`/tasks`);

    expect(res.status).toBe(200);
    const tasks = res.data;
    expect(Array.isArray(tasks)).toBeTruthy();
    tasks.forEach((task) => {
      expect(task).toEqual({
        column_id: expect.any(String),
        task_description: expect.any(String),
        task_id: expect.any(String),
        task_position: expect.any(Number),
        task_title: expect.any(String),
        total_done_subtasks: expect.any(Number),
        total_undone_subtasks: expect.any(Number),
      });
    });
  });
});
