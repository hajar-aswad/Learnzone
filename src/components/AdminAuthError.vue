<template>
  <div class="auth-error-container">
    <div class="auth-error-content">
      <div class="error-icon">❌</div>
      <h2>{{ $t('auth.authenticationFailed') }}</h2>
      <p>{{ errorMessage }}</p>
      <button @click="goBack" class="retry-btn">
        {{ $t('auth.tryAgain') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const errorMessage = ref('')

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  errorMessage.value = urlParams.get('message') || t('auth.unknownError')
})

const goBack = () => {
  window.location.href = 'http://localhost:3001/login'
}
</script>

<style scoped>
.auth-error-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
}

.auth-error-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-error-content h2 {
  color: #e74c3c;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.auth-error-content p {
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #5a6fd8;
}
</style>
