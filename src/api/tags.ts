import { apiClient, handleApiError } from './config'

// Admin functions
export async function createTag(tagData: { name: string; typeId: number }) {
  try {
    const response = await apiClient.post('/tags', tagData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create tag')
    throw error
  }
}

export async function getAllTags() {
  try {
    const response = await apiClient.get('/tags/admin/all')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch tags')
    throw error
  }
}

export async function getTagById(tagId: number) {
  try {
    const response = await apiClient.get(`/tags/admin/${tagId}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch tag')
    throw error
  }
}

export async function updateTag(tagId: number, tagData: { name?: string; typeId?: number }) {
  try {
    const response = await apiClient.put(`/tags/admin/${tagId}`, tagData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update tag')
    throw error
  }
}

export async function deleteTag(tagId: number) {
  try {
    const response = await apiClient.delete(`/tags/admin/${tagId}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete tag')
    throw error
  }
}

// Teacher function
export async function getTagsByType() {
  try {
    const response = await apiClient.get('/tags/type')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch tags by type')
    throw error
  }
}
