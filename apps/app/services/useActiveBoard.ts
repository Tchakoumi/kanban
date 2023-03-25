//TODO: FILE TO WORK IN

import { IBoard, IColumn } from '@kanban/interfaces';
import { useState } from 'react';

// import useSWR from 'swr';
// import {fetcher} from '.';

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

export function useColumns(board_id: string): {
  columns: IColumn[];
  areColumnsLoading: boolean;
  columnsError: string | undefined;
} {
  const [data, setData] = useState<{
    columns: IColumn[];
    areColumnsLoading: boolean;
    columnsError: string | undefined;
  }>({
    columns: [],
    areColumnsLoading: true,
    columnsError: undefined,
  });

  if (board_id === undefined)
    return {
      columns: [],
      areColumnsLoading: false,
      columnsError: 'board_id cannot be undefined.',
    };

  setTimeout(() => {
    setData({
      columns: [
        {
          column_color_code: 'lsieos',
          column_id: 'ieowld',
          column_position: 2,
          column_title: 'todo',
        },
        {
          column_color_code: 'lsieos',
          column_id: 'ieowldo',
          column_position: 3,
          column_title: 'Doing',
        },
        {
          column_color_code: 'lsieos',
          column_id: 'ieowlsdo',
          column_position: 1,
          column_title: 'Done',
        },
      ],
      areColumnsLoading: false,
      columnsError: undefined,
    });
  }, 3000);
  return data;
}
