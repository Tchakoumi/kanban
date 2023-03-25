import axios from 'axios';

export function fetcher(url) {
  return axios.get(url).then((res) => res.data);
}

export * from './useActiveBoard';
export * from './task';
