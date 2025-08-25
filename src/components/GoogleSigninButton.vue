<template>
  <div class="google-signin">
    <button @click="signInWithGoogle" class="google-btn" :disabled="isLoading">
      <svg class="google-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span v-if="!isLoading">{{ $t('auth.signInWithGoogle') }}</span>
      <span v-else>{{ $t('common.loading') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isLoading = ref(false)

const signInWithGoogle = async () => {
  try {
    isLoading.value = true
    
    // Get the auth URL from backend
    const redirectUri = 'http://localhost:3001'
    const authUrl = `http://localhost:3000/admin/auth/google/init?redirect_uri=${encodeURIComponent(redirectUri)}`
    
    // Fetch the auth URL and redirect
    const response = await fetch(authUrl)
    const data = await response.json()
    
    if (data.authUrl) {
      // Redirect to Google OAuth
      window.location.href = `http://localhost:3000${data.authUrl}`
    } else {
      throw new Error('No auth URL received from backend')
    }
  } catch (error) {
    console.error('Error initiating Google OAuth:', error)
    isLoading.value = false
  }
}
</script>

<style scoped>
.google-signin {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 235px;
  height: 43px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 80px;
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 17.9182px;
  line-height: 27px;
  color: #333333;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.google-btn:hover:not(:disabled) {
  background: #F0F0F0;
  border-color: #C0C0C0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.google-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
</style>
