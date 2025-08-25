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
      console.log('API call - ID type:', typeof id, 'Value:', id)
      
      // Validate ID
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`Invalid teacher ID: ${id}`)
      }
      
      // Convert ID to string as backend might expect "numeric string"
      const idString = String(id)
      console.log('Converted ID to string:', idString)
      
      // Use the correct endpoint with authentication prefix
      const url = `/authentication/teacher/${idString}`
      console.log('Making API call to:', url)
      
      const response = await apiClient.get(url)
      console.log('API response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('API Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })
      handleApiError(error, 'Failed to fetch teacher request details')
      throw error
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
  },

  async getApprovedTeachers() {
    try {
      const response = await apiClient.get('/authentication/approvedTeachers')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch approved teachers')
      throw error
    }
  },

  async getAllStudents() {
    try {
      const response = await apiClient.get('/authentication/students')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch students')
      throw error
    }
  },

  async deleteType(typeId: number) {
    try {
      const response = await apiClient.delete(`/types/${typeId}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to delete content type')
      throw error
    }
  }
}