import { apiClient, handleApiError } from './config'
import type { LoginCredentials, AuthResponse } from '@/tanstack/types'

export const authApi = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/authentication/login', credentials)
      return response.data
    } catch (error) {
      handleApiError(error, 'Login failed')
      throw error
    }
  },

  // Get teacher requests
  async getTeacherRequests() {
    try {
      const response = await apiClient.get('/authentication/teacherRequest')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch teacher requests')
    }
  },

  // Get teacher request by ID
  async getTeacherRequestById(id: number) {
    try {
      const response = await apiClient.get(`/teacher/teacherrequestbyid/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch teacher request details')
    }
  },

  // Approve teacher request
  async approveTeacherRequest(id: number) {
    try {
      const response = await apiClient.patch(`/authentication/approveTeacher/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to approve teacher request')
    }
  },

  // Reject teacher request
  async rejectTeacherRequest(id: number) {
    try {
      const response = await apiClient.patch(`/authentication/rejectTeacher/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to reject teacher request')
    }
  },

  // Get file/certificate
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