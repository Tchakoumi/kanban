import { http } from '@kanban/axios';
import { IColumn, ICreateColumn } from '@kanban/interfaces';

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

export async function createNewColumns(newColumn: ICreateColumn) {
  const { data } = await http.post<IColumn>(`/columns/new`, newColumn);
  return data;
}

export async function updateColumn(
  column_id: string,
  updateColumn: Partial<IColumn[]>
) {
  await http.put(`/columns/${column_id}/edit`, updateColumn);
}
