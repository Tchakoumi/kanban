//TODO: FILE TO WORK IN

import { http } from '@kanban/axios';
import {
  IBoard,
  IBoardDetails,
  ICreateBoard,
  IEditBoard,
} from '@kanban/interfaces';

import useSWR from 'swr';

export function useBoards() {
  return useSWR<IBoard[]>(`/boards`);
}

export function useActiveBoard(board_id: string) {
  return useSWR<IBoard>(`/boards/${board_id}`);
}

export function useBoardDetails(board_id: string) {
  return useSWR<IBoardDetails>(`/boards/${board_id ?? ''}/details`);
}

export async function createNewBoard(newBoard: ICreateBoard) {
  const { data } = await http.post('/boards/new', newBoard);
  return data;
}

export async function updateBoard(board_id: string, updateData: IEditBoard) {
  await http.put(`/boards/${board_id}/edit`, updateData);
}

export async function deleteBoard(board_id: string) {
  await http.delete(`/boards/${board_id}/delete`);
}
