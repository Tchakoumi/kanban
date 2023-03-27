import { IColumn } from "@kanban/interfaces";

import useSWR from 'swr';

export function useColumns(board_id: string): {
  columns: IColumn[];
  areColumnsLoading: boolean;
  columnsError: string | undefined;
} {
  const { data, error, isLoading } = useSWR<IColumn[]>(
    `/columns?board_id=${board_id}`
  );
  return { columns: data, areColumnsLoading: isLoading, columnsError: error };
}
