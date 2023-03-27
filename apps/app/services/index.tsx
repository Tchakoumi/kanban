import { http } from '@kanban/axios';

export async function fetcher(url: string) {
  const { data } = await http.get(url);
  return data;
}


export * from './boards.service';
export * from './columns.service';
export * from './tasks.service';

