import { IBoard, IBoardDetails } from '@kanban/interfaces';
import axios from 'axios';

describe('GET /boards', () => {
  it('Should return an array of boards', async () => {
    const res = await axios.get<IBoard[]>(`/boards`);
    expect(res.status).toBe(200);
    const boards = res.data;
    expect(Array.isArray(boards)).toBeTruthy();
    boards.forEach((board) => {
      expect(board).toEqual({
        board_id: expect.any(String),
        board_name: expect.any(String),
      });
    });
  });

  it("should return board's name, columns and comlun's tasks", async () => {
    const boardRes = await axios.get<IBoard[]>(`/boards`);
    expect(boardRes.status).toBe(200);
    const boards = boardRes.data;

    const res = await axios.get<IBoardDetails>(
      `/boards/${boards[0].board_id}/details`
    );

    expect(res.status).toBe(200);
    const boardDetails = res.data;
    expect(boardDetails).toEqual({
      columns: expect.any(Array),
      board_id: expect.any(String),
      board_name: expect.any(String),
    });
    const { columns } = boardDetails;
    columns.forEach((column) => {
      expect(column).toEqual({
        tasks: expect.any(Array),
        column_id: expect.any(String),
        column_title: expect.any(String),
        column_position: expect.any(Number),
        column_color_code: expect.any(String),
      });
      const { tasks } = column;
      tasks.forEach((task) =>
        expect(task).toEqual({
          task_id: expect.any(String),
          column_id: expect.any(String),
          task_title: expect.any(String),
          task_position: expect.any(Number),
          task_description: expect.any(String),
          total_done_subtasks: expect.any(Number),
          total_undone_subtasks: expect.any(Number),
        })
      );
    });
  });
});
