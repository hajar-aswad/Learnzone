<template>
  <div class="home-container">
    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="welcome-content">
        <h1>Welcome to LearnZone Dashboard</h1>
        <p>Monitor your platform's performance and growth</p>
      </div>
      <div class="welcome-actions">
        <el-button
          @click="refreshStats"
          :loading="loading"
          type="primary"
          size="large"
        >
          <el-icon><Refresh /></el-icon>
          {{ loading ? 'Refreshing...' : 'Refresh Statistics' }}
        </el-button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasData" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !hasData" class="error-container">
      <el-result
        icon="error"
        :title="error"
        sub-title="Failed to load dashboard statistics"
      >
        <template #extra>
          <el-button type="primary" @click="loadStatistics">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>

    <!-- Statistics Dashboard -->
    <div v-else-if="hasData" class="dashboard-content">
      <!-- Monthly Overview Cards -->
      <div class="stats-section">
        <h2>📊 This Month's Overview</h2>
        <p class="section-hint">💡 Click on any card to see monthly trends</p>
        <div class="stats-grid">
          <el-card class="stat-card students" @click="showMonthlyChart('students', 'New Students')">
            <div class="stat-content">
              <div class="stat-icon">👨‍🎓</div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.students }}</div>
                <div class="stat-label">New Students</div>
                <div class="stat-period">This Month</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card teachers" @click="showMonthlyChart('teachers', 'New Teachers')">
            <div class="stat-content">
              <div class="stat-icon">👨‍🏫</div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.teachers }}</div>
                <div class="stat-label">New Teachers</div>
                <div class="stat-period">This Month</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card reels" @click="showMonthlyChart('reels', 'New Reels')">
            <div class="stat-content">
              <div class="stat-icon">📱</div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.reels }}</div>
                <div class="stat-label">New Reels</div>
                <div class="stat-period">This Month</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card articles" @click="showMonthlyChart('articles', 'New Articles')">
            <div class="stat-content">
              <div class="stat-icon">📝</div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.articles }}</div>
                <div class="stat-label">New Articles</div>
                <div class="stat-period">This Month</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card videos" @click="showMonthlyChart('shortVideos', 'New Short Videos')">
            <div class="stat-content">
              <div class="stat-icon">🎥</div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.shortVideos }}</div>
                <div class="stat-label">New Short Videos</div>
                <div class="stat-period">This Month</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Top Courses Section -->
      <div class="top-courses-section">
        <h2>🏆 Top Performing Courses</h2>
        <p class="section-description">Most enrolled courses this month</p>
        
        <div v-if="topCoursesLoading" class="courses-loading">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="topCoursesError" class="courses-error">
          <el-alert
            :title="topCoursesError"
            type="error"
            show-icon
            :closable="false"
          />
        </div>
        
        <div v-else-if="topCourses.length === 0" class="no-courses">
          <el-empty description="No course data available">
            <p>Course statistics will appear here once students start enrolling</p>
          </el-empty>
        </div>
        
        <div v-else class="courses-grid">
          <el-card
            v-for="(item, index) in topCourses"
            :key="item.course.id"
            class="course-card"
            :class="`rank-${index + 1}`"
          >
            <div class="course-rank">
              <span class="rank-number">#{{ index + 1 }}</span>
              <div class="rank-badge" :class="`rank-${index + 1}`">
                {{ getRankLabel(index + 1) }}
              </div>
            </div>
            
            <div class="course-content">
              <h3 class="course-title">{{ item.course.title }}</h3>
              
              <div class="course-stats">
                <div class="stat-item">
                  <span class="stat-icon">👥</span>
                  <span class="stat-value">{{ item.enrollCount }}</span>
                  <span class="stat-label">Enrollments</span>
                </div>
              </div>
              
              <div class="course-teacher">
                <span class="teacher-label">Teacher:</span>
                <span class="teacher-name">
                  {{ getTeacherName(item.course.teacher) }}
                </span>
              </div>
              
              <div class="course-type">
                <span class="type-label">Type:</span>
                <el-tag :type="getTypeTagType(item.course.typeId)" size="small">
                  {{ getTypeName(item.course.typeId) }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div class="actions-grid">
          <el-button
            @click="$router.push('/dashboard/requests')"
            type="primary"
            size="large"
            class="action-btn"
          >
            <el-icon><Document /></el-icon>
            View Teacher Requests
          </el-button>
          
          <el-button
            @click="$router.push('/dashboard/teachers')"
            type="success"
            size="large"
            class="action-btn"
          >
            <el-icon><User /></el-icon>
            Manage Teachers
          </el-button>
          
          <el-button
            @click="$router.push('/dashboard/students')"
            type="warning"
            size="large"
            class="action-btn"
          >
            <el-icon><Avatar /></el-icon>
            View Students
          </el-button>
          
          <el-button
            @click="$router.push('/dashboard/tags')"
            type="info"
            size="large"
            class="action-btn"
          >
            <el-icon><PriceTag /></el-icon>
            Manage Tags
          </el-button>
        </div>
      </div>
    </div>

    <!-- Monthly Chart Modal -->
    <MonthlyChartModal
      v-model="showChartModal"
      :type="selectedChartType"
      :title="selectedChartTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Refresh, 
  Document, 
  User, 
  Avatar, 
  PriceTag 
} from '@element-plus/icons-vue'
import * as statisticsApi from '@/api/statistics'
import MonthlyChartModal from '@/components/MonthlyChartModal.vue'

// Reactive data
const loading = ref(false)
const topCoursesLoading = ref(false)
const error = ref<string | null>(null)
const topCoursesError = ref<string | null>(null)

const statistics = ref({
  students: 0,
  teachers: 0,
  reels: 0,
  articles: 0,
  shortVideos: 0
})

const topCourses = ref<any[]>([])

// Chart modal state
const showChartModal = ref(false)
const selectedChartType = ref<'students' | 'teachers' | 'reels' | 'articles' | 'shortVideos'>('students')
const selectedChartTitle = ref('')

// Computed properties
const hasData = computed(() => {
  return Object.values(statistics.value).some(value => value > 0) || topCourses.value.length > 0
})

// Methods
const loadStatistics = async () => {
  try {
    loading.value = true
    error.value = null
    
    const stats = await statisticsApi.getAllStatistics()
    statistics.value = {
      students: stats.students || 0,
      teachers: stats.teachers || 0,
      reels: stats.reels || 0,
      articles: stats.articles || 0,
      shortVideos: stats.shortVideos || 0
    }
    
    ElMessage.success('Statistics loaded successfully!')
  } catch (e: any) {
    console.error('Failed to load statistics:', e)
    error.value = e?.response?.data?.message || 'Failed to load statistics'
    ElMessage.error('Failed to load statistics')
  } finally {
    loading.value = false
  }
}

const loadTopCourses = async () => {
  try {
    topCoursesLoading.value = true
    topCoursesError.value = null
    
    const courses = await statisticsApi.getTopCourses()
    topCourses.value = courses || []
  } catch (e: any) {
    console.error('Failed to load top courses:', e)
    topCoursesError.value = e?.response?.data?.message || 'Failed to load top courses'
  } finally {
    topCoursesLoading.value = false
  }
}

const refreshStats = async () => {
  await Promise.all([
    loadStatistics(),
    loadTopCourses()
  ])
}

const getTeacherName = (teacher: any): string => {
  if (!teacher?.user) return 'Unknown Teacher'
  const { fName, lName } = teacher.user
  if (fName && lName) return `${fName} ${lName}`
  if (fName) return fName
  if (lName) return lName
  return 'Unknown Teacher'
}

const getTypeName = (typeId: number): string => {
  switch (typeId) {
    case 1: return 'English'
    case 2: return 'Indian'
    default: return `Type ${typeId}`
  }
}

const getTypeTagType = (typeId: number): string => {
  switch (typeId) {
    case 1: return 'primary'
    case 2: return 'success'
    default: return 'info'
  }
}

const getRankLabel = (rank: number): string => {
  switch (rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return '🏅'
  }
}

const showMonthlyChart = (type: 'students' | 'teachers' | 'reels' | 'articles' | 'shortVideos', title: string) => {
  selectedChartType.value = type
  selectedChartTitle.value = title
  showChartModal.value = true
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadStatistics(),
    loadTopCourses()
  ])
})
</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.welcome-content h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.welcome-content p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.loading-container,
.error-container {
  padding: 60px;
  text-align: center;
}

/* Statistics Section */
.stats-section {
  margin-bottom: 50px;
}

.stats-section h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 1.8rem;
  font-weight: 600;
}

.section-hint {
  margin: 0 0 25px 0;
  color: #909399;
  font-size: 0.9rem;
  font-style: italic;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card.students {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.teachers {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.reels {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.articles {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card.videos {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 25px;
  color: white;
}

.stat-icon {
  font-size: 3rem;
  margin-right: 20px;
  opacity: 0.9;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 3px;
  opacity: 0.9;
}

.stat-period {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Top Courses Section */
.top-courses-section {
  margin-bottom: 50px;
}

.top-courses-section h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 1.8rem;
  font-weight: 600;
}

.section-description {
  margin: 0 0 25px 0;
  color: #606266;
  font-size: 1rem;
}

.courses-loading,
.courses-error,
.no-courses {
  padding: 40px;
  text-align: center;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.course-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.course-card.rank-1 {
  border: 2px solid #ffd700;
}

.course-card.rank-2 {
  border: 2px solid #c0c0c0;
}

.course-card.rank-3 {
  border: 2px solid #cd7f32;
}

.course-rank {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.rank-number {
  background: #409eff;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}

.rank-badge {
  font-size: 1.5rem;
}

.course-content {
  padding: 25px;
}

.course-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
}

.course-stats {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  color: #606266;
  font-size: 0.9rem;
}

.course-teacher,
.course-type {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.teacher-label,
.type-label {
  color: #909399;
  font-size: 0.9rem;
  min-width: 60px;
}

.teacher-name {
  color: #303133;
  font-weight: 500;
}

/* Quick Actions Section */
.quick-actions-section {
  margin-bottom: 30px;
}

.quick-actions-section h2 {
  margin: 0 0 25px 0;
  color: #303133;
  font-size: 1.8rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-btn {
  height: 60px;
  font-size: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-container {
    padding: 15px;
  }
  
  .welcome-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 25px;
  }
  
  .welcome-content h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-content {
    padding: 20px;
  }
  
  .stat-icon {
    font-size: 2.5rem;
    margin-right: 15px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>
