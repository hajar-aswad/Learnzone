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

export interface ApiResponse<T> {
  data?: T
  message?: string
  statusCode?: number
}

export interface ApproveResponse {
  message: string
  statusCode: number
}

export interface DashboardStats {
  totalTeachers: number
  totalStudents: number
  totalCourses: number
  pendingRequests: number
}

export interface Course {
  id: number
  title: string
  description: string
  teacherId: number
  studentsCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

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


export interface CourseVideo {
  id: number
  courseId: number
  youtubeVideoId: string | null
  title: string
  description: string
  thumbnail_url: string | null
  path: string
  approaved: boolean
  privacyStatus: string | null
  videoUrl: string
  number: number
  course?: any 
}
export interface CourseVideoRequest {
  courseId: number
  courseTitle: string
  teacherName: string
  videos: CourseVideo[]
}


// Content Types
export interface ContentType {
  id: number
  name: string
  createdAt: string
}

export interface CreateTypeRequest {
  name: string
}

export interface CreateTypeResponse {
  id: number
  name: string
  createdAt: string
}

// Tag Types
export interface Tag {
  id: number
  name: string
  typeId: number
  createdAt: string
}

export interface CreateTagRequest {
  name: string
  typeId: number
}

export interface UpdateTagRequest {
  name?: string
  typeId?: number
}

export interface TagsResponse {
  success: boolean
  tagsByType: { [key: number]: Tag[] }
  totalCount: number
}


export interface ApproveVideoResponse {
  id: string // YouTube video ID
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
  status: {
    privacyStatus: string
  }
  approvedBy: {
    id: number
    email: string
    name: string
    role: string
  }
  approvedAt: string
  youtubeAccess: boolean
}

export interface DisapproveVideoResponse {
  // fields from disapprove result
  disapprovedBy: {
    id: number
    email: string
    name: string
    role: string
  }
  disapprovedAt: string
  reasons?: string
  emailSent: boolean
  emailError: string | null
}

export interface TeacherRequest {
  id: number
  name: string // Changed from fName/lName to single name field
  email: string
  teacherCreatedAt: string // Changed from createdAt
  phoneNumber: string
}