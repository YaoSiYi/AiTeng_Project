import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Message } from '@arco-design/web-vue';
import router from '@/router';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse): any => {
    const { code, message } = response.data;

    if (code === 200) {
      return response.data;
    }

    Message.error(message || '请求失败');
    return Promise.reject(new Error(message || '请求失败'));
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          Message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          router.push('/login');
          break;
        case 403:
          Message.error('没有权限访问');
          break;
        case 404:
          Message.error('请求的资源不存在');
          break;
        case 500:
          Message.error(data?.message || '服务器内部错误');
          break;
        default:
          Message.error(data?.message || '请求失败');
      }
    } else {
      Message.error('网络错误，请检查网络连接');
    }

    return Promise.reject(error);
  }
);

export default service;

export function typedPost<T>(url: string, data?: unknown) {
  return service.post(url, data) as Promise<ApiResponse<T>>;
}

export function typedGet<T>(url: string) {
  return service.get(url) as Promise<ApiResponse<T>>;
}
