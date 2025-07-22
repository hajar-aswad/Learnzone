<template>
    <div class="content-types-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h2>Content Types</h2>
          <p>Manage content types for courses and materials</p>
        </div>
        <div class="header-actions">
          <el-button
            type="primary"
            @click="showAddTypeModal = true"
          >
            <el-icon><Plus /></el-icon>
            Add New Type
          </el-button>
          <el-button
            @click="refreshTypes"
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
          sub-title="Failed to load content types"
        >
          <template #extra>
            <el-button type="primary" @click="refreshTypes">
              Try Again
            </el-button>
          </template>
        </el-result>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="!contentTypes || contentTypes.length === 0" class="empty-container">
        <el-empty description="No content types found">
          <el-button type="primary" @click="showAddTypeModal = true">
            Add First Type
          </el-button>
        </el-empty>
      </div>
  
      <!-- Content Types Table -->
      <div v-else class="types-table-container">
        <el-card>
          <el-table
            :data="contentTypes"
            style="width: 100%"
            :default-sort="{ prop: 'createdAt', order: 'descending' }"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="80"
              sortable
            />
            <el-table-column
              prop="name"
              label="Type Name"
              sortable
            >
              <template #default="{ row }">
                <div class="type-name">
                  <el-icon class="type-icon"><Document /></el-icon>
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdAt"
              label="Created At"
              width="200"
              sortable
            >
              <template #default="{ row }">
                <div class="date-cell">
                  <el-icon class="date-icon"><Calendar /></el-icon>
                  <span>{{ formatDate(row.createdAt) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="Actions"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                <el-tooltip content="Edit Type" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click="editType(row)"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="Delete Type" placement="top">
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="confirmDeleteType(row)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
  
      <!-- Add/Edit Type Modal -->
      <el-dialog
        v-model="showAddTypeModal"
        :title="isEditing ? 'Edit Content Type' : 'Add New Content Type'"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="typeFormRef"
          :model="typeForm"
          :rules="typeFormRules"
          label-width="120px"
          @submit.prevent="submitTypeForm"
        >
          <el-form-item label="Type Name" prop="name">
            <el-input
              v-model="typeForm.name"
              placeholder="Enter content type name"
              :maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancelTypeForm">Cancel</el-button>
            <el-button
              type="primary"
              @click="submitTypeForm"
              :loading="isCreating"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </el-button>
          </div>
        </template>
      </el-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <el-dialog
        v-model="showDeleteConfirm"
        title="Confirm Delete"
        width="400px"
        :close-on-click-modal="false"
      >
        <div class="delete-confirmation">
          <el-icon class="warning-icon"><WarningFilled /></el-icon>
          <p>Are you sure you want to delete the content type "<strong>{{ typeToDelete?.name }}</strong>"?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showDeleteConfirm = false">Cancel</el-button>
            <el-button
              type="danger"
              @click="deleteType"
              :loading="isDeleting"
            >
              Delete
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import { useContentTypeQueries } from '@/tanstack/queries'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { 
    Plus, 
    Refresh, 
    Document, 
    Calendar, 
    Edit, 
    Delete, 
    WarningFilled 
  } from '@element-plus/icons-vue'
  import type { ContentType, CreateTypeRequest } from '@/tanstack/types'
  
  // Reactive data
  const showAddTypeModal = ref(false)
  const showDeleteConfirm = ref(false)
  const isEditing = ref(false)
  const typeToDelete = ref<ContentType | null>(null)
  const typeFormRef = ref<FormInstance>()
  
  // Form data
  const typeForm = reactive<CreateTypeRequest & { id?: number }>({
    name: ''
  })
  
  // Form validation rules
  const typeFormRules: FormRules = {
    name: [
      { required: true, message: 'Type name is required', trigger: 'blur' },
      { min: 2, max: 50, message: 'Type name must be between 2 and 50 characters', trigger: 'blur' },
      { 
        pattern: /^[a-zA-Z0-9\s\-_]+$/, 
        message: 'Type name can only contain letters, numbers, spaces, hyphens, and underscores', 
        trigger: 'blur' 
      }
    ]
  }
  
  // Query hooks
  const {
    useContentTypes,
    useCreateContentType
  } = useContentTypeQueries()
  
  const contentTypesQuery = useContentTypes()
  const createTypeMutation = useCreateContentType()
  
  // Computed properties
  const contentTypes = computed(() => contentTypesQuery.data.value)
  const isLoading = computed(() => contentTypesQuery.isLoading.value)
  const error = computed(() => contentTypesQuery.error.value?.message)
  const isCreating = computed(() => createTypeMutation.isPending.value)
  const isDeleting = ref(false)
  
  // Methods
  const refreshTypes = () => {
    contentTypesQuery.refetch()
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const resetTypeForm = () => {
    typeForm.name = ''
    typeForm.id = undefined
    isEditing.value = false
    typeFormRef.value?.resetFields()
  }
  
  const cancelTypeForm = () => {
    showAddTypeModal.value = false
    resetTypeForm()
  }
  
  const submitTypeForm = async () => {
    if (!typeFormRef.value) return
    
    try {
      await typeFormRef.value.validate()
      
      if (isEditing.value) {
        // TODO: Implement edit functionality when API is available
        ElMessage.warning('Edit functionality will be implemented when API endpoint is available')
        return
      }
      
      await createTypeMutation.mutateAsync({
        name: typeForm.name.trim()
      })
      
      showAddTypeModal.value = false
      resetTypeForm()
    } catch (error) {
      // Error handled by mutation or validation
    }
  }
  
  const editType = (type: ContentType) => {
    typeForm.name = type.name
    typeForm.id = type.id
    isEditing.value = true
    showAddTypeModal.value = true
  }
  
  const confirmDeleteType = (type: ContentType) => {
    typeToDelete.value = type
    showDeleteConfirm.value = true
  }
  
  const deleteType = async () => {
    if (!typeToDelete.value) return
    
    try {
      isDeleting.value = true
      
      // TODO: Implement delete functionality when API is available
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      ElMessage.success('Content type deleted successfully!')
      showDeleteConfirm.value = false
      typeToDelete.value = null
      refreshTypes()
    } catch (error) {
      ElMessage.error('Failed to delete content type')
    } finally {
      isDeleting.value = false
    }
  }
  </script>
  
  <style scoped>
  .content-types-container {
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
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
  
  .loading-container,
  .error-container,
  .empty-container {
    padding: 40px;
    text-align: center;
  }
  
  .types-table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .type-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .type-icon {
    color: #409eff;
    font-size: 1.1rem;
  }
  
  .date-cell {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .date-icon {
    color: #909399;
    font-size: 1rem;
  }
  
  /* Modal Styles */
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  /* Delete Confirmation Styles */
  .delete-confirmation {
    text-align: center;
    padding: 20px 0;
  }
  
  .warning-icon {
    font-size: 3rem;
    color: #e6a23c;
    margin-bottom: 16px;
  }
  
  .delete-confirmation p {
    margin: 8px 0;
    color: #303133;
  }
  
  .warning-text {
    color: #e6a23c;
    font-size: 0.9rem;
  }
  
  /* Table Customization */
  :deep(.el-table) {
    --el-table-border-color: #e4e7ed;
    --el-table-bg-color: #ffffff;
    --el-table-tr-bg-color: #ffffff;
    --el-table-expanded-cell-bg-color: #ffffff;
  }
  
  :deep(.el-table__header) {
    background-color: #f5f7fa;
  }
  
  :deep(.el-table th) {
    background-color: #f5f7fa;
    color: #303133;
    font-weight: 600;
  }
  
  :deep(.el-table td) {
    border-bottom: 1px solid #e4e7ed;
  }
  
  :deep(.el-table__row:hover) {
    background-color: #f5f7fa;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
    
    .header-actions {
      justify-content: center;
    }
    
    :deep(.el-table) {
      font-size: 0.9rem;
    }
    
    :deep(.el-table .el-table__cell) {
      padding: 8px 4px;
    }
  }
  
  @media (max-width: 480px) {
    .header-actions {
      flex-direction: column;
    }
    
    :deep(.el-dialog) {
      width: 95vw !important;
      margin: 0 auto;
    }
    
    :deep(.el-table .cell) {
      word-break: break-word;
    }
  }
  </style>
  
  