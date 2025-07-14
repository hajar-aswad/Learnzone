export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  // Teacher requests
  teacherRequests: ['teacher-requests'] as const,
  teacherRequest: (id: number) => ['teacher-request', id] as const,
  
  // Dashboard
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    charts: ['dashboard', 'charts'] as const,
  },
  
  // Users
  users: ['users'] as const,
  user: (id: number) => ['user', id] as const,
  
  // Courses (for future use)
  courses: ['courses'] as const,
  course: (id: number) => ['course', id] as const,
  
  // Students (for future use)
  students: ['students'] as const,
  student: (id: number) => ['student', id] as const,
} as const 