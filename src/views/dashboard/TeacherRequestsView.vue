<template>
  <div class="teacher-requests-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>Teacher Requests</h2>
        <p>Manage pending teacher applications</p>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="refreshRequests"
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
        sub-title="Failed to load teacher requests"
      >
        <template #extra>
          <el-button type="primary" @click="refreshRequests">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>

    <!-- Empty State -->
    <div v-else-if="!requests || requests.length === 0" class="empty-container">
      <el-empty description="No teacher requests found">
        <el-button type="primary" @click="refreshRequests">
          Refresh
        </el-button>
      </el-empty>
    </div>

    <!-- Requests List -->
    <div v-else class="requests-list">
      <el-card
        v-for="request in requests"
        :key="request.id"
        class="request-card"
        @click="openRequestDetails(request)"
      >
        <div class="request-content">
          <div class="request-info">
            <div class="teacher-name">
              {{ request.name }}  {{ request.email }}
            </div>
            <div class="request-date">
              Requested on {{ formatDate(request.teacherCreatedAt) }}
            </div>
          </div>
          <div class="request-actions">
            <el-button
              type="primary"
              size="small"
              @click.stop="openRequestDetails(request)"
            >
              View Details
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Request Details Modal -->
    <el-dialog
      v-model="showDetailsModal"
      title="Teacher Request Details"
      width="60%"
      :close-on-click-modal="false"
      @close="closeModal"
    >
      <!-- Loading State -->
      <div v-if="teacherRequestDetailQuery.isLoading.value" class="loading-container">
        <el-skeleton :rows="8" animated />
      </div>
      
      <!-- Error State -->
      <div v-else-if="teacherRequestDetailQuery.error.value" class="error-container">
        <el-result
          icon="error"
          title="Failed to load teacher details"
          :sub-title="teacherRequestDetailQuery.error.value?.message || 'Unknown error occurred'"
        >
          <template #extra>
            <el-button type="primary" @click="openRequestDetails(selectedRequest!)">
              Try Again
            </el-button>
          </template>
        </el-result>
      </div>
      
      <!-- Details Content -->
      <div v-else-if="selectedRequest && requestDetails" class="request-details">
        <!-- Basic Information -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Basic Information</span>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Full Name">
              {{ requestDetails.fName }} {{ requestDetails.lName }}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{ requestDetails.email }}
            </el-descriptions-item>
            <el-descriptions-item label="Phone Number">
              {{ requestDetails.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="Role">
              <el-tag type="warning">{{ requestDetails.role }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Status">
              <el-tag :type="requestDetails.active ? 'success' : 'danger'">
                {{ requestDetails.active ? 'Active' : 'Inactive' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Created At">
              {{ formatDate(requestDetails.createdAt) }}
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
              <a :href="requestDetails.teacher.facebookUrl" target="_blank" class="social-link">
                {{ requestDetails.teacher.facebookUrl }}
              </a>
            </el-descriptions-item>
            <el-descriptions-item label="Instagram URL">
              <a :href="requestDetails.teacher.instagramUrl" target="_blank" class="social-link">
                {{ requestDetails.teacher.instagramUrl }}
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
                  <span class="cv-name">{{ requestDetails.teacher.cv }}</span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  @click="openCV(requestDetails.teacher.cv)"
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
          
          <div v-if="requestDetails.teacher.certificate.length > 0" class="certificates">
            <div
              v-for="cert in requestDetails.teacher.certificate"
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
          <el-button
            type="danger"
            @click="rejectRequest"
            :loading="isRejecting"
          >
            Reject Request
          </el-button>
          <el-button
            type="success"
            @click="approveRequest"
            :loading="isApproving"
          >
            Approve Request
          </el-button>
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
      <div v-if="selectedRequest && requestDetails" class="full-cover-letter">
        <div class="cover-letter-header">
          <h3>Cover Letter from {{ requestDetails.fName }} {{ requestDetails.lName }}</h3>
          <p class="cover-letter-meta">Email: {{ requestDetails.email }}</p>
        </div>
        <div class="cover-letter-content">
          {{ requestDetails.teacher.coverLetter }}
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
import { ref, computed, watchEffect } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useTeacherRequestQueries } from '@/tanstack/queries'
import { ElMessage } from 'element-plus'
import { Refresh, Document } from '@element-plus/icons-vue'
import type { TeacherRequest, TeacherRequestDetail } from '@/tanstack/types'
import { authApi } from '@/api/auth'

const showDetailsModal = ref(false)
const selectedRequest = ref<TeacherRequest | null>(null)
const selectedTeacherId = ref<number | null>(null)
const showFullCoverLetter = ref(false)

const {
  useTeacherRequests,
  useTeacherRequest,
  useApproveTeacherRequest,
  useRejectTeacherRequest
} = useTeacherRequestQueries()

//  hookss
const teacherRequestsQuery = useTeacherRequests()
const approveMutation = useApproveTeacherRequest()
const rejectMutation = useRejectTeacherRequest()

// Create a reactive query that updates when selectedTeacherId changes
const teacherRequestDetailQuery = useQuery({
  queryKey: computed(() => ['teacherRequest', selectedTeacherId.value]),
  queryFn: async () => {
    console.log('queryFn called with selectedTeacherId:', selectedTeacherId.value)
    if (!selectedTeacherId.value) {
      console.log('No teacher ID, returning null')
      return null
    }
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

const requests = computed(() => teacherRequestsQuery.data.value)
const isLoading = computed(() => teacherRequestsQuery.isLoading.value)
const error = computed(() => teacherRequestsQuery.error.value)

const requestDetails = computed(() => {
  console.log('Computing requestDetails:')
  console.log('- selectedRequest:', selectedRequest.value)
  console.log('- selectedTeacherId:', selectedTeacherId.value)
  console.log('- query data:', teacherRequestDetailQuery.data.value)
  console.log('- query isLoading:', teacherRequestDetailQuery.isLoading.value)
  console.log('- query error:', teacherRequestDetailQuery.error.value)
  
  if (!selectedRequest.value || !selectedTeacherId.value) return null
  return teacherRequestDetailQuery.data.value
})

const isApproving = computed(() => approveMutation.isPending.value)
const isRejecting = computed(() => rejectMutation.isPending.value)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refreshRequests = () => {
  teacherRequestsQuery.refetch()
}

const openRequestDetails = async (request: TeacherRequest) => {
  console.log('Opening request details for:', request)
  console.log('Request ID type:', typeof request.id, 'Value:', request.id)
  console.log('Full request object:', JSON.stringify(request, null, 2))
  
  // Check if there are other ID fields
  console.log('All request fields:', Object.keys(request))
  console.log('Request values:', Object.values(request))
  
  selectedRequest.value = request
  selectedTeacherId.value = request.id
  
  console.log('Set selectedTeacherId to:', selectedTeacherId.value)
  console.log('Selected teacher ID type:', typeof selectedTeacherId.value)
  
  showDetailsModal.value = true
  
  try {
    // Manually trigger the query with the new ID
    console.log('Selected request ID:', selectedRequest.value?.id)
    console.log('Selected teacher ID:', selectedTeacherId.value)
    console.log('Query enabled:', !!selectedTeacherId.value)
    
    // Force refetch with new ID
    if (selectedTeacherId.value) {
      console.log('Forcing query refetch for ID:', selectedTeacherId.value)
      // Force the query to refetch
      teacherRequestDetailQuery.refetch()
    }
  } catch (error) {
    ElMessage.error('Failed to load request details')
  }
}

const closeModal = () => {
  selectedRequest.value = null
  selectedTeacherId.value = null
  showFullCoverLetter.value = false
}

const approveRequest = async () => {
  if (!selectedRequest.value) return
  
  try {
    await approveMutation.mutateAsync(selectedRequest.value.id)
    showDetailsModal.value = false
    selectedRequest.value = null
    selectedTeacherId.value = null
  } catch (error) {
  }
}

const rejectRequest = async () => {
  if (!selectedRequest.value) return
  
  try {
    await rejectMutation.mutateAsync(selectedRequest.value.id)
    showDetailsModal.value = false
    selectedRequest.value = null
    selectedTeacherId.value = null
  } catch (error) {
  }
}

const openCertificate = (filename: string) => {
  const url = `https://icep-final-production.up.railway.app/uploads/teacher/${filename}`
  window.open(url, '_blank')
}

const openCV = (filename: string) => {
  const url = `https://icep-final-production.up.railway.app/uploads/teacher/${filename}`
  window.open(url, '_blank')
}

// Cover letter helper functions - no longer needed since we only show the button
</script>

<style scoped>
.teacher-requests-container {
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

.requests-list {
  display: grid;
  gap: 16px;
}

.request-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.request-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.request-info {
  flex: 1;
}

.teacher-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.request-date {
  font-size: 0.9rem;
  color: #909399;
}

.request-actions {
  margin-left: 20px;
}

/* Modal Styles */
.loading-container,
.error-container {
  padding: 40px;
  text-align: center;
}

.request-details {
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

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .request-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .request-actions {
    margin-left: 0;
  }
  
  .certificate-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .cv-content {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style> 