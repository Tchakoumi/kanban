import { IStatistics } from '@kanban/interfaces';
import useSWR from 'swr';

export function useStatistics() {
  return useSWR<IStatistics>(`/statistics`);
}
