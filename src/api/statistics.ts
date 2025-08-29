import axios from 'axios'

const api = axios.create({ baseURL: 'https://icep-final-production.up.railway.app' })

// Monthly statistics (current month only)
export async function getStudentsThisMonth() {
  const res = await api.get('/statistics/students-this-month')
  return res.data
}

export async function getTeachersThisMonth() {
  const res = await api.get('/statistics/teachers-this-month')
  return res.data
}

export async function getReelsThisMonth() {
  const res = await api.get('/statistics/reels-this-month')
  return res.data
}

export async function getArticlesThisMonth() {
  const res = await api.get('/statistics/articles-this-month')
  return res.data
}

export async function getShortVideosThisMonth() {
  const res = await api.get('/statistics/short-videos-this-month')
  return res.data
}

// Top courses
export async function getTopCourses() {
  const res = await api.get('/statistics/top-courses')
  return res.data
}

// NEW: Monthly breakdown APIs
export async function getMonthlyStudents() {
  const res = await api.get('/statistics/monthly/students')
  return res.data
}

export async function getMonthlyTeachers() {
  const res = await api.get('/statistics/monthly/teachers')
  return res.data
}

export async function getMonthlyReels() {
  const res = await api.get('/statistics/monthly/reels')
  return res.data
}

export async function getMonthlyArticles() {
  const res = await api.get('/statistics/monthly/articles')
  return res.data
}

export async function getMonthlyShortVideos() {
  const res = await api.get('/statistics/monthly/short-videos')
  return res.data
}

// Get all monthly data at once
export async function getAllMonthlyStatistics() {
  const res = await api.get('/statistics/monthly/all')
  return res.data
}

// Get all statistics at once (current month)
export async function getAllStatistics() {
  const [
    students,
    teachers,
    reels,
    articles,
    shortVideos,
    topCourses
  ] = await Promise.all([
    getStudentsThisMonth(),
    getTeachersThisMonth(),
    getReelsThisMonth(),
    getArticlesThisMonth(),
    getShortVideosThisMonth(),
    getTopCourses()
  ])

  return {
    students: students.count,
    teachers: teachers.count,
    reels: reels.count,
    articles: articles.count,
    shortVideos: shortVideos.count,
    topCourses
  }
}
