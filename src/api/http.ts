import { apiClient, handleApiError } from './config'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export type ApiResponse<T> = {
  data: T
  status: number
  message?: string
}

function errorHandler(error: any) {
  handleApiError(error)
  throw error
}

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, config)
    return response.data
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}

async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config)
    return response.data
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}

async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config)
    return response.data
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}

async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config)
    return response.data
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url, config)
    return response.data
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}

export default {
  get,
  post,
  put,
  patch,
  delete: del
} 