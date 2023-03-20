import { decrypt, encrypt } from '@kanban/encrypter';
import axios, { AxiosInstance } from 'axios';

export function getAxiosInstance(): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: process.env['NX_API_BASE_URL'] || 'https://api-hh.ingl.io',
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
      console.log(error);
      return Promise.reject(
        error.response?.data || 'Sorry, this error is not supposed to happen'
      );
    }
  );

  return axiosInstance;
}

export const http = getAxiosInstance();
