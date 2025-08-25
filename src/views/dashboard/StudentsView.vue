<template>
  <div class="students-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>All Students</h2>
        <p>Manage students ordered by type</p>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="refreshStudents"
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
        sub-title="Failed to load students"
      >
        <template #extra>
          <el-button type="primary" @click="refreshStudents">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasStudents" class="empty-container">
      <el-empty description="No students found">
        <el-button type="primary" @click="refreshStudents">
          Refresh
        </el-button>
      </el-empty>
    </div>

    <!-- Students List Grouped by Type -->
    <div v-else class="students-content">
      <!-- Single type students grouped by type -->
      <div v-for="(students, typeName) in studentsData.studentsByType" :key="typeName" class="type-group">
        <div class="type-header">
          <h3>{{ typeName }}</h3>
          <span class="student-count">{{ students.length }} student{{ students.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="students-grid">
          <el-card
            v-for="student in students"
            :key="student.id"
            class="student-card single-type"
            @click="openStudentDetails(student)"
          >
            <div class="student-content">
              <div class="student-info">
                <div class="student-name">
                  {{ student.name }}
                </div>
                <div class="student-email">
                  {{ student.email }}
                </div>
                <div class="student-phone">
                  Phone: {{ student.phoneNumber }}
                </div>
                <div class="student-types">
                  <strong>Type:</strong>
                  <div class="types-list">
                    <el-tag
                      v-for="type in student.types"
                      :key="type.typeId"
                      size="small"
                      type="info"
                      class="type-tag"
                    >
                      {{ type.typeName }}
                    </el-tag>
                  </div>
                </div>
                <div class="student-joined">
                  Joined: {{ formatDate(student.studentCreatedAt) }}
                </div>
              </div>
              <div class="student-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="openStudentDetails(student)"
                >
                  View Details
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Multiple type students (separate section) -->
      <div v-if="studentsData.multipleTypeStudents && studentsData.multipleTypeStudents.length > 0" class="type-group multiple-types-group">
        <div class="type-header multiple-types-header">
          <h3>Students with Multiple Types</h3>
          <span class="student-count multiple-count">{{ studentsData.multipleTypeStudents.length }} student{{ studentsData.multipleTypeStudents.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="students-grid">
          <el-card
            v-for="student in studentsData.multipleTypeStudents"
            :key="student.id"
            class="student-card multiple-type"
            @click="openStudentDetails(student)"
          >
            <div class="student-content">
              <div class="student-info">
                <div class="student-name">
                  {{ student.name }}
                </div>
                <div class="student-email">
                  {{ student.email }}
                </div>
                <div class="student-phone">
                  Phone: {{ student.phoneNumber }}
                </div>
                <div class="student-types">
                  <strong>Types:</strong>
                  <div class="types-list">
                    <el-tag
                      v-for="type in student.types"
                      :key="type.typeId"
                      size="small"
                      type="warning"
                      class="type-tag"
                    >
                      {{ type.typeName }}
                    </el-tag>
                  </div>
                </div>
                <div class="student-joined">
                  Joined: {{ formatDate(student.studentCreatedAt) }}
                </div>
              </div>
              <div class="student-actions">
                <el-button
                  type="warning"
                  size="small"
                  @click.stop="openStudentDetails(student)"
                >
                  View Details
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- Student Details Modal -->
    <el-dialog
      v-model="showDetailsModal"
      title="Student Details"
      width="60%"
      :close-on-click-modal="false"
      @close="closeModal"
    >
      <div v-if="selectedStudent" class="student-details">
        <!-- Basic Information -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Basic Information</span>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Full Name">
              {{ selectedStudent.name }}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{ selectedStudent.email }}
            </el-descriptions-item>
            <el-descriptions-item label="Phone Number">
              {{ selectedStudent.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="Joined Date">
              {{ formatDate(selectedStudent.studentCreatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Student Types -->
        <el-card class="detail-section">
          <template #header>
            <div class="card-header">
              <span>Enrolled Types</span>
            </div>
          </template>
          
          <div class="types-grid">
            <el-tag
              v-for="type in selectedStudent.types"
              :key="type.typeId"
              size="large"
              type="success"
              class="type-tag-large"
            >
              {{ type.typeName }}
            </el-tag>
          </div>
        </el-card>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetailsModal = false">Close</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsQueries } from '@/tanstack/queries'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const showDetailsModal = ref(false)
const selectedStudent = ref<any>(null)

const { useStudents } = useStudentsQueries()

// Queries
const studentsQuery = useStudents()

// Computed values
const studentsData = computed(() => studentsQuery.data.value)
const isLoading = computed(() => studentsQuery.isLoading.value)
const error = computed(() => studentsQuery.error.value)

// Check if we have students data
const hasStudents = computed(() => {
  if (!studentsData.value) return false
  const singleTypeCount = Object.values(studentsData.value.studentsByType || {}).reduce((total: number, students: any[]) => total + students.length, 0)
  const multipleTypeCount = studentsData.value.multipleTypeStudents?.length || 0
  return singleTypeCount > 0 || multipleTypeCount > 0
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

const refreshStudents = () => {
  studentsQuery.refetch()
}

const openStudentDetails = async (student: any) => {
  console.log('Opening student details for:', student)
  selectedStudent.value = student
  showDetailsModal.value = true
}

const closeModal = () => {
  selectedStudent.value = null
}
</script>

<style scoped>
.students-container {
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

/* Type Groups */
.type-group {
  margin-bottom: 40px;
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

/* Multiple Types Group */
.multiple-types-group {
  margin-top: 40px;
}

.multiple-types-header {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.multiple-count {
  background: #ffc107;
  color: #212529;
}

.type-header h3 {
  margin: 0;
  color: #303133;
  font-size: 1.4rem;
  font-weight: 600;
}

.student-count {
  background: #409eff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Students Grid */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.student-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Single type students */
.student-card.single-type {
  border-color: #409eff;
}

.student-card.single-type:hover {
  border-color: #337ecc;
}

/* Multiple type students */
.student-card.multiple-type {
  border-color: #ffc107;
  background: #fffbf0;
}

.student-card.multiple-type:hover {
  border-color: #e0a800;
  background: #fff8e1;
}

.student-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.student-email {
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 6px;
}

.student-phone {
  font-size: 0.9rem;
  color: #909399;
  margin-bottom: 12px;
}

.student-types {
  margin-bottom: 12px;
}

.student-types strong {
  display: block;
  margin-bottom: 6px;
  color: #303133;
  font-size: 0.9rem;
}

.types-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.type-tag {
  margin: 0;
}

.student-joined {
  font-size: 0.8rem;
  color: #67c23a;
  font-weight: 500;
}

.student-actions {
  flex-shrink: 0;
}

/* Modal Styles */
.student-details {
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

.types-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.type-tag-large {
  font-size: 1rem;
  padding: 8px 16px;
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
  
  .type-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
    text-align: center;
  }
  
  .students-grid {
    grid-template-columns: 1fr;
  }
  
  .student-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .student-actions {
    align-self: stretch;
  }
  
  .student-actions .el-button {
    width: 100%;
  }
}
</style> 