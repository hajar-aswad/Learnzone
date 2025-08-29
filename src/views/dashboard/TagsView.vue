<template>
  <div class="tags-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>Tags Management</h2>
        <p>Manage content tags for courses and materials</p>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          @click="showAddTagModal = true"
        >
          <el-icon><Plus /></el-icon>
          Add New Tag
        </el-button>
        <el-button
          @click="() => { refreshTags(); refreshContentTypes(); }"
          :loading="isLoading || contentTypesLoading"
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
        sub-title="Failed to load tags"
      >
        <template #extra>
          <el-button type="primary" @click="refreshTags">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>

         <!-- Empty State -->
     <div v-else-if="!isLoading && !hasTags" class="empty-container">
       <el-empty description="No tags found">
         <el-button type="primary" @click="showAddTagModal = true">
           Add First Tag
         </el-button>
       </el-empty>
     </div>
     
     



         <!-- Tags List Grouped by Type -->
     <div v-else-if="hasTags" class="tags-content">
       <div v-for="(typeGroup, typeName) in groupedTags" :key="typeName" class="type-group">
         <div class="type-header">
           <h3>{{ typeName }}</h3>
           <span class="tag-count">{{ typeGroup.length }} tag{{ typeGroup.length !== 1 ? 's' : '' }}</span>
         </div>
         
         <div class="tags-grid">
           <el-card
             v-for="tag in typeGroup"
             :key="tag.id"
             class="tag-card"
           >
             <div class="tag-content">
               <div class="tag-info">
                 <div class="tag-name">
                   {{ tag.name }}
                 </div>
                 <div class="tag-created">
                   Created: {{ formatDate(tag.createdAt) }}
                 </div>
               </div>
               <div class="tag-actions">
                 <el-button
                   type="primary"
                   size="small"
                   @click="editTag(tag)"
                 >
                   <el-icon><Edit /></el-icon>
                   Edit
                 </el-button>
               </div>
             </div>
           </el-card>
         </div>
       </div>
     </div>

    <!-- Add/Edit Tag Modal -->
         <el-dialog
       v-model="showAddTagModal"
       :title="isEditing ? 'Edit Tag Name' : 'Add New Tag'"
       width="500px"
       :close-on-click-modal="false"
     >
      <el-form
        ref="tagFormRef"
        :model="tagForm"
        :rules="tagFormRules"
        label-width="120px"
        @submit.prevent="submitTagForm"
      >
                 <el-form-item label="Tag Name" prop="name">
           <el-input
             v-model="tagForm.name"
             placeholder="Enter tag name (e.g., grammar, vocabulary)"
             :maxlength="50"
             show-word-limit
             clearable
           />
         </el-form-item>
         
         <!-- Only show type selection when creating new tag, not when editing -->
         <el-form-item 
           v-if="!isEditing" 
           label="Language Type" 
           prop="typeId"
         >
           <el-select
             v-model="tagForm.typeId"
             placeholder="Select language type"
             style="width: 100%"
             :loading="contentTypesLoading"
           >
             <el-option
               v-for="type in contentTypes"
               :key="type.id"
               :label="type.name"
               :value="type.id"
             />
             <el-option
               v-if="!contentTypes || contentTypes.length === 0"
               label="Loading types..."
               value=""
               disabled
             />
           </el-select>
         </el-form-item>
         
         <!-- Show current type when editing (read-only) -->
         <el-form-item 
           v-if="isEditing" 
           label="Current Type"
         >
           <el-input
             :value="getTypeName(tagForm.typeId)"
             disabled
             style="width: 100%"
           />
         </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelTagForm">Cancel</el-button>
          <el-button
            type="primary"
            @click="submitTagForm"
            :loading="isCreating"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useTagsQueries, useContentTypeQueries } from '@/tanstack/queries'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Plus, 
  Refresh, 
  Edit
} from '@element-plus/icons-vue'
import type { Tag, CreateTagRequest, ContentType } from '@/tanstack/types'
import * as tagsApi from '@/api/tags'

// Reactive data
const showAddTagModal = ref(false)
const isEditing = ref(false)
const tagFormRef = ref<FormInstance>()


// Form data
const tagForm = reactive<CreateTagRequest & { id?: number }>({
  name: '',
  typeId: 1 // Will be updated when contentTypes load
})

// Form validation rules
const tagFormRules: FormRules = {
  name: [
    { required: true, message: 'Tag name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Tag name must be between 2 and 50 characters', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9\s\-_]+$/, 
      message: 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores', 
      trigger: 'blur' 
    }
  ],
  typeId: [
    { required: true, message: 'Type ID is required', trigger: 'change' }
  ]
}

// Query hooks
const { useTags } = useTagsQueries()
const { useContentTypes } = useContentTypeQueries()

const tagsQuery = useTags()
const contentTypesQuery = useContentTypes()

// Computed properties
const tagsData = computed(() => tagsQuery.data.value)
const isLoading = computed(() => tagsQuery.isLoading.value)
const error = computed(() => tagsQuery.error.value?.message)
const contentTypes = computed(() => contentTypesQuery.data.value)
const contentTypesLoading = computed(() => contentTypesQuery.isLoading.value)
const isCreating = ref(false)

// Watch for content types to load and set default typeId
watch(contentTypes, (newTypes) => {
  if (newTypes && newTypes.length > 0 && !isEditing.value) {
    tagForm.typeId = newTypes[0].id
  }
}, { immediate: true })

// Get tags organized by type (from backend)
const groupedTags = computed(() => {
  if (!tagsData.value?.tagsByType || !contentTypes.value) return {}
  
  const groups: { [key: string]: Tag[] } = {}
  
  // Convert numeric keys to type names
  Object.keys(tagsData.value.tagsByType).forEach(typeId => {
    const type = contentTypes.value.find(t => t.id === parseInt(typeId))
    const typeName = type ? type.name : `Type ${typeId}`
    
    if (tagsData.value.tagsByType[typeId] && Array.isArray(tagsData.value.tagsByType[typeId])) {
      groups[typeName] = [...tagsData.value.tagsByType[typeId]]
      // Sort tags within each group by name
      groups[typeName].sort((a, b) => a.name.localeCompare(b.name))
    }
  })
  
  return groups
})

// Check if we have any tags
const hasTags = computed(() => {
  if (!tagsData.value?.tagsByType) return false
  const keys = Object.keys(tagsData.value.tagsByType)
  return keys.length > 0 && keys.some(key => 
    Array.isArray(tagsData.value.tagsByType[key]) && 
    tagsData.value.tagsByType[key].length > 0
  )
})

// Methods
const refreshTags = () => {
  tagsQuery.refetch()
}

const refreshContentTypes = () => {
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

const resetTagForm = () => {
  tagForm.name = ''
  tagForm.typeId = contentTypes.value?.[0]?.id || 1
  tagForm.id = undefined
  isEditing.value = false
  tagFormRef.value?.resetFields()
}

const cancelTagForm = () => {
  showAddTagModal.value = false
  resetTagForm()
}

const submitTagForm = async () => {
  if (!tagFormRef.value) return
  
  try {
    await tagFormRef.value.validate()
    
    isCreating.value = true
    
    if (isEditing.value) {
      // Update existing tag
      await tagsApi.updateTag(tagForm.id!, {
        name: tagForm.name.trim(),
        typeId: tagForm.typeId
      })
      ElMessage.success('Tag updated successfully!')
    } else {
      // Create new tag
      await tagsApi.createTag({
        name: tagForm.name.trim(),
        typeId: tagForm.typeId
      })
      ElMessage.success('Tag created successfully!')
    }
    
    showAddTagModal.value = false
    resetTagForm()
    refreshTags()
  } catch (error: any) {
    console.error('Tag form error:', error)
    ElMessage.error(error.message || 'Failed to save tag')
  } finally {
    isCreating.value = false
  }
}

const editTag = (tag: Tag) => {
  tagForm.name = tag.name
  tagForm.typeId = tag.typeId
  tagForm.id = tag.id
  isEditing.value = true
  showAddTagModal.value = true
}

// Helper function to get type name from type ID
const getTypeName = (typeId: number): string => {
  if (!contentTypes.value) return `Type ${typeId}`
  
  const type = contentTypes.value.find(t => t.id === typeId)
  return type ? type.name : `Type ${typeId}`
}


</script>

<style scoped>
.tags-container {
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

.type-header h3 {
  margin: 0;
  color: #303133;
  font-size: 1.4rem;
  font-weight: 600;
}

.tag-count {
  background: #409eff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Tags Grid */
.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.tag-card {
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.tag-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.tag-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.tag-info {
  flex: 1;
}

.tag-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.tag-created {
  font-size: 0.9rem;
  color: #909399;
}

.tag-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

/* Modal Styles */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Debug Info Styles */
.debug-info {
  margin: 20px 0;
}

.debug-info pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
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
  
  .tags-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .tag-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
