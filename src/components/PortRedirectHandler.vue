<template>
  <div class="redirect-container">
    <div class="redirect-content">
      <div class="redirect-icon">🔄</div>
      <h2>Redirecting to your app...</h2>
      <p>Please wait while we redirect you to the correct port.</p>
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Get the current URL
  const currentUrl = window.location.href
  
  // If we're on port 8080, redirect to port 3001
  if (currentUrl.includes('localhost:8080')) {
    const newUrl = currentUrl.replace('localhost:8080', 'localhost:3001')
    console.log('Redirecting from port 8080 to port 3001:', newUrl)
    
    // Redirect immediately
    window.location.href = newUrl
  }
})
</script>

<style scoped>
.redirect-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
}

.redirect-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.redirect-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.redirect-content h2 {
  color: #667eea;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.redirect-content p {
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
