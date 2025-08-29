<template>
  <div class="login-container">
    <div class="login-content">
      <!-- LearnZone Logo/Title -->
      <div class="brand-section">
        <h1 class="brand-title">LearnZone</h1>
        <p class="brand-subtitle">Admin Dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-description">
            Please sign in as an administrator using Google account
          </p>
        </div>

        <!-- Google Sign In Button -->
        <div class="google-signin-section">
          <GoogleSigninButton />
        </div>

        <!-- Language Switcher -->
        <div class="language-section">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../../components/LanguageSwitcher.vue'
import GoogleSigninButton from '../../components/GoogleSigninButton.vue'

const { t } = useI18n()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.login-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #5767b3 0%, #8667a5 100%);
  position: relative;
  overflow: hidden;
}

/* Background decorative elements */
.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

.login-container::after {
  content: '';
  position: absolute;
  bottom: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 10;
  position: relative;
  max-width: 500px;
  width: 90%;
}

/* Brand Section */
.brand-section {
  text-align: center;
  margin-bottom: 1rem;
}

.brand-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 0 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.card-header {
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #303133;
  margin: 0 0 0.5rem 0;
}

.login-description {
  font-size: 1rem;
  color: #606266;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
}

/* Google Sign In Section */
.google-signin-section {
  margin-bottom: 2rem;
}

/* Language Section */
.language-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2.8rem;
  }
  
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 2.4rem;
  }
  
  .login-card {
    padding: 1.5rem 1rem;
  }
}
</style>