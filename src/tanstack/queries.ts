import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import type { LoginCredentials, TeacherRequest, TeacherRequestDetail } from './types'
import { queryKeys } from './queryKeys'

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
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    })
  }

  // Approve teacher request mutation
  const useApproveTeacherRequest = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await authApi.approveTeacherRequest(id)
        return response
      },
      onSuccess: (data, id) => {
        // Invalidate and refetch teacher requests
        queryClient.invalidateQueries({ queryKey: queryKeys.teacherRequests })
        
        // Remove the specific request from cache
        queryClient.removeQueries({ queryKey: queryKeys.teacherRequest(id) })
        
        ElMessage.success('Teacher request approved successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to approve teacher request'
        ElMessage.error(message)
      }
    })
  }

  // Reject teacher request mutation
  const useRejectTeacherRequest = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await authApi.rejectTeacherRequest(id)
        return response
      },
      onSuccess: (data, id) => {
        // Invalidate and refetch teacher requests
        queryClient.invalidateQueries({ queryKey: queryKeys.teacherRequests })
        
        // Remove the specific request from cache
        queryClient.removeQueries({ queryKey: queryKeys.teacherRequest(id) })
        
        ElMessage.success('Teacher request rejected successfully!')
      },
      onError: (error: any) => {
        const message = error.message || 'Failed to reject teacher request'
        ElMessage.error(message)
      }
    })
  }

  // Get file/certificate
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

// Dashboard Queries (for future use)
export const useDashboardQueries = () => {
  // Dashboard stats query
  const useStatsQuery = () => {
    return useQuery({
      queryKey: queryKeys.dashboard.stats,
      queryFn: async () => {
        // Replace with actual API call when available
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

// Generic API query hook
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

// Generic API mutation hook
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