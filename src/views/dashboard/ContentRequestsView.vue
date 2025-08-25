<template>
    <div class="content-requests-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h2>Content Requests</h2>
          <p>Manage pending video content requests from teachers</p>
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
          sub-title="Failed to load content requests"
        >
          <template #extra>
            <el-button type="primary" @click="refreshRequests">
              Try Again
            </el-button>
          </template>
        </el-result>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="!contentRequests || contentRequests.length === 0" class="empty-container">
        <el-empty description="No content requests found">
          <el-button type="primary" @click="refreshRequests">
            Refresh
          </el-button>
        </el-empty>
      </div>
  
      <!-- Content Requests List -->
      <div v-else class="requests-list">
        <el-card
          v-for="courseRequest in contentRequests"
          :key="courseRequest.courseId"
          class="course-card"
        >
          <template #header>
            <div class="course-header">
              <div class="course-info">
                <h3 class="course-title">{{ courseRequest.courseTitle }}</h3>
                <p class="teacher-name">Teacher: {{ courseRequest.teacherName }}</p>
              </div>
              <el-tag type="warning">{{ courseRequest.videos.length }} Videos Pending</el-tag>
            </div>
          </template>
  
          <div class="videos-grid">
            <div
              v-for="video in courseRequest.videos"
              :key="video.id"
              class="video-card"
              @click="openVideoModal(video)"
            >
              <div class="video-thumbnail">
                <img
                  v-if="video.thumbnail_url"
                  :src="video.thumbnail_url"
                  :alt="video.title"
                  class="thumbnail-image"
                />
                <div v-else class="thumbnail-placeholder">
                  <el-icon class="video-icon"><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="video-info">
                <h4 class="video-title">{{ video.title }}</h4>
                <p class="video-description">{{ truncateText(video.description, 100) }}</p>
                <div class="video-meta">
                  <el-tag size="small" type="info">Video #{{ video.number }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
  
      <!-- Video Modal -->
      <el-dialog
        v-model="showVideoModal"
        :title="selectedVideo?.title"
        width="80%"
        :close-on-click-modal="false"
        class="video-modal"
      >
        <div v-if="selectedVideo" class="video-modal-content">
          <!-- Video Player -->
          <div class="video-player-container">
            <!-- YouTube Embed -->
            <iframe
              v-if="isYouTubeVideo(selectedVideo)"
              :src="getVideoEmbedUrl(selectedVideo) || undefined"
              frameborder="0"
              allowfullscreen
              class="video-player"
            ></iframe>
            
            <!-- Local Video File -->
            <video
              v-else-if="isLocalVideo(selectedVideo)"
              :src="getVideoEmbedUrl(selectedVideo) || undefined"
              controls
              class="video-player"
              preload="metadata"
              @error="handleVideoError"
            >
              Your browser does not support the video tag.
            </video>
            
            <!-- No Video Available -->
            <div v-else class="video-placeholder">
              <el-icon class="placeholder-icon"><VideoPlay /></el-icon>
              <p>Video not available</p>
              <div class="video-debug-info" v-if="selectedVideo">
                <p><strong>Debug Info:</strong></p>
                <p>videoUrl: {{ selectedVideo.videoUrl || 'null' }}</p>
                <p>youtubeVideoId: {{ selectedVideo.youtubeVideoId || 'null' }}</p>
                <p>path: {{ selectedVideo.path || 'null' }}</p>
              </div>
            </div>
          </div>
  
          <!-- Video Details -->
          <div class="video-details">
            <el-card class="detail-section">
              <template #header>
                <div class="card-header">
                  <span>Video Information</span>
                </div>
              </template>
              
              <el-descriptions :column="2" border>
                <el-descriptions-item label="Title">
                  {{ selectedVideo.title }}
                </el-descriptions-item>
                <el-descriptions-item label="Video Number">
                  <el-tag type="info">#{{ selectedVideo.number }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="Course ID">
                  {{ selectedVideo.courseId }}
                </el-descriptions-item>
                <el-descriptions-item label="Status">
                  <el-tag :type="selectedVideo.approaved ? 'success' : 'warning'">
                    {{ selectedVideo.approaved ? 'Approved' : 'Pending' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="Description" :span="2">
                  <div class="video-description-full">
                    {{ selectedVideo.description }}
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
        </div>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showVideoModal = false">Close</el-button>
            <el-button
              type="danger"
              @click="disapproveVideo"
              :loading="isDisapproving"
            >
              Disapprove
            </el-button>
            <el-button
              type="success"
              @click="approveVideo"
              :loading="isApproving"
            >
              Approve
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useContentRequestQueries } from '@/tanstack/queries'
  import { ElMessage } from 'element-plus'
  import { Refresh, VideoPlay } from '@element-plus/icons-vue'
  import type { CourseVideo } from '@/tanstack/types'
  
  const showVideoModal = ref(false)
  const selectedVideo = ref<CourseVideo | null>(null)
  
  const {
    useUnapprovedVideos,
    useApproveVideo,
    useDisapproveVideo
  } = useContentRequestQueries()
  
  // Query hooks
  const contentRequestsQuery = useUnapprovedVideos()
  const approveMutation = useApproveVideo()
  const disapproveMutation = useDisapproveVideo()
  
  // Computed properties
  const contentRequests = computed(() => contentRequestsQuery.data.value)
  const isLoading = computed(() => contentRequestsQuery.isLoading.value)
  const error = computed(() => contentRequestsQuery.error.value?.message)
  
  const isApproving = computed(() => approveMutation.isPending.value)
  const isDisapproving = computed(() => disapproveMutation.isPending.value)
  
  // Methods
  const refreshRequests = () => {
    contentRequestsQuery.refetch()
  }
  
  const openVideoModal = (video: CourseVideo) => {
    console.log('Opening video modal with video:', video)
    console.log('Video URL fields:')
    console.log('- videoUrl:', video.videoUrl)
    console.log('- youtubeVideoId:', video.youtubeVideoId)
    console.log('- path:', video.path)
    selectedVideo.value = video
    showVideoModal.value = true
  }
  
  const approveVideo = async () => {
    if (!selectedVideo.value) return
    
    try {
      await approveMutation.mutateAsync(selectedVideo.value.id)
      showVideoModal.value = false
      selectedVideo.value = null
    } catch (error) {
      // Error handled by mutation
    }
  }
  
  const disapproveVideo = async () => {
    if (!selectedVideo.value) return
    
    try {
      await disapproveMutation.mutateAsync(selectedVideo.value.id)
      showVideoModal.value = false
      selectedVideo.value = null
    } catch (error) {
      // Error handled by mutation
    }
  }
  
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  const getEmbedUrl = (videoUrl: string): string => {
    // Convert YouTube URL to embed format
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1].split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return videoUrl
  }

  const getVideoEmbedUrl = (video: CourseVideo): string | null => {
    // Try multiple sources to get a valid video URL
    console.log('Video object for embed URL:', video)
    
    // First try: videoUrl field
    if (video.videoUrl && video.videoUrl.trim()) {
      console.log('Using videoUrl:', video.videoUrl)
      return getEmbedUrl(video.videoUrl)
    }
    
    // Second try: youtubeVideoId field
    if (video.youtubeVideoId && video.youtubeVideoId.trim()) {
      console.log('Using youtubeVideoId:', video.youtubeVideoId)
      return `https://www.youtube.com/embed/${video.youtubeVideoId}`
    }
    
    // Third try: path field (if it's a YouTube URL)
    if (video.path && video.path.includes('youtube.com')) {
      console.log('Using path:', video.path)
      return getEmbedUrl(video.path)
    }
    
    // Fourth try: if path looks like a YouTube video ID
    if (video.path && video.path.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(video.path)) {
      console.log('Using path as video ID:', video.path)
      return `https://www.youtube.com/embed/${video.path}`
    }
    
    // Fifth try: local video file (path field)
    if (video.path && !video.path.includes('youtube.com') && !video.path.includes('http')) {
      console.log('Using local video path:', video.path)
      // Convert Windows path to URL format and serve from backend
      const videoFileName = video.path.split('\\').pop() // Get filename from path
      return `http://localhost:3000/uploads/videos/${videoFileName}`
    }
    
    console.log('No valid video URL found')
    return null
  }

  const isYouTubeVideo = (video: CourseVideo): boolean => {
    if (!video) return false
    
    // Check if any field contains YouTube URL or video ID
    return !!(
      (video.videoUrl && video.videoUrl.includes('youtube.com')) ||
      (video.youtubeVideoId && video.youtubeVideoId.trim()) ||
      (video.path && video.path.includes('youtube.com')) ||
      (video.path && video.path.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(video.path))
    )
  }

  const isLocalVideo = (video: CourseVideo): boolean => {
    if (!video) return false
    
    // Check if path contains a local file (not YouTube, not HTTP)
    return !!(
      video.path && 
      !video.path.includes('youtube.com') && 
      !video.path.includes('http') &&
      (video.path.includes('\\') || video.path.includes('/'))
    )
  }

  const handleVideoError = (event: Event) => {
    console.error('Video failed to load:', event)
    ElMessage.error('Failed to load video. Please check if the file exists on the server.')
  }
  </script>
  
  <style scoped>
  .content-requests-container {
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
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .course-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .course-info {
    flex: 1;
  }
  
  .course-title {
    margin: 0 0 4px 0;
    color: #303133;
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .teacher-name {
    margin: 0;
    color: #606266;
    font-size: 0.9rem;
  }
  
  .videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }
  
  .video-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .video-thumbnail {
    position: relative;
    width: 100%;
    height: 180px;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .thumbnail-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
  }
  
  .video-icon {
    font-size: 3rem;
    margin-bottom: 8px;
  }
  
  .video-info {
    padding: 16px;
  }
  
  .video-title {
    margin: 0 0 8px 0;
    color: #303133;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
  }
  
  .video-description {
    margin: 0 0 12px 0;
    color: #606266;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Video Modal Styles */
  .video-modal {
    --el-dialog-width: 90vw;
  }
  
  .video-modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .video-player-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Ensure video element has proper styling */
  .video-player-container video.video-player {
    object-fit: contain;
    background: #000;
  }
  
  .video-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
  }
  
  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }

  .video-debug-info {
    margin-top: 20px;
    padding: 16px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    text-align: left;
    max-width: 400px;
  }

  .video-debug-info p {
    margin: 4px 0;
    font-size: 0.9rem;
    font-family: monospace;
  }

  .video-debug-info strong {
    color: #0369a1;
  }
  
  .video-details {
    flex: 1;
  }
  
  .detail-section {
    margin-bottom: 20px;
  }
  
  .card-header {
    font-weight: 600;
    color: #303133;
  }
  
  .video-description-full {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.6;
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
    
    .course-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    
    .videos-grid {
      grid-template-columns: 1fr;
    }
    
    .video-modal {
      --el-dialog-width: 95vw;
    }
    
    .video-modal-content {
      gap: 16px;
    }
  }
  
  @media (max-width: 480px) {
    .video-thumbnail {
      height: 150px;
    }
    
    .video-info {
      padding: 12px;
    }
    
    .video-title {
      font-size: 1rem;
    }
    
    .video-description {
      font-size: 0.85rem;
    }
  }
  </style>
  
  