<template>
  <div class="teachers-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>Approved Teachers</h2>
        <p>Manage approved teachers in the system</p>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="refreshTeachers"
          :loading="isLoading"
        >
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <el-result
        icon="error"
        :title="error"
        sub-title="Failed to load approved teachers"
      >
        <template #extra>
          <el-button type="primary" @click="refreshTeachers">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>

    <!-- Empty State -->
    <div v-else-if="!teachers || teachers.length === 0" class="empty-container">
      <el-empty description="No approved teachers found">
        <el-button type="primary" @click="refreshTeachers">
          Refresh
        </el-button>
      </el-empty>
    </div>

    <!-- Teachers List -->
    <div v-else class="teachers-list">
      <el-card
        v-for="teacher in teachers"
        :key="teacher.id"
        class="teacher-card"
        @click="openTeacherDetails(teacher)"
      >
        <div class="teacher-content">
          <div class="teacher-info">
            <div class="teacher-name">
              {{ teacher.name }}
            </div>
            <div class="teacher-email">
              {{ teacher.email }}
            </div>
            <div class="teacher-phone">
              Phone: {{ teacher.phoneNumber }}
            </div>
            <div class="teacher-approved-date">
              Approved on {{ formatDate(teacher.teacherCreatedAt) }}
            </div>
          </div>
          <div class="teacher-actions">
            <el-button
              type="primary"
              size="small"
              @click.stop="openTeacherDetails(teacher)"
            >
              View Details
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Teacher Details Modal -->
    <el-dialog
      v-model="showDetailsModal"
      title="Teacher Details"
      width="60%"
      :close-on-click-modal="false"
      @close="closeModal"
    >
      <div v-if="selectedTeacher && teacherDetails" class="teacher-details">
        <!-- Basic Information -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Basic Information</span>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Full Name">
              {{ teacherDetails.fName }} {{ teacherDetails.lName }}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{ teacherDetails.email }}
            </el-descriptions-item>
            <el-descriptions-item label="Phone Number">
              {{ teacherDetails.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="Role">
              <el-tag type="success">{{ teacherDetails.role }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Status">
              <el-tag type="success">Active</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Approved At">
              {{ formatDate(teacherDetails.createdAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Teacher Profile -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Teacher Profile</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Facebook URL">
              <a :href="teacherDetails.teacher.facebookUrl" target="_blank" class="social-link">
                {{ teacherDetails.teacher.facebookUrl }}
              </a>
            </el-descriptions-item>
            <el-descriptions-item label="Instagram URL">
              <a :href="teacherDetails.teacher.instagramUrl" target="_blank" class="social-link">
                {{ teacherDetails.teacher.instagramUrl }}
              </a>
            </el-descriptions-item>
            <el-descriptions-item label="Cover Letter">
              <div class="cover-letter">
                <el-button
                  type="primary"
                  size="small"
                  @click="showFullCoverLetter = true"
                  class="read-cover-letter-btn"
                >
                  Read Full Cover Letter
                </el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="CV">
              <div class="cv-content">
                <div class="cv-info">
                  <el-icon class="cv-icon"><Document /></el-icon>
                  <span class="cv-name">{{ teacherDetails.teacher.cv }}</span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  @click="openCV(teacherDetails.teacher.cv)"
                >
                  Open CV
                </el-button>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Certificates -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Certificates</span>
            </div>
          </template>
          
          <div v-if="teacherDetails.teacher.certificate.length > 0" class="certificates">
            <div
              v-for="cert in teacherDetails.teacher.certificate"
              :key="cert.id"
              class="certificate-item"
            >
              <div class="certificate-info">
                <el-icon class="cert-icon"><Document /></el-icon>
                <span class="cert-name">{{ cert.certificate }}</span>
              </div>
              <el-button
                type="primary"
                size="small"
                @click="openCertificate(cert.certificate)"
              >
                Open Certificate
              </el-button>
            </div>
          </div>
          <el-empty v-else description="No certificates uploaded" />
        </el-card>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetailsModal = false">Close</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Full Cover Letter Modal -->
    <el-dialog
      v-model="showFullCoverLetter"
      title="Full Cover Letter"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="selectedTeacher && teacherDetails" class="full-cover-letter">
        <div class="cover-letter-header">
          <h3>Cover Letter from {{ teacherDetails.fName }} {{ teacherDetails.lName }}</h3>
          <p class="cover-letter-meta">Email: {{ teacherDetails.email }}</p>
        </div>
        <div class="cover-letter-content">
          {{ teacherDetails.teacher.coverLetter }}
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showFullCoverLetter = false">Close</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useApprovedTeachersQueries } from '@/tanstack/queries'
import { ElMessage } from 'element-plus'
import { Refresh, Document } from '@element-plus/icons-vue'
import type { TeacherRequestDetail } from '@/tanstack/types'
import { authApi } from '@/api/auth'

const showDetailsModal = ref(false)
const selectedTeacher = ref<any>(null)
const selectedTeacherId = ref<number | null>(null)
const showFullCoverLetter = ref(false)

const { useApprovedTeachers } = useApprovedTeachersQueries()

// Queries
const approvedTeachersQuery = useApprovedTeachers()

// Create a reactive query that updates when selectedTeacherId changes
const teacherDetailsQuery = useQuery({
  queryKey: computed(() => ['teacherDetails', selectedTeacherId.value]),
  queryFn: async () => {
    if (!selectedTeacherId.value) return null
    console.log('Fetching teacher details for ID:', selectedTeacherId.value)
    const result = await authApi.getTeacherRequestById(selectedTeacherId.value)
    console.log('API result:', result)
    return result
  },
  enabled: computed(() => !!selectedTeacherId.value),
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 1
})

// Computed values
const teachers = computed(() => approvedTeachersQuery.data.value)
const isLoading = computed(() => approvedTeachersQuery.isLoading.value)
const error = computed(() => approvedTeachersQuery.error.value)

const teacherDetails = computed(() => {
  if (!selectedTeacher.value || !selectedTeacherId.value) return null
  return teacherDetailsQuery.data.value
})

// Functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refreshTeachers = () => {
  approvedTeachersQuery.refetch()
}

const openTeacherDetails = async (teacher: any) => {
  console.log('Opening teacher details for:', teacher)
  selectedTeacher.value = teacher
  selectedTeacherId.value = teacher.id
  showDetailsModal.value = true
}

const closeModal = () => {
  selectedTeacher.value = null
  selectedTeacherId.value = null
  showFullCoverLetter.value = false
}

const openCV = (filename: string) => {
  const url = `http://localhost:3000/uploads/teacher/${filename}`
  window.open(url, '_blank')
}

const openCertificate = (filename: string) => {
  const url = `http://localhost:3000/uploads/teacher/${filename}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.teachers-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 1.8rem;
}

.header-content p {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
}

.loading-container,
.error-container,
.empty-container {
  padding: 40px;
  text-align: center;
}

.teachers-list {
  display: grid;
  gap: 16px;
}

.teacher-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.teacher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.teacher-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.teacher-email {
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 4px;
}

.teacher-phone {
  font-size: 0.9rem;
  color: #909399;
  margin-bottom: 4px;
}

.teacher-approved-date {
  font-size: 0.8rem;
  color: #67c23a;
  font-weight: 500;
}

.teacher-actions {
  margin-left: 20px;
}

/* Modal Styles */
.teacher-details {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.card-header {
  font-weight: 600;
  color: #303133;
}

.social-link {
  color: #409eff;
  text-decoration: none;
}

.social-link:hover {
  text-decoration: underline;
}

.cover-letter {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
}

.read-cover-letter-btn {
  width: 100%;
}

.cv-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.cv-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cv-icon {
  color: #409eff;
}

.cv-name {
  font-weight: 500;
}

.certificates {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.certificate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.certificate-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cert-icon {
  color: #409eff;
}

.cert-name {
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Full Cover Letter Modal Styles */
.full-cover-letter {
  max-height: 70vh;
  overflow-y: auto;
}

.cover-letter-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.cover-letter-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 1.4rem;
}

.cover-letter-meta {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
}

.cover-letter-content {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .teacher-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .teacher-actions {
    margin-left: 0;
  }
  
  .cv-content {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .certificate-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style> 