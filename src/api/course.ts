import { apiClient, handleApiError } from './config'
import type { CourseVideoRequest, ApproveVideoResponse, DisapproveVideoResponse } from '@/tanstack/types'

export const courseApi = {
  async getUnapprovedVideos(): Promise<CourseVideoRequest[]> {
    try {
      const response = await apiClient.get<CourseVideoRequest[]>('/course/unapproved-videos')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch unapproved videos')
      throw error
    }
  },

  async approveVideo(id: number): Promise<ApproveVideoResponse> {
    try {
      const response = await apiClient.post<ApproveVideoResponse>(`/course-video/approve/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to approve video')
      throw error
    }
  },

  async disapproveVideo(id: number): Promise<DisapproveVideoResponse> {
    try {
      const response = await apiClient.post<DisapproveVideoResponse>(`/course-video/dissapprove/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to disapprove video')
      throw error
    }
  }
}