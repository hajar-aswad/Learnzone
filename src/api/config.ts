import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { JwtService } from '@/core/services/JwtService'
import { ElMessage } from 'element-plus'


export const TOKEN_CONFIG = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_PREFIX: 'Bearer'
} as const


export const API_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const

export const apiClient: AxiosInstance = axios.create(API_CONFIG)

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = JwtService.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      })
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {

        const refreshToken = JwtService.getRefreshToken()
        if (refreshToken) {
          JwtService.destroyTokens()
          window.location.href = '/login'
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        JwtService.destroyTokens()
        window.location.href = '/login'
      }
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    
    if (error.response?.status !== 401) {
      ElMessage.error(errorMessage)
    }
    
    return Promise.reject(error)
  }
)

export const handleApiError = (error: any, defaultMessage: string = 'API request failed') => {
  const message = error.response?.data?.message || error.message || defaultMessage
  console.error('API Error:', error)
  ElMessage.error(message)
  throw new Error(message)
}

export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

export type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse }