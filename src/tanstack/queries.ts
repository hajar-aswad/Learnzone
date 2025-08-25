import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '@/api/auth'
import * as tagsApi from '@/api/tags'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import type { ContentType, CourseVideoRequest, CreateTypeRequest, LoginCredentials, TeacherRequest, TeacherRequestDetail } from './types'
import { queryKeys } from './queryKeys'
import { courseApi } from '@/api/course'
import { typesApi } from '@/api/types'

// Auth Queries
export const useAuthQueries = () => {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  // Login mutation
  const useLoginMutation = () => {
    return useMutation({
      mutationFn: async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials)
        return response
      },
      onSuccess: (data) => {
        // Save token
        authStore.setUser(data)
        authStore.setAuthenticated(true)
        
        // Cache user data
        queryClient.setQueryData(queryKeys.auth.user, data)
        
        ElMessage.success('Login successful!')
      },
      onError: (error: any) => {
        const message = error.message || 'Login failed'
        ElMessage.error(message)
        authStore.setError(message)
      }
    })
  }

  return {
    useLoginMutation
  }
}

// Teacher Request Queries
export const useTeacherRequestQueries = () => {
  const queryClient = useQueryClient()

  // Get all teacher requests
  const useTeacherRequests = () => {
    return useQuery({
      queryKey: queryKeys.teacherRequests,
      queryFn: async (): Promise<TeacherRequest[]> => {
        const response = await authApi.getTeacherRequests()
        return response
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  // Get single teacher request by ID
  const useTeacherRequest = (id: number) => {
    return useQuery({
      queryKey: queryKeys.teacherRequest(id),
      queryFn: async (): Promise<TeacherRequestDetail> => {
        const response = await authApi.getTeacherRequestById(id)
        return response
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  const useApproveTeacherRequest = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await authApi.approveTeacherRequest(id)
        return response
      },
      onSuccess: (data, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.teacherRequests })
        
        queryClient.removeQueries({ queryKey: queryKeys.teacherRequest(id) })
        
        ElMessage.success('Teacher request approved successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to approve teacher request'
        ElMessage.error(message)
      }
    })
  }

  const useRejectTeacherRequest = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await authApi.rejectTeacherRequest(id)
        return response
      },
      onSuccess: (data, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.teacherRequests })
        
        queryClient.removeQueries({ queryKey: queryKeys.teacherRequest(id) })
        
        ElMessage.success('Teacher request rejected successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to reject teacher request'
        ElMessage.error(message)
      }
    })
  }

  const useGetFile = (filename: string) => {
    return useQuery({
      queryKey: ['file', filename],
      queryFn: async () => {
        const response = await authApi.getFile(filename)
        return response
      },
      enabled: !!filename,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  return {
    useTeacherRequests,
    useTeacherRequest,
    useApproveTeacherRequest,
    useRejectTeacherRequest,
    useGetFile
  }
}

// Approved Teachers Queries
export const useApprovedTeachersQueries = () => {
  // Get all approved teachers
  const useApprovedTeachers = () => {
    return useQuery({
      queryKey: queryKeys.approvedTeachers,
      queryFn: async () => {
        const response = await authApi.getApprovedTeachers()
        return response
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  return {
    useApprovedTeachers
  }
}

// Students Queries
export const useStudentsQueries = () => {
  // Get all students
  const useStudents = () => {
    return useQuery({
      queryKey: queryKeys.students,
      queryFn: async () => {
        const response = await authApi.getAllStudents()
        return response
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  return {
    useStudents
  }
}

// Tags Queries
export const useTagsQueries = () => {
  // Get all tags
  const useTags = () => {
    return useQuery({
      queryKey: queryKeys.tags,
      queryFn: async () => {
        const response = await tagsApi.getAllTags()
        return response
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  // Get tag by ID
  const useTag = (id: number) => {
    return useQuery({
      queryKey: queryKeys.tag(id),
      queryFn: async () => {
        const response = await tagsApi.getTagById(id)
        return response
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  return {
    useTags,
    useTag
  }
}
// Content Request Queries
export const useContentRequestQueries = () => {
  const queryClient = useQueryClient()

  // Get all unapproved videos
  const useUnapprovedVideos = () => {
    return useQuery({
      queryKey: queryKeys.contentRequests,
      queryFn: async (): Promise<CourseVideoRequest[]> => {
        const response = await courseApi.getUnapprovedVideos()
        return response
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  // Approve video mutation
  const useApproveVideo = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await courseApi.approveVideo(id)
        return response
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contentRequests })
        ElMessage.success('Video approved successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to approve video'
        ElMessage.error(message)
      }
    })
  }

  // Disapprove video mutation
  const useDisapproveVideo = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await courseApi.disapproveVideo(id)
        return response
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contentRequests })
        ElMessage.success('Video disapproved successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to disapprove video'
        ElMessage.error(message)
      }
    })
  }

  return {
    useUnapprovedVideos,
    useApproveVideo,
    useDisapproveVideo
  }
}

// Content Type Queries
export const useContentTypeQueries = () => {
  const queryClient = useQueryClient()

  // Get all content types
  const useContentTypes = () => {
    return useQuery({
      queryKey: queryKeys.contentTypes,
      queryFn: async (): Promise<ContentType[]> => {
        const response = await typesApi.getTypes()
        return response
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  // Create content type mutation
  const useCreateContentType = () => {
    return useMutation({
      mutationFn: async (data: CreateTypeRequest) => {
        const response = await typesApi.createType(data)
        return response
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.contentTypes })
        ElMessage.success('Content type created successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to create content type'
        ElMessage.error(message)
      }
    })
  }

  return {
    useContentTypes,
    useCreateContentType
  }
}


export const useDashboardQueries = () => {
  const useStatsQuery = () => {
    return useQuery({
      queryKey: queryKeys.dashboard.stats,
      queryFn: async () => {
        return {
          totalTeachers: 0,
          totalStudents: 0,
          totalCourses: 0,
          pendingRequests: 0
        }
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true
    })
  }

  return {
    useStatsQuery
  }
}

export const useApiQuery = <T>( 
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
    retry?: number
    refetchOnWindowFocus?: boolean
  }
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    gcTime: options?.gcTime || 10 * 60 * 1000,
    retry: options?.retry || 3,
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
    enabled: options?.enabled ?? true
  })
}

export const useApiMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: any) => void
    onSettled?: () => void
  }
) => {
  return useMutation({
    mutationFn,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled
  })
} 