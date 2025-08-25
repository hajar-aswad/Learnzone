<template>
     <el-dialog
     v-model="visible"
     :title="`${title} - Monthly Data (${year})`"
     width="900px"
     :close-on-click-modal="false"
     class="monthly-chart-modal"
   >
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="error" class="error-container">
      <el-alert
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />
    </div>
    
    <div v-else class="chart-content">
      <!-- Monthly Bar Chart -->
      <div class="chart-section">
        <h3>{{ title }} Growth</h3>
        <div class="chart-container">
          <div 
            v-for="month in monthlyData" 
            :key="month.month" 
            class="bar-item"
            @click="showMonthDetails(month)"
          >
            <div 
              class="bar" 
              :style="{ 
                height: getBarHeight(month.count, maxCount) + 'px',
                background: month.count > 0 ? getBarColor(month.count, maxCount) : '#e0e0e0'
              }"
            >
              <span class="bar-value">{{ month.count }}</span>
            </div>
            <span class="month-label">{{ month.monthName }}</span>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">Total This Year:</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Average per Month:</span>
          <span class="stat-value">{{ averageCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Best Month:</span>
          <span class="stat-value">{{ bestMonth }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeModal">Close</el-button>
        <el-button 
          type="primary" 
          @click="refreshData"
          :loading="refreshing"
        >
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

interface MonthlyData {
  month: number
  monthName: string
  year: number
  count: number
}

interface Props {
  modelValue: boolean
  type: 'students' | 'teachers' | 'reels' | 'articles' | 'shortVideos'
  title: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Reactive data
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const monthlyData = ref<MonthlyData[]>([])
const loading = ref(false)
const refreshing = ref(false)
const error = ref<string | null>(null)
const year = ref(new Date().getFullYear())

// Computed properties
const maxCount = computed(() => {
  if (monthlyData.value.length === 0) return 0
  return Math.max(...monthlyData.value.map(m => m.count))
})

const totalCount = computed(() => {
  return monthlyData.value.reduce((sum, month) => sum + month.count, 0)
})

const averageCount = computed(() => {
  if (monthlyData.value.length === 0) return 0
  return Math.round(totalCount.value / monthlyData.value.length)
})

const bestMonth = computed(() => {
  if (monthlyData.value.length === 0) return 'N/A'
  const best = monthlyData.value.reduce((max, month) => 
    month.count > max.count ? month : max
  )
  return `${best.monthName} (${best.count})`
})

// Methods
const loadMonthlyData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Import the API function dynamically based on type
    const apiModule = await import('@/api/statistics')
    const apiFunction = `getMonthly${props.type.charAt(0).toUpperCase() + props.type.slice(1)}`
    
    if (apiModule[apiFunction]) {
      const data = await apiModule[apiFunction]()
      monthlyData.value = data.monthlyData || []
      year.value = data.year || new Date().getFullYear()
    } else {
      throw new Error(`API function ${apiFunction} not found`)
    }
  } catch (e: any) {
    console.error(`Failed to load monthly ${props.type} data:`, e)
    error.value = e?.response?.data?.message || `Failed to load monthly ${props.type} data`
    ElMessage.error(`Failed to load monthly ${props.type} data`)
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  refreshing.value = true
  await loadMonthlyData()
  refreshing.value = false
}

const closeModal = () => {
  visible.value = false
}

const getBarHeight = (value: number, max: number) => {
  if (max === 0) return 0
  return Math.max((value / max) * 200, 20) // Min height 20px, max 200px
}

const getBarColor = (value: number, max: number) => {
  if (value === 0) return '#e0e0e0'
  if (value === max) return '#667eea' // Primary gradient color for best month
  if (value >= max * 0.7) return '#f093fb' // Secondary gradient color for good months
  return '#4facfe' // Default blue from your program
}

const showMonthDetails = (month: MonthlyData) => {
  if (month.count > 0) {
    ElMessage.info(`${month.monthName}: ${month.count} ${props.title}`)
  }
}

// Watch for type changes and load data
watch(() => props.type, () => {
  if (visible.value) {
    loadMonthlyData()
  }
})

// Load data when modal opens
watch(visible, (newValue) => {
  if (newValue) {
    loadMonthlyData()
  }
})
</script>

<style scoped>
.monthly-chart-modal {
  .chart-content {
    padding: 20px 0;
  }
}

:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
}

:deep(.el-dialog__body) {
  padding: 30px;
}

:deep(.el-dialog__footer) {
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.loading-container,
.error-container {
  padding: 40px;
  text-align: center;
}

.chart-section {
  margin-bottom: 30px;
}

.chart-section h3 {
  margin: 0 0 25px 0;
  color: #303133;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 280px;
  padding: 30px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  gap: 8px;
  position: relative;
  border: 1px solid #e9ecef;
  min-width: 100%;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  border-radius: 16px;
  pointer-events: none;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bar-item:nth-child(1) { animation-delay: 0.1s; }
.bar-item:nth-child(2) { animation-delay: 0.2s; }
.bar-item:nth-child(3) { animation-delay: 0.3s; }
.bar-item:nth-child(4) { animation-delay: 0.4s; }
.bar-item:nth-child(5) { animation-delay: 0.5s; }
.bar-item:nth-child(6) { animation-delay: 0.6s; }
.bar-item:nth-child(7) { animation-delay: 0.7s; }
.bar-item:nth-child(8) { animation-delay: 0.8s; }
.bar-item:nth-child(9) { animation-delay: 0.9s; }
.bar-item:nth-child(10) { animation-delay: 1.0s; }
.bar-item:nth-child(11) { animation-delay: 1.1s; }
.bar-item:nth-child(12) { animation-delay: 1.2s; }

.bar-item:hover {
  transform: translateY(-4px);
}

.bar-item:hover .bar {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  transform: scale(1.05);
}

.bar {
  width: 35px;
  min-height: 20px;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(180deg, var(--bar-color) 0%, var(--bar-color-dark) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.bar-value {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  color: #303133;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
  min-width: 30px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.month-label {
  margin-top: 15px;
  font-size: 11px;
  color: #606266;
  text-align: center;
  transform: rotate(-45deg);
  white-space: nowrap;
  max-width: 65px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  padding: 3px 6px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.stat-label {
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
}

.stat-value {
  color: #303133;
  font-weight: 700;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

:deep(.el-button) {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

:deep(.el-button--default) {
  border: 2px solid #667eea;
  color: #667eea;
  background: transparent;
}

:deep(.el-button--default:hover) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .chart-container {
    flex-wrap: wrap;
    height: auto;
    gap: 15px;
  }
  
  .bar-item {
    margin-bottom: 20px;
    flex: 0 0 calc(25% - 15px);
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .month-label {
    transform: none;
    max-width: none;
  }
}
</style>
