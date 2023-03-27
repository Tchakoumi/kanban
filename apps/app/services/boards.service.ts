//TODO: FILE TO WORK IN

import { http } from '@kanban/axios';
import { IBoard } from '@kanban/interfaces';

import useSWR from 'swr';

export function useBoards() {
  return useSWR<IBoard[]>(`/boards`);
}

export function useActiveBoard(board_id: string): {
  activeBoard: IBoard | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<IBoard>(`/boards/${board_id}`);
  return { activeBoard: data, isLoading, isError: Boolean(error) };
}

export async function deleteBoard(board_id: string) {
  await http.delete(`/boards/${board_id}/delete`);
}
