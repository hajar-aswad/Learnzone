// User and Authentication Types
export interface User {
  id: number
  fName: string
  lName: string
  phoneNumber: string
  active: boolean
  email: string
  role: 'Admin' | 'Teacher' | 'Student'
  createdAt: string
  accessToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  id: number
  fName: string
  lName: string
  phoneNumber: string
  active: boolean
  email: string
  role: 'Admin' | 'Teacher' | 'Student'
  createdAt: string
  accessToken: string
}

// Teacher Request Types
export interface TeacherRequest {
  id: number
  fName: string
  lName: string
  createdAt: string
}

export interface TeacherRequestDetail {
  fName: string
  lName: string
  phoneNumber: string
  active: boolean
  email: string
  password: string
  role: 'Teacher'
  createdAt: string
  teacher: {
    id: number
    facebookUrl: string
    instagramUrl: string
    coverLetter: string
    cv: string
    userId: number
    typeId: number
    createdAt: string
    certificate: Certificate[]
  }
}

export interface Certificate {
  id: number
  certificate: string
  teacherId: number
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  message?: string
  statusCode?: number
}

export interface ApproveResponse {
  message: string
  statusCode: number
}

// Dashboard Types
export interface DashboardStats {
  totalTeachers: number
  totalStudents: number
  totalCourses: number
  pendingRequests: number
}

// Course Types (for future use)
export interface Course {
  id: number
  title: string
  description: string
  teacherId: number
  studentsCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

// Student Types (for future use)
export interface Student {
  id: number
  fName: string
  lName: string
  email: string
  phoneNumber: string
  active: boolean
  role: 'Student'
  createdAt: string
} 