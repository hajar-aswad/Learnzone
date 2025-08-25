<template>
  <div class="auth-success-container">
    <div class="auth-success-content">
      <div class="success-icon">✅</div>
      <h2>{{ $t('auth.authenticationSuccessful') }}</h2>
      <p>{{ $t('auth.redirectingToDashboard') }}</p>
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { JwtService } from '@/core/services/JwtService'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  try {
    // Extract tokens from URL
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('accessToken')
    const userParam = urlParams.get('user')
    const youtubeTokensParam = urlParams.get('youtubeTokens')
    
    if (accessToken && userParam) {
      // Parse user data
      const user = JSON.parse(decodeURIComponent(userParam))
      const youtubeTokens = youtubeTokensParam ? JSON.parse(decodeURIComponent(youtubeTokensParam)) : {}
      
      // Store tokens in JwtService
      JwtService.saveToken(accessToken)
      
      // Store additional data in localStorage
      localStorage.setItem('youtubeTokens', JSON.stringify(youtubeTokens))
      
      // Convert user data to our format
      const appUser = {
        id: parseInt(user.id),
        fName: user.name.split(' ')[0] || user.name,
        lName: user.name.split(' ').slice(1).join(' ') || '',
        phoneNumber: '',
        active: true,
        email: user.email,
        role: user.role,
        createdAt: new Date().toISOString(),
        accessToken: accessToken
      }
      
      // Set user in auth store
      authStore.setUser(appUser)
      authStore.setAuthenticated(true)
      
             // Redirect to dashboard after a short delay
       setTimeout(() => {
         // Use window.location.href to ensure we stay on port 3001
         window.location.href = 'http://localhost:3001/dashboard/home'
       }, 2000)
    } else {
             // Missing required parameters, redirect to login
       console.error('Missing required authentication parameters')
       window.location.href = 'http://localhost:3001/login'
    }
     } catch (error) {
     console.error('Error processing authentication:', error)
     window.location.href = 'http://localhost:3001/login'
   }
})
</script>

<style scoped>
.auth-success-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
}

.auth-success-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-success-content h2 {
  color: #27ae60;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.auth-success-content p {
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
