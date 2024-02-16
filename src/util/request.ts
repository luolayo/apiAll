import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Logger } from '@nestjs/common';

/**
 * @description 创建请求服务
 * @param url
 * @param headers
 * @param name
 * @returns {AxiosInstance} service
 */
const createService = (
  url: string,
  headers?: any,
  name?: string,
): AxiosInstance => {
  if (!headers) {
    headers = {
      'x-forwarded-for': createIp(),
      'WL-Proxy-Client-IP': createIp(),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2',
    };
  }
  const service: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 10000,
  });
  service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers = headers;
    return config;
  }, (error: AxiosError) => {
    const logger = new Logger(name);
    logger.error(error);
    return;
  });
  service.interceptors.response.use((response: AxiosResponse) => {
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response;
  }, (error: AxiosError) => {
    const logger = new Logger(name);
    logger.error(error);
    return;
  });
  return service;
};

/**
 * @description get请求
 * @param name
 * @param url
 * @param data
 * @param headers
 */
export const get = async <T>(name: string, url: string, data?: any, headers?: any): Promise<AxiosResponse<T>> => {
  const service = createService(url, headers, name);
  return await service.get(url, { params: data });
};

/**
 * @description post请求
 * @param name
 * @param url
 * @param data
 * @param headers
 * @constructor
 */
export const post = async <T>(name: string, url: string, data?: any, headers?: any): Promise<AxiosResponse<T>> => {
  const service = createService(url, headers, name);
  return await service.post(url, new URLSearchParams(data));
};

/**
 * @description 随机生成IP
 * @returns {string} ip
 */
export const createIp = (): string => {
  const a = Math.round(Math.random() * 250) + 1,
    b = Math.round(Math.random() * 250) + 1,
    c = Math.round(Math.random() * 240) + 1,
    d = Math.round(Math.random() * 240) + 1;
  if (a == 127 || a == 10 || a == 172 || a == 192) {
    return createIp();
  }
  return [a, b, c, d].join('.');
};
