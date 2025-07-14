import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { JwtService } from '@/core/services/JwtService'
import { ElMessage } from 'element-plus'

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_PREFIX: 'Bearer'
} as const

// API Configuration
export const API_CONFIG = {
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const

// Create Axios instance
export const apiClient: AxiosInstance = axios.create(API_CONFIG)

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests
    const token = JwtService.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
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

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
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
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      })
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshToken = JwtService.getRefreshToken()
        if (refreshToken) {
          // You can implement token refresh logic here
          // For now, just logout the user
          JwtService.destroyTokens()
          window.location.href = '/login'
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        JwtService.destroyTokens()
        window.location.href = '/login'
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    
    // Show error message to user
    if (error.response?.status !== 401) {
      ElMessage.error(errorMessage)
    }
    
    return Promise.reject(error)
  }
)

// Generic error handler
export const handleApiError = (error: any, defaultMessage: string = 'API request failed') => {
  const message = error.response?.data?.message || error.message || defaultMessage
  console.error('API Error:', error)
  ElMessage.error(message)
  throw new Error(message)
}

// Generic response handler
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

// Export types for use in other files
export type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse }