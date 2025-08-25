import { apiClient, handleApiError } from './config'
import type { ContentType, CreateTypeRequest, CreateTypeResponse } from '@/tanstack/types'

export const typesApi = {
  async getTypes(): Promise<ContentType[]> {
    try {
      const response = await apiClient.get<ContentType[]>('/types')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch content types')
      throw error
    }
  },

  async createType(data: CreateTypeRequest): Promise<CreateTypeResponse> {
    try {
      const response = await apiClient.post<CreateTypeResponse>('/types', data)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to create content type')
      throw error
    }
  }
}