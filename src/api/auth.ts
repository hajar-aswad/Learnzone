import { apiClient, handleApiError } from './config'
import type { LoginCredentials, AuthResponse } from '@/tanstack/types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/authentication/login', credentials)
      return response.data
    } catch (error) {
      handleApiError(error, 'Login failed')
      throw error
    }
  },

  async getTeacherRequests() {
    try {
      const response = await apiClient.get('/authentication/pendingTeacherRequests')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch teacher requests')
    }
  },

  async getTeacherRequestById(id: number) {
    try {
      const response = await apiClient.get(`/authentication/teacher/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch teacher request details')
    }
  },

  async approveTeacherRequest(id: number) {
    try {
      const response = await apiClient.patch(`/authentication/approveTeacher/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to approve teacher request')
    }
  },

  async rejectTeacherRequest(id: number) {
    try {
      const response = await apiClient.delete(`/authentication/disapproveTeacher/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to reject teacher request')
    }
  },

  async getFile(filename: string) {
    try {
      const response = await apiClient.get(`/uploads/teacher/${filename}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch file')
    }
  }
}