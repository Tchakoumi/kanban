import { decrypt, encrypt } from '@kanban/encrypter';
import axios, { AxiosInstance } from 'axios';

export function getAxiosInstance(): AxiosInstance {
  const API_BASE_URL =
    process.env['NODE_ENV'] === 'production'
      ? 'https://kanban-api.ingl.io/api'
      : process.env['NX_API_BASE_URL']
      ? `${process.env['NX_API_BASE_URL']}/api`
      : 'http://localhost:4000/api';
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });
  axiosInstance.interceptors.request.use(
    (request) => {
      request = {
        ...request,
        params: request.params ? { data: encrypt(request.params) } : undefined,
        data: request.data ? { data: encrypt(request.data) } : undefined,
      };
      return request;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      response = {
        ...response,
        data: response.data ? decrypt(response.data) : {},
      };
      return response;
    },
    (error) => {
      return Promise.reject(
        error.response?.data ||
          error.message ||
          'Sorry, this error is not supposed to happen'
      );
    }
  );

  return axiosInstance;
}

export const http = getAxiosInstance();
