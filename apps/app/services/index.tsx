import { http } from '@kanban/axios';
import { IBoard } from '@kanban/interfaces';

export async function fetcher(url: string) {
  const { data } = await http.get(url);
  return data;
}

export async function getBoards() {
  const { data } = await http.get<IBoard[]>('/boards');
  return data;
}
export async function deleteBoard(board_id: string) {
  await http.delete(`/boards/${board_id}/delete`);
}

export * from './tasks.service';
export * from './boards.service';
