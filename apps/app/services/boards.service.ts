//TODO: FILE TO WORK IN

import { IBoard } from '@kanban/interfaces';
import { useState } from 'react';

import useSWR from 'swr';

export function useActiveBoard(board_id: string) {
  const [data, setData] = useState<{
    activeBoard: IBoard | undefined;
    isLoading: boolean;
    isError: boolean;
  }>({
    activeBoard: undefined,
    isLoading: true,
    isError: false,
  });
  if (board_id === undefined)
    return {
      activeBoard: undefined,
      isLoading: false,
      isError: false,
    };
  //TODO: call api to load activeBoard
  //   const { data, error, isLoading } = useSWR(`/api/boards/${board_id}`, fetcher);
  setTimeout(() => {
    setData({
      activeBoard: { board_id, board_name: 'Platform Launch' } as IBoard,
      isLoading: false,
      isError: false,
    });
  }, 3000);
  return data;
}

export function useBoards() {
  return useSWR<IBoard[]>(`/boards`);
}
